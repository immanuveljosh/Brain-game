from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class FriendUserResponse(BaseModel):
    id: int
    username: str
    display_name: str
    avatar: str
    brain_score: int
    level: int
    status: str  # online, offline, in_game
    last_active: Optional[datetime] = None


class FriendRequestCreate(BaseModel):
    friend_username_or_email: str


class FriendshipStatusUpdate(BaseModel):
    friendship_id: int
    status: str  # accepted, rejected


class MultiplayerRoomCreateRequest(BaseModel):
    game_slug: str = "math-sprint"


class MultiplayerRoomJoinRequest(BaseModel):
    room_code: str


class MultiplayerRoomResponse(BaseModel):
    id: str
    room_code: str
    game_slug: str
    host_id: int
    host_name: str
    guest_id: Optional[int] = None
    guest_name: Optional[str] = None
    status: str
    host_score: int = 0
    guest_score: int = 0
    winner_id: Optional[int] = None
    created_at: datetime

