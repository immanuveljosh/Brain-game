from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User, UserProfile, UserStats
from app.schemas.user import FullUserResponse, UserProfileResponse, UserStatsResponse
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=FullUserResponse)
async def get_my_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(User)
        .options(selectinload(User.profile), selectinload(User.stats))
        .where(User.id == current_user.id)
    )
    user = (await db.execute(stmt)).scalar_one()
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.delete(current_user)
    await db.commit()
    return None

