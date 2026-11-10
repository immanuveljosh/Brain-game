from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserStats
from app.models.game import Game, GameSession
from app.models.challenge import DailyChallenge, ChallengeProgress
from app.schemas.game import GameCreate, GameUpdate, GameResponse
from app.schemas.admin import AdminUserUpdate, AdminSystemStats
from app.api.deps import get_current_admin

router = APIRouter()


@router.get("/stats", response_model=AdminSystemStats)
async def get_admin_system_stats(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    active_users = (await db.execute(select(func.count(User.id)).where(User.is_active == True))).scalar() or 0
    total_games = (await db.execute(select(func.count(Game.id)))).scalar() or 0
    total_sessions = (await db.execute(select(func.count(GameSession.id)))).scalar() or 0
    total_challenges = (await db.execute(select(func.count(ChallengeProgress.id)).where(ChallengeProgress.completed == True))).scalar() or 0
    avg_score = (await db.execute(select(func.avg(UserStats.brain_score)))).scalar() or 500.0

    return AdminSystemStats(
        total_users=total_users,
        active_users=active_users,
        total_games=total_games,
        total_sessions_played=total_sessions,
        total_challenges_completed=total_challenges,
        average_brain_score=round(float(avg_score), 1),
        system_health="healthy",
        database_status="connected",
        redis_status="active",
    )


@router.get("/users")
async def list_users_admin(
    limit: int = 50,
    offset: int = 0,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(User, UserStats)
        .outerjoin(UserStats, User.id == UserStats.user_id)
        .order_by(User.id)
        .limit(limit)
        .offset(offset)
    )
    rows = (await db.execute(stmt)).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "created_at": u.created_at,
            "brain_score": stats.brain_score if stats else 500,
            "level": stats.level if stats else 1,
            "games_played": stats.total_games_played if stats else 0,
        }
        for u, stats in rows
    ]


@router.put("/users/{user_id}")
async def moderate_user_admin(
    user_id: int,
    req: AdminUserUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(User).where(User.id == user_id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if req.is_active is not None:
        user.is_active = req.is_active
    if req.is_verified is not None:
        user.is_verified = req.is_verified
    if req.role is not None:
        user.role = req.role
    if req.avatar is not None:
        user.avatar = req.avatar

    await db.commit()
    return {"message": f"User {user.username} updated successfully"}


@router.post("/games", response_model=GameResponse, status_code=status.HTTP_201_CREATED)
async def create_game_admin(
    req: GameCreate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    check_stmt = select(Game).where((Game.name == req.name) | (Game.slug == req.slug))
    if (await db.execute(check_stmt)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Game name or slug already exists")

    game = Game(
        name=req.name,
        slug=req.slug,
        category=req.category,
        description=req.description,
        difficulty=req.difficulty,
        is_active=req.is_active,
        configuration=req.configuration,
    )
    db.add(game)
    await db.commit()
    return game


@router.put("/games/{game_id}", response_model=GameResponse)
async def update_game_admin(
    game_id: int,
    req: GameUpdate,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Game).where(Game.id == game_id)
    game = (await db.execute(stmt)).scalar_one_or_none()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")

    if req.name is not None:
        game.name = req.name
    if req.description is not None:
        game.description = req.description
    if req.difficulty is not None:
        game.difficulty = req.difficulty
    if req.is_active is not None:
        game.is_active = req.is_active
    if req.configuration is not None:
        game.configuration = req.configuration

    await db.commit()
    return game

