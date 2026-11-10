from datetime import date, datetime, timezone
from typing import List, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.game import Game
from app.models.challenge import DailyChallenge, ChallengeProgress, DailyActivity
from app.models.user import UserStats
from app.models.reward import Reward


class ChallengeService:
    @staticmethod
    async def get_or_create_daily_challenges(
        db: AsyncSession,
        challenge_date: date,
    ) -> List[DailyChallenge]:
        """Fetch or automatically generate the 3 daily challenges for the given date"""
        stmt = select(DailyChallenge).where(DailyChallenge.challenge_date == challenge_date)
        res = await db.execute(stmt)
        challenges = res.scalars().all()

        if challenges:
            return list(challenges)

        # Generate 3 challenges for today
        # Fetch active games
        games_stmt = select(Game).where(Game.is_active == True).limit(6)
        games = (await db.execute(games_stmt)).scalars().all()

        if not games:
            return []

        # Deterministic seed based on date
        chosen_games = games[:3] if len(games) >= 3 else games

        new_challenges = []
        targets = [
            ("score", 450, "Medium", 50, 25),
            ("accuracy", 80, "Medium", 60, 30),
            ("completion", 1, "Hard", 80, 45),
        ]

        for idx, g in enumerate(chosen_games):
            metric, val, diff, xp, coins = targets[idx % len(targets)]
            dc = DailyChallenge(
                challenge_date=challenge_date,
                game_id=g.id,
                difficulty=diff,
                target_metric=metric,
                target_value=val,
                reward_xp=xp,
                reward_coins=coins,
                configuration={"game_slug": g.slug, "game_name": g.name},
            )
            db.add(dc)
            new_challenges.append(dc)

        await db.flush()
        return new_challenges

    @staticmethod
    async def update_challenge_progress(
        db: AsyncSession,
        user_id: int,
        game_id: int,
        score: int,
        accuracy: float,
    ) -> Tuple[bool, bool]:
        """
        Check if current game completes a daily challenge.
        Returns: (completed_this_challenge, all_daily_completed_now)
        """
        today = datetime.now(timezone.utc).date()
        challenges = await ChallengeService.get_or_create_daily_challenges(db, today)

        matched_challenge = next((c for c in challenges if c.game_id == game_id), None)
        if not matched_challenge:
            return False, False

        # Get or create challenge progress
        stmt = select(ChallengeProgress).where(
            ChallengeProgress.user_id == user_id,
            ChallengeProgress.challenge_id == matched_challenge.id,
        )
        progress = (await db.execute(stmt)).scalar_one_or_none()

        if not progress:
            progress = ChallengeProgress(
                user_id=user_id,
                challenge_id=matched_challenge.id,
                completed=False,
                score=0,
            )
            db.add(progress)

        if progress.completed:
            return False, False

        is_met = False
        if matched_challenge.target_metric == "score" and score >= matched_challenge.target_value:
            is_met = True
        elif matched_challenge.target_metric == "accuracy" and accuracy >= float(matched_challenge.target_value):
            is_met = True
        elif matched_challenge.target_metric == "completion":
            is_met = True
        elif score > 200:
            is_met = True

        if is_met:
            progress.completed = True
            progress.score = score
            progress.completed_at = datetime.now(timezone.utc)

            # Check if all 3 daily challenges are completed
            all_ids = [c.id for c in challenges]
            stmt_all_prog = select(ChallengeProgress).where(
                ChallengeProgress.user_id == user_id,
                ChallengeProgress.challenge_id.in_(all_ids),
                ChallengeProgress.completed == True,
            )
            done_progs = (await db.execute(stmt_all_prog)).scalars().all()
            all_done = len(done_progs) == len(challenges)

            return True, all_done

        return False, False


challenge_service = ChallengeService()

