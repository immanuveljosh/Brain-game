from typing import Optional, List
from pydantic import BaseModel


class LeaderboardUserEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    display_name: str
    avatar: str
    score: int
    level: int
    streak: int
    is_current_user: bool = False


class LeaderboardResponse(BaseModel):
    leaderboard_type: str
    period: str
    entries: List[LeaderboardUserEntry]
    current_user_entry: Optional[LeaderboardUserEntry] = None
    total_participants: int

