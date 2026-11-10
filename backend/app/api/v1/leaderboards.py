from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.leaderboard import LeaderboardResponse
from app.services.leaderboard_service import leaderboard_service
from app.api.deps import get_current_user_optional

router = APIRouter()


@router.get("/", response_model=LeaderboardResponse)
async def get_leaderboard(
    type: str = Query(default="global", description="global, friends, weekly, monthly"),
    period: str = Query(default="all_time"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    user_id = current_user.id if current_user else None
    return await leaderboard_service.get_leaderboard(
        db=db,
        current_user_id=user_id,
        leaderboard_type=type,
        period=period,
        limit=limit,
        offset=offset,
    )

