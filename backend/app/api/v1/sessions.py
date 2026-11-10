from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.models.game import GameSession, Game
from app.schemas.session import (
    StartSessionRequest,
    SessionChallengePayload,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    CompleteSessionRequest,
    SessionResultResponse,
    GameSessionHistoryResponse,
)
from app.services.game_service import game_service
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/start", response_model=SessionChallengePayload)
async def start_game_session(
    req: StartSessionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await game_service.start_session(
        db=db,
        user_id=current_user.id,
        game_slug=req.game_slug,
        difficulty=req.difficulty,
    )


@router.post("/{session_id}/answer", response_model=SubmitAnswerResponse)
async def submit_session_answer(
    session_id: str,
    req: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await game_service.submit_answer(
        db=db,
        user_id=current_user.id,
        session_id=session_id,
        step_index=req.step_index,
        answer=req.answer,
        elapsed_ms=req.elapsed_ms,
    )


@router.post("/{session_id}/complete", response_model=SessionResultResponse)
async def complete_game_session(
    session_id: str,
    req: CompleteSessionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await game_service.complete_session(
        db=db,
        user_id=current_user.id,
        session_id=session_id,
        duration_seconds=req.duration_seconds,
        client_score=req.client_score,
        client_accuracy=req.client_accuracy,
        results_summary=req.results_summary,
    )


@router.post("/{session_id}/cancel")
async def cancel_game_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(GameSession).where(GameSession.id == session_id, GameSession.user_id == current_user.id)
    session = (await db.execute(stmt)).scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    session.status = "cancelled"
    await db.commit()
    return {"message": "Session cancelled successfully"}


@router.get("/history/me", response_model=List[GameSessionHistoryResponse])
async def get_my_session_history(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(GameSession, Game.name, Game.slug, Game.category)
        .join(Game, GameSession.game_id == Game.id)
        .where(GameSession.user_id == current_user.id)
        .order_by(desc(GameSession.started_at))
        .limit(limit)
        .offset(offset)
    )
    rows = (await db.execute(stmt)).all()
    history = []
    for s, g_name, g_slug, g_cat in rows:
        history.append(GameSessionHistoryResponse(
            id=s.id,
            game_id=s.game_id,
            game_name=g_name,
            game_slug=g_slug,
            category=g_cat,
            difficulty=s.difficulty,
            started_at=s.started_at,
            completed_at=s.completed_at,
            duration_seconds=s.duration_seconds,
            score=s.score,
            accuracy=s.accuracy,
            status=s.status,
        ))
    return history

