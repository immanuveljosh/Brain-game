from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.game import Game
from app.schemas.game import GameResponse, CategorySummary

router = APIRouter()

CATEGORIES_METADATA = [
    {
        "category": "memory",
        "name": "Memory",
        "description": "Improve short-term recall and pattern retention.",
        "color": "#FF6B4A",
    },
    {
        "category": "logic",
        "name": "Logic & Reasoning",
        "description": "Enhance deductive reasoning and problem solving.",
        "color": "#3B82F6",
    },
    {
        "category": "math",
        "name": "Math Intelligence",
        "description": "Boost mental arithmetic and numerical agility.",
        "color": "#10B981",
    },
    {
        "category": "focus",
        "name": "Speed & Focus",
        "description": "Train visual attention and reaction speed.",
        "color": "#8B5CF6",
    },
    {
        "category": "visual",
        "name": "Visual Intelligence",
        "description": "Sharpen spatial reasoning and visual accuracy.",
        "color": "#EC4899",
    },
    {
        "category": "language",
        "name": "Language & Words",
        "description": "Expand vocabulary, anagrams and verbal fluency.",
        "color": "#F59E0B",
    },
]


@router.get("/", response_model=List[GameResponse])
async def list_games(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Game).where(Game.is_active == True)
    if category:
        stmt = stmt.where(Game.category == category.lower().strip())
    if difficulty and difficulty != "All":
        stmt = stmt.where(Game.difficulty == difficulty)
    if search:
        stmt = stmt.where(Game.name.ilike(f"%{search.strip()}%"))

    stmt = stmt.order_by(Game.category, Game.name)
    games = (await db.execute(stmt)).scalars().all()
    return games


@router.get("/categories", response_model=List[CategorySummary])
async def list_categories(
    db: AsyncSession = Depends(get_db),
):
    summaries = []
    for cat in CATEGORIES_METADATA:
        stmt = select(Game).where(Game.category == cat["category"], Game.is_active == True)
        games = (await db.execute(stmt)).scalars().all()
        summaries.append(CategorySummary(
            category=cat["category"],
            name=cat["name"],
            description=cat["description"],
            color=cat["color"],
            games_count=len(games),
        ))
    return summaries


@router.get("/{slug}", response_model=GameResponse)
async def get_game_details(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Game).where(Game.slug == slug.lower().strip())
    game = (await db.execute(stmt)).scalar_one_or_none()
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    return game

