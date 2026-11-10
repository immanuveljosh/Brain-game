from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserStats
from app.schemas.user import UserStatsResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserStatsResponse)
async def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserStats).where(UserStats.user_id == current_user.id)
    stats = (await db.execute(stmt)).scalar_one_or_none()
    if not stats:
        stats = UserStats(user_id=current_user.id)
        db.add(stats)
        await db.commit()
    return stats

