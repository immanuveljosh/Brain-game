from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.game import Game, GameResult
from app.models.user import UserStats
from app.models.brain_score import BrainScoreHistory

CATEGORY_WEIGHTS = {
    "memory": 0.20,
    "logic": 0.20,
    "math": 0.15,
    "focus": 0.15,
    "visual": 0.15,
    "language": 0.15,
}

DIFFICULTY_MULTIPLIER = {
    "Easy": 0.9,
    "Medium": 1.0,
    "Hard": 1.25,
    "Adaptive": 1.1,
}


class ScoringService:
    @staticmethod
    async def compute_category_scores(
        db: AsyncSession,
        user_id: int,
    ) -> Dict[str, Dict[str, Any]]:
        """
        Calculates user's score across all 6 cognitive categories (0 - 1000).
        Evaluates accuracy, difficulty weighting, and recent game performance.
        """
        # Fetch last 30 game results with their game categories
        stmt = (
            select(GameResult, Game.category)
            .join(Game, GameResult.game_id == Game.id)
            .where(GameResult.user_id == user_id)
            .order_by(GameResult.created_at.desc())
            .limit(40)
        )
        res = await db.execute(stmt)
        results = res.all()

        category_data: Dict[str, List[GameResult]] = {
            "memory": [],
            "logic": [],
            "math": [],
            "focus": [],
            "visual": [],
            "language": [],
        }

        for game_result, category in results:
            cat_key = category.lower()
            if cat_key in category_data:
                category_data[cat_key].append(game_result)

        category_scores: Dict[str, Dict[str, Any]] = {}

        for cat, games in category_data.items():
            if not games:
                # Baseline initial score
                category_scores[cat] = {
                    "score": 500,
                    "accuracy": 70.0,
                    "games_count": 0,
                    "percentile": 50,
                }
                continue

            # Weighted recent average score
            weighted_scores = []
            weighted_accuracies = []
            weights = []

            for idx, g in enumerate(games):
                recency_weight = 1.0 / (1.0 + idx * 0.1)  # Most recent games have higher weight
                diff_factor = DIFFICULTY_MULTIPLIER.get(g.difficulty, 1.0)
                
                # Normalize raw score to a 0-1000 spectrum
                norm_score = min(1000, max(100, int(g.score * diff_factor * (g.accuracy / 100.0))))
                
                weighted_scores.append(norm_score * recency_weight)
                weighted_accuracies.append(g.accuracy * recency_weight)
                weights.append(recency_weight)

            total_weight = sum(weights)
            cat_score = int(sum(weighted_scores) / total_weight)
            cat_acc = round(sum(weighted_accuracies) / total_weight, 1)

            # Keep between 100 and 1000
            final_cat_score = max(100, min(1000, cat_score))

            category_scores[cat] = {
                "score": final_cat_score,
                "accuracy": cat_acc,
                "games_count": len(games),
                "percentile": min(99, int(final_cat_score / 10)),
            }

        return category_scores

    @staticmethod
    async def update_brain_score(
        db: AsyncSession,
        user_id: int,
    ) -> Tuple[int, int]:
        """
        Calculates and updates total brain score (0 - 1000).
        Returns: (new_brain_score, score_change)
        """
        category_scores = await ScoringService.compute_category_scores(db, user_id)

        # Weighted aggregate
        total_composite = 0.0
        for cat, weight in CATEGORY_WEIGHTS.items():
            cat_score = category_scores.get(cat, {}).get("score", 500)
            total_composite += cat_score * weight

        new_score = max(100, min(1000, int(total_composite)))

        # Update UserStats
        stmt = select(UserStats).where(UserStats.user_id == user_id)
        res = await db.execute(stmt)
        stats = res.scalar_one_or_none()

        old_score = 500
        if stats:
            old_score = stats.brain_score
            stats.brain_score = new_score
            stats.last_active_date = datetime.now(timezone.utc)
        
        score_change = new_score - old_score

        # Save to BrainScoreHistory
        history_entry = BrainScoreHistory(
            user_id=user_id,
            total_score=new_score,
            memory_score=category_scores.get("memory", {}).get("score", 500),
            logic_score=category_scores.get("logic", {}).get("score", 500),
            math_score=category_scores.get("math", {}).get("score", 500),
            speed_score=category_scores.get("focus", {}).get("score", 500),
            focus_score=category_scores.get("focus", {}).get("score", 500),
            visual_score=category_scores.get("visual", {}).get("score", 500),
            language_score=category_scores.get("language", {}).get("score", 500),
        )
        db.add(history_entry)

        return new_score, score_change

    @staticmethod
    def calculate_estimated_brain_age(brain_score: int) -> int:
        """
        Gameplay cognitive vitality indicator (not medical advice).
        Score 1000 -> 18 yrs, Score 750 -> 23 yrs, Score 500 -> 35 yrs, Score 300 -> 50 yrs
        """
        if brain_score >= 800:
            return max(18, int(25 - (brain_score - 800) / 30))
        elif brain_score >= 600:
            return int(30 - (brain_score - 600) / 40)
        elif brain_score >= 400:
            return int(40 - (brain_score - 400) / 20)
        else:
            return min(65, int(50 + (400 - brain_score) / 15))


scoring_service = ScoringService()

