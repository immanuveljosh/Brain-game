from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserProfile
from app.schemas.user import UserProfileResponse, UserProfileUpdate
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserProfile).where(UserProfile.user_id == current_user.id)
    profile = (await db.execute(stmt)).scalar_one_or_none()
    if not profile:
        profile = UserProfile(user_id=current_user.id, display_name=current_user.username)
        db.add(profile)
        await db.commit()
    return profile


@router.put("/", response_model=UserProfileResponse)
async def update_my_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserProfile).where(UserProfile.user_id == current_user.id)
    profile = (await db.execute(stmt)).scalar_one_or_none()
    if not profile:
        profile = UserProfile(user_id=current_user.id, display_name=current_user.username)
        db.add(profile)

    if update_data.display_name is not None:
        profile.display_name = update_data.display_name
    if update_data.country is not None:
        profile.country = update_data.country
    if update_data.timezone is not None:
        profile.timezone = update_data.timezone
    if update_data.preferred_language is not None:
        profile.preferred_language = update_data.preferred_language
    if update_data.theme is not None:
        profile.theme = update_data.theme
    if update_data.notification_preferences is not None:
        profile.notification_preferences = update_data.notification_preferences

    if update_data.avatar is not None:
        current_user.avatar = update_data.avatar

    await db.commit()
    return profile

