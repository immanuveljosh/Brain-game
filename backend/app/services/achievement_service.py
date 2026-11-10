from datetime import datetime, timezone
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.achievement import Achievement, UserAchievement
from app.models.user import UserStats
from app.models.reward import Reward


class AchievementService:
    @staticmethod
    async def evaluate_user_achievements(
        db: AsyncSession,
        user_id: int,
        latest_accuracy: float = 0.0,
        latest_score: int = 0,
        game_slug: str = "",
    ) -> List[str]:
        """
        Check unlocked achievements for user against latest stats.
        Returns list of newly unlocked achievement names.
        """
        # Fetch user stats
        stmt_stats = select(UserStats).where(UserStats.user_id == user_id)
        stats = (await db.execute(stmt_stats)).scalar_one_or_none()
        if not stats:
            return []

        # Fetch all achievements
        stmt_all = select(Achievement)
        all_achievements = (await db.execute(stmt_all)).scalars().all()

        # Fetch already unlocked achievement IDs
        stmt_unlocked = select(UserAchievement.achievement_id).where(UserAchievement.user_id == user_id)
        unlocked_ids = set((await db.execute(stmt_unlocked)).scalars().all())

        newly_unlocked = []

        for ach in all_achievements:
            if ach.id in unlocked_ids:
                continue

            req = ach.requirements or {}
            req_type = req.get("type")
            threshold = req.get("threshold", 1)

            is_satisfied = False

            if req_type == "first_game":
                is_satisfied = stats.total_games_played >= 1
            elif req_type == "games_played":
                is_satisfied = stats.total_games_played >= threshold
            elif req_type == "streak":
                is_satisfied = stats.current_streak >= threshold
            elif req_type == "brain_score":
                is_satisfied = stats.brain_score >= threshold
            elif req_type == "level":
                is_satisfied = stats.level >= threshold
            elif req_type == "perfect_accuracy":
                is_satisfied = latest_accuracy >= 100.0 and latest_score >= 300
            elif req_type == "math_genius":
                is_satisfied = game_slug == "math-sprint" and latest_score >= threshold
            elif req_type == "speedster":
                is_satisfied = game_slug == "reaction-test" and latest_score >= threshold

            if is_satisfied:
                # Unlock!
                ua = UserAchievement(
                    user_id=user_id,
                    achievement_id=ach.id,
                    unlocked_at=datetime.now(timezone.utc),
                )
                db.add(ua)

                # Award coins and XP
                stats.coins += ach.reward_coins
                stats.total_xp += ach.reward_xp

                reward = Reward(
                    user_id=user_id,
                    reward_type="achievement",
                    amount=ach.reward_coins,
                    source=f"Unlocked {ach.name}",
                )
                db.add(reward)
                newly_unlocked.append(ach.name)

        return newly_unlocked


achievement_service = AchievementService()

