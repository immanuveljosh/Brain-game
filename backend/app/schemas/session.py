from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict


class StartSessionRequest(BaseModel):
    game_slug: str
    difficulty: str = Field(default="Medium")


class SessionChallengePayload(BaseModel):
    session_id: str
    game_slug: str
    game_name: str
    category: str
    difficulty: str
    seed: str
    started_at: datetime
    initial_challenges: List[Dict[str, Any]]
    rules: Dict[str, Any]


class SubmitAnswerRequest(BaseModel):
    step_index: int
    answer: Any
    elapsed_ms: Optional[int] = None
    client_timestamp: Optional[datetime] = None


class SubmitAnswerResponse(BaseModel):
    step_index: int
    is_correct: bool
    points_awarded: int
    streak: int
    feedback: Optional[str] = None
    next_challenge: Optional[Dict[str, Any]] = None


class CompleteSessionRequest(BaseModel):
    duration_seconds: int = Field(..., ge=1)
    client_score: int = Field(default=0)
    client_accuracy: float = Field(default=0.0)
    results_summary: Dict[str, Any] = Field(default_factory=dict)


class SessionResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    session_id: str
    game_id: int
    game_name: str
    game_slug: str
    score: int
    accuracy: float
    reaction_time: Optional[float]
    duration_seconds: int
    xp_earned: int
    coins_earned: int
    brain_score_change: int
    new_brain_score: int
    new_level: int
    unlocked_achievements: List[str]
    is_daily_challenge_completed: bool
    completed_at: datetime


class GameSessionHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    game_id: int
    game_name: str
    game_slug: str
    category: str
    difficulty: str
    started_at: datetime
    completed_at: Optional[datetime]
    duration_seconds: int
    score: int
    accuracy: float
    status: str
