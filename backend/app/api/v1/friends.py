from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserProfile, UserStats
from app.models.social import Friendship
from app.schemas.social import (
    FriendUserResponse,
    FriendRequestCreate,
    FriendshipStatusUpdate,
)
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[FriendUserResponse])
async def list_friends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Friendship, User, UserProfile, UserStats)
        .join(User, Friendship.friend_id == User.id)
        .outerjoin(UserProfile, User.id == UserProfile.user_id)
        .outerjoin(UserStats, User.id == UserStats.user_id)
        .where(Friendship.user_id == current_user.id, Friendship.status == "accepted")
    )
    rows = (await db.execute(stmt)).all()
    friends = []
    for f, u, profile, stats in rows:
        friends.append(FriendUserResponse(
            id=u.id,
            username=u.username,
            display_name=profile.display_name if profile else u.username,
            avatar=u.avatar,
            brain_score=stats.brain_score if stats else 500,
            level=stats.level if stats else 1,
            status="online" if stats and stats.last_active_date else "offline",
            last_active=stats.last_active_date if stats else None,
        ))
    return friends


@router.post("/request")
async def send_friend_request(
    req: FriendRequestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    target_str = req.friend_username_or_email.strip()
    stmt = select(User).where(or_(User.username == target_str, User.email == target_str))
    target_user = (await db.execute(stmt)).scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if target_user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot friend yourself")

    # Check existing
    check_stmt = select(Friendship).where(
        Friendship.user_id == current_user.id,
        Friendship.friend_id == target_user.id,
    )
    if (await db.execute(check_stmt)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Friend request already exists")

    # Add bidirectional pending request
    f1 = Friendship(user_id=current_user.id, friend_id=target_user.id, status="accepted")
    f2 = Friendship(user_id=target_user.id, friend_id=current_user.id, status="accepted")
    db.add(f1)
    db.add(f2)
    await db.commit()

    return {"message": f"Successfully connected with {target_user.username}"}


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_friend(
    friend_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Friendship).where(
        or_(
            (Friendship.user_id == current_user.id) & (Friendship.friend_id == friend_id),
            (Friendship.user_id == friend_id) & (Friendship.friend_id == current_user.id),
        )
    )
    friendships = (await db.execute(stmt)).scalars().all()
    for f in friendships:
        await db.delete(f)
    await db.commit()
    return None

