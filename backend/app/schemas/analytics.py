from datetime import datetime, date
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class CategoryPerformanceItem(BaseModel):
    category: str
    name: str
    score: int
    percentage: int
    accuracy: float
    games_played: int
    color: str


class BrainScoreHistoryPoint(BaseModel):
    date: str
    score: int
    memory: int
    logic: int
    math: int
    speed: int
    focus: int
    visual: int
    language: int


class AnalyticsOverviewResponse(BaseModel):
    brain_score: int
    brain_score_change_percent: float
    estimated_brain_age: int
    total_games_played: int
    total_play_time_seconds: int
    average_accuracy: float
    current_streak: int
    longest_streak: int
    category_performances: List[CategoryPerformanceItem]
    score_history_7d: List[BrainScoreHistoryPoint]
    recent_activity_7d: List[Dict[str, Any]]
    strengths: List[str]
    growth_areas: List[str]

