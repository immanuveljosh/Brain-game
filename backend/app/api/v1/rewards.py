from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.reward import Reward
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/history")
async def get_my_rewards(
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Reward)
        .where(Reward.user_id == current_user.id)
        .order_by(desc(Reward.created_at))
        .limit(limit)
    )
    rewards = (await db.execute(stmt)).scalars().all()
    return [
        {
            "id": r.id,
            "reward_type": r.reward_type,
            "amount": r.amount,
            "source": r.source,
            "created_at": r.created_at,
        }
        for r in rewards
    ]

