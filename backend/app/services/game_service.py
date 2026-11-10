from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.game import Game, GameSession, GameResult
from app.models.user import UserStats
from app.models.challenge import DailyActivity
from app.services.engines import get_game_engine
from app.services.scoring_service import scoring_service
from app.services.xp_service import xp_service
from app.services.achievement_service import achievement_service
from app.services.challenge_service import challenge_service
from app.schemas.session import (
    SessionChallengePayload,
    SubmitAnswerResponse,
    SessionResultResponse,
)


class GameService:
    @staticmethod
    async def start_session(
        db: AsyncSession,
        user_id: int,
        game_slug: str,
        difficulty: str = "Medium",
    ) -> SessionChallengePayload:
        stmt = select(Game).where(Game.slug == game_slug, Game.is_active == True)
        game = (await db.execute(stmt)).scalar_one_or_none()
        if not game:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game '{game_slug}' not found or inactive",
            )

        engine = get_game_engine(game.slug, game.category)
        session_seed = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
        initial_challenges = engine.generate_challenges(difficulty, session_seed)

        session = GameSession(
            user_id=user_id,
            game_id=game.id,
            difficulty=difficulty,
            status="in_progress",
            seed=session_seed,
            result_data={
                "challenges": initial_challenges,
                "answers": [],
            },
        )
        db.add(session)
        await db.flush()

        return SessionChallengePayload(
            session_id=session.id,
            game_slug=game.slug,
            game_name=game.name,
            category=game.category,
            difficulty=difficulty,
            seed=session_seed,
            started_at=session.started_at,
            initial_challenges=initial_challenges,
            rules={"difficulty": difficulty, "total_steps": len(initial_challenges)},
        )

    @staticmethod
    async def submit_answer(
        db: AsyncSession,
        user_id: int,
        session_id: str,
        step_index: int,
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> SubmitAnswerResponse:
        stmt = select(GameSession, Game).join(Game, GameSession.game_id == Game.id).where(GameSession.id == session_id)
        res = (await db.execute(stmt)).first()
        if not res:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

        session, game = res
        if session.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized session access")
        if session.status != "in_progress":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session is not in progress")

        result_data = dict(session.result_data or {})
        challenges = result_data.get("challenges", [])
        if step_index >= len(challenges):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid step index")

        chal = challenges[step_index]
        engine = get_game_engine(game.slug, game.category)
        is_correct, pts, feedback = engine.validate_answer(chal, answer, elapsed_ms)

        answers = result_data.get("answers", [])
        answers.append({
            "step_index": step_index,
            "answer": answer,
            "elapsed_ms": elapsed_ms,
            "is_correct": is_correct,
            "points": pts,
        })
        result_data["answers"] = answers
        session.result_data = result_data

        # Calculate live streak
        streak = 0
        for a in reversed(answers):
            if a.get("is_correct"):
                streak += 1
            else:
                break

        return SubmitAnswerResponse(
            step_index=step_index,
            is_correct=is_correct,
            points_awarded=pts,
            streak=streak,
            feedback=feedback,
            next_challenge=challenges[step_index + 1] if step_index + 1 < len(challenges) else None,
        )

    @staticmethod
    async def complete_session(
        db: AsyncSession,
        user_id: int,
        session_id: str,
        duration_seconds: int,
        client_score: int = 0,
        client_accuracy: float = 0.0,
        results_summary: Optional[Dict[str, Any]] = None,
    ) -> SessionResultResponse:
        stmt = select(GameSession, Game).join(Game, GameSession.game_id == Game.id).where(GameSession.id == session_id)
        res = (await db.execute(stmt)).first()
        if not res:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

        session, game = res
        if session.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized session access")
        if session.status == "completed":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session already completed")

        result_data = dict(session.result_data or {})
        challenges = result_data.get("challenges", [])
        answers = result_data.get("answers", [])

        engine = get_game_engine(game.slug, game.category)
        if answers:
            score, accuracy, rx_time = engine.evaluate_full_session(challenges, answers, duration_seconds)
        else:
            # Fallback if answers submitted in batch
            score = max(0, client_score)
            accuracy = max(0.0, min(100.0, client_accuracy))
            rx_time = None

        now = datetime.now(timezone.utc)
        session.completed_at = now
        session.duration_seconds = duration_seconds
        session.score = score
        session.accuracy = accuracy
        session.status = "completed"

        # Fetch stats to calculate streak and XP rewards
        stats_stmt = select(UserStats).where(UserStats.user_id == user_id)
        stats = (await db.execute(stats_stmt)).scalar_one_or_none()
        if not stats:
            stats = UserStats(user_id=user_id)
            db.add(stats)
            await db.flush()

        xp_earned, coins_earned = xp_service.calculate_game_rewards(
            score=score,
            accuracy=accuracy,
            difficulty=session.difficulty,
            current_streak=stats.current_streak,
        )

        # Update stats
        stats.total_xp += xp_earned
        stats.coins += coins_earned
        stats.total_games_played += 1
        stats.total_play_time += duration_seconds

        # Running average of accuracy
        if stats.total_games_played > 1:
            stats.accuracy_average = round(
                ((stats.accuracy_average * (stats.total_games_played - 1)) + accuracy) / stats.total_games_played,
                1,
            )
        else:
            stats.accuracy_average = accuracy

        # Check streak: if last active was yesterday, streak + 1. If today, keep. If > 1 day ago, reset to 1
        today_date = now.date()
        if stats.last_active_date:
            last_date = stats.last_active_date.date()
            if last_date == today_date - timedelta(days=1):
                stats.current_streak += 1
                if stats.current_streak > stats.longest_streak:
                    stats.longest_streak = stats.current_streak
            elif last_date < today_date - timedelta(days=1):
                stats.current_streak = 1
        else:
            stats.current_streak = 1
            stats.longest_streak = 1
        stats.last_active_date = now

        # Update level
        new_level, _, _ = xp_service.compute_level_from_xp(stats.total_xp)
        stats.level = new_level

        # Create GameResult
        game_res = GameResult(
            user_id=user_id,
            game_id=game.id,
            session_id=session.id,
            score=score,
            accuracy=accuracy,
            reaction_time=rx_time,
            difficulty=session.difficulty,
            xp_earned=xp_earned,
            coins_earned=coins_earned,
            created_at=now,
        )
        db.add(game_res)

        # Update DailyActivity
        act_stmt = select(DailyActivity).where(
            DailyActivity.user_id == user_id,
            DailyActivity.activity_date == today_date,
        )
        activity = (await db.execute(act_stmt)).scalar_one_or_none()
        if not activity:
            activity = DailyActivity(
                user_id=user_id,
                activity_date=today_date,
                games_played=1,
                xp_earned=xp_earned,
                play_time=duration_seconds,
                accuracy=accuracy,
            )
            db.add(activity)
        else:
            activity.games_played += 1
            activity.xp_earned += xp_earned
            activity.play_time += duration_seconds
            activity.accuracy = round(((activity.accuracy * (activity.games_played - 1)) + accuracy) / activity.games_played, 1)

        await db.flush()

        # Recalculate brain score
        new_brain_score, brain_score_change = await scoring_service.update_brain_score(db, user_id)

        # Evaluate achievements
        unlocked_achievements = await achievement_service.evaluate_user_achievements(
            db,
            user_id=user_id,
            latest_accuracy=accuracy,
            latest_score=score,
            game_slug=game.slug,
        )

        # Check daily challenges
        _, all_daily_done = await challenge_service.update_challenge_progress(
            db,
            user_id=user_id,
            game_id=game.id,
            score=score,
            accuracy=accuracy,
        )

        return SessionResultResponse(
            session_id=session.id,
            game_id=game.id,
            game_name=game.name,
            game_slug=game.slug,
            score=score,
            accuracy=accuracy,
            reaction_time=rx_time,
            duration_seconds=duration_seconds,
            xp_earned=xp_earned,
            coins_earned=coins_earned,
            brain_score_change=brain_score_change,
            new_brain_score=new_brain_score,
            new_level=stats.level,
            unlocked_achievements=unlocked_achievements,
            is_daily_challenge_completed=all_daily_done,
            completed_at=now,
        )


game_service = GameService()

