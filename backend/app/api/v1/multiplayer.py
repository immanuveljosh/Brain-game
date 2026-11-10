from typing import Dict, Any, List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db, AsyncSessionLocal
from app.models.user import User, UserProfile
from app.models.social import MultiplayerRoom
from app.schemas.social import (
    MultiplayerRoomCreateRequest,
    MultiplayerRoomJoinRequest,
    MultiplayerRoomResponse,
)
from app.services.multiplayer_service import multiplayer_service
from app.api.deps import get_current_user

router = APIRouter()

# In-memory WebSocket connection manager for active rooms
class RoomConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_code: str, websocket: WebSocket):
        await websocket.accept()
        if room_code not in self.rooms:
            self.rooms[room_code] = []
        self.rooms[room_code].append(websocket)

    def disconnect(self, room_code: str, websocket: WebSocket):
        if room_code in self.rooms:
            if websocket in self.rooms[room_code]:
                self.rooms[room_code].remove(websocket)
            if not self.rooms[room_code]:
                del self.rooms[room_code]

    async def broadcast_to_room(self, room_code: str, message: Dict[str, Any]):
        if room_code in self.rooms:
            for connection in self.rooms[room_code]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = RoomConnectionManager()


@router.post("/rooms", response_model=MultiplayerRoomResponse)
async def create_duel_room(
    req: MultiplayerRoomCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    room = await multiplayer_service.create_room(db, current_user.id, req.game_slug)
    return MultiplayerRoomResponse(
        id=room.id,
        room_code=room.room_code,
        game_slug=room.game_slug,
        host_id=room.host_id,
        host_name=current_user.username,
        status=room.status,
        created_at=room.created_at,
    )


@router.post("/rooms/join", response_model=MultiplayerRoomResponse)
async def join_duel_room(
    req: MultiplayerRoomJoinRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    room = await multiplayer_service.join_room(db, current_user.id, req.room_code)
    # Broadcast to room sockets
    await manager.broadcast_to_room(
        room.room_code,
        {"event": "player_joined", "guest_id": current_user.id, "guest_name": current_user.username},
    )

    host = (await db.execute(select(User).where(User.id == room.host_id))).scalar_one()

    return MultiplayerRoomResponse(
        id=room.id,
        room_code=room.room_code,
        game_slug=room.game_slug,
        host_id=room.host_id,
        host_name=host.username,
        guest_id=current_user.id,
        guest_name=current_user.username,
        status=room.status,
        created_at=room.created_at,
    )


@router.post("/rooms/{room_id}/score")
async def submit_duel_score(
    room_id: str,
    score: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    room = await multiplayer_service.submit_room_score(db, current_user.id, room_id, score)
    await manager.broadcast_to_room(
        room.room_code,
        {
            "event": "score_update",
            "host_score": room.host_score,
            "guest_score": room.guest_score,
            "status": room.status,
            "winner_id": room.winner_id,
        },
    )
    return {"status": room.status, "winner_id": room.winner_id}


@router.websocket("/ws/{room_code}")
async def websocket_duel_endpoint(websocket: WebSocket, room_code: str):
    await manager.connect(room_code, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast incoming game events (e.g. answer streak, progress bar)
            await manager.broadcast_to_room(room_code, data)
    except WebSocketDisconnect:
        manager.disconnect(room_code, websocket)

