from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserStats
from app.models.brain_score import BrainScoreHistory
from app.models.challenge import DailyActivity
from app.services.scoring_service import scoring_service
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    CategoryPerformanceItem,
    BrainScoreHistoryPoint,
)

CATEGORY_META = {
    "memory": {"name": "Memory", "color": "#FF6B4A"},
    "logic": {"name": "Logic & Reasoning", "color": "#3B82F6"},
    "math": {"name": "Math Intelligence", "color": "#10B981"},
    "focus": {"name": "Speed & Focus", "color": "#8B5CF6"},
    "visual": {"name": "Visual Intelligence", "color": "#EC4899"},
    "language": {"name": "Language & Words", "color": "#F59E0B"},
}


class AnalyticsService:
    @staticmethod
    async def get_user_analytics(
        db: AsyncSession,
        user_id: int,
    ) -> AnalyticsOverviewResponse:
        # User Stats
        stats_stmt = select(UserStats).where(UserStats.user_id == user_id)
        stats = (await db.execute(stats_stmt)).scalar_one_or_none()
        b_score = stats.brain_score if stats else 500
        games_played = stats.total_games_played if stats else 0
        play_time = stats.total_play_time if stats else 0
        avg_acc = stats.accuracy_average if stats else 0.0
        c_streak = stats.current_streak if stats else 0
        l_streak = stats.longest_streak if stats else 0

        # Estimated Brain Age
        brain_age = scoring_service.calculate_estimated_brain_age(b_score)

        # Category scores
        cat_scores = await scoring_service.compute_category_scores(db, user_id)
        cat_items = []
        for cat, data in cat_scores.items():
            meta = CATEGORY_META.get(cat, {"name": cat.capitalize(), "color": "#3B82F6"})
            cat_items.append(CategoryPerformanceItem(
                category=cat,
                name=meta["name"],
                score=data["score"],
                percentage=min(100, int(data["score"] / 10)),
                accuracy=data["accuracy"],
                games_played=data["games_count"],
                color=meta["color"],
            ))

        # Sort strengths and growth areas
        sorted_cats = sorted(cat_items, key=lambda c: c.score, reverse=True)
        strengths = [f"{c.name} ({c.score} pts)" for c in sorted_cats[:2]]
        growth_areas = [f"{c.name} ({c.score} pts)" for c in sorted_cats[-2:]]

        # 7-day Score History
        history_stmt = (
            select(BrainScoreHistory)
            .where(BrainScoreHistory.user_id == user_id)
            .order_by(desc(BrainScoreHistory.recorded_at))
            .limit(7)
        )
        hist_rows = list((await db.execute(history_stmt)).scalars().all())
        hist_rows.reverse()

        score_points = []
        if hist_rows:
            for h in hist_rows:
                score_points.append(BrainScoreHistoryPoint(
                    date=h.recorded_at.strftime("%b %d"),
                    score=h.total_score,
                    memory=h.memory_score,
                    logic=h.logic_score,
                    math=h.math_score,
                    speed=h.speed_score,
                    focus=h.focus_score,
                    visual=h.visual_score,
                    language=h.language_score,
                ))
        else:
            # Fallback 7-day dummy baseline
            today = datetime.now(timezone.utc)
            for i in range(6, -1, -1):
                d = today - timedelta(days=i)
                score_points.append(BrainScoreHistoryPoint(
                    date=d.strftime("%b %d"),
                    score=max(300, b_score - i * 5),
                    memory=500,
                    logic=500,
                    math=500,
                    speed=500,
                    focus=500,
                    visual=500,
                    language=500,
                ))

        # Recent 7-day Daily Activity
        act_stmt = (
            select(DailyActivity)
            .where(DailyActivity.user_id == user_id)
            .order_by(desc(DailyActivity.activity_date))
            .limit(7)
        )
        act_rows = (await db.execute(act_stmt)).scalars().all()
        recent_act = [
            {
                "date": a.activity_date.strftime("%Y-%m-%d"),
                "games": a.games_played,
                "xp": a.xp_earned,
                "minutes": round(a.play_time / 60.0, 1),
                "accuracy": a.accuracy,
            }
            for a in act_rows
        ]

        # Change percent
        first_score = score_points[0].score if score_points else b_score
        last_score = score_points[-1].score if score_points else b_score
        change_pct = round(((last_score - first_score) / max(1, first_score)) * 100, 1)

        return AnalyticsOverviewResponse(
            brain_score=b_score,
            brain_score_change_percent=change_pct,
            estimated_brain_age=brain_age,
            total_games_played=games_played,
            total_play_time_seconds=play_time,
            average_accuracy=avg_acc,
            current_streak=c_streak,
            longest_streak=l_streak,
            category_performances=cat_items,
            score_history_7d=score_points,
            recent_activity_7d=recent_act,
            strengths=strengths,
            growth_areas=growth_areas,
        )


analytics_service = AnalyticsService()

