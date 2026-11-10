from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserStats
from app.models.achievement import Achievement, UserAchievement
from app.schemas.achievement import AchievementResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[AchievementResponse])
async def list_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Fetch all achievements
    stmt_all = select(Achievement).order_by(Achievement.id)
    all_ach = (await db.execute(stmt_all)).scalars().all()

    # Fetch user unlocked achievements
    stmt_unlocked = select(UserAchievement).where(UserAchievement.user_id == current_user.id)
    unlocked_map = {ua.achievement_id: ua for ua in (await db.execute(stmt_unlocked)).scalars().all()}

    # Fetch user stats for live progress calculation
    stats_stmt = select(UserStats).where(UserStats.user_id == current_user.id)
    stats = (await db.execute(stats_stmt)).scalar_one_or_none()

    results = []
    for ach in all_ach:
        ua = unlocked_map.get(ach.id)
        is_unlocked = ua is not None
        unlocked_at = ua.unlocked_at if ua else None

        req = ach.requirements or {}
        req_type = req.get("type")
        threshold = req.get("threshold", 1)

        progress = 0
        if is_unlocked:
            progress = threshold
        elif stats:
            if req_type == "games_played":
                progress = min(threshold, stats.total_games_played)
            elif req_type == "streak":
                progress = min(threshold, stats.current_streak)
            elif req_type == "brain_score":
                progress = min(threshold, stats.brain_score)
            elif req_type == "level":
                progress = min(threshold, stats.level)

        results.append(AchievementResponse(
            id=ach.id,
            name=ach.name,
            slug=ach.slug,
            description=ach.description,
            icon=ach.icon,
            category=ach.category,
            reward_xp=ach.reward_xp,
            reward_coins=ach.reward_coins,
            rarity=ach.rarity,
            unlocked=is_unlocked,
            unlocked_at=unlocked_at,
            progress=progress,
            max_progress=threshold,
        ))

    return results

