from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.game import GameResult, Game
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/{session_id}")
async def get_game_result_by_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(GameResult, Game.name, Game.slug, Game.category)
        .join(Game, GameResult.game_id == Game.id)
        .where(GameResult.session_id == session_id, GameResult.user_id == current_user.id)
    )
    row = (await db.execute(stmt)).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game result not found")

    res, g_name, g_slug, g_cat = row
    return {
        "id": res.id,
        "session_id": res.session_id,
        "game_name": g_name,
        "game_slug": g_slug,
        "category": g_cat,
        "score": res.score,
        "accuracy": res.accuracy,
        "reaction_time": res.reaction_time,
        "difficulty": res.difficulty,
        "xp_earned": res.xp_earned,
        "coins_earned": res.coins_earned,
        "created_at": res.created_at,
    }


@router.get("/")
async def list_recent_game_results(
    limit: int = 15,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(GameResult, Game.name, Game.slug, Game.category)
        .join(Game, GameResult.game_id == Game.id)
        .where(GameResult.user_id == current_user.id)
        .order_by(desc(GameResult.created_at))
        .limit(limit)
    )
    rows = (await db.execute(stmt)).all()
    results = []
    for res, g_name, g_slug, g_cat in rows:
        results.append({
            "id": res.id,
            "session_id": res.session_id,
            "game_name": g_name,
            "game_slug": g_slug,
            "category": g_cat,
            "score": res.score,
            "accuracy": res.accuracy,
            "difficulty": res.difficulty,
            "xp_earned": res.xp_earned,
            "coins_earned": res.coins_earned,
            "created_at": res.created_at,
        })
    return results

