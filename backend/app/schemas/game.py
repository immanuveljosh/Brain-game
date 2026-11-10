from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict


class GameResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    category: str
    description: str
    difficulty: str
    is_active: bool
    configuration: Dict[str, Any]


class GameCreate(BaseModel):
    name: str
    slug: str
    category: str
    description: str = ""
    difficulty: str = "Medium"
    is_active: bool = True
    configuration: Dict[str, Any] = {}


class GameUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    is_active: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None


class CategorySummary(BaseModel):
    category: str
    name: str
    games_count: int
    description: str
    color: str
