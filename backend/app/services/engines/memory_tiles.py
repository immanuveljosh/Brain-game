import random
from typing import Dict, Any, List, Tuple, Optional
from app.services.engines.base import BaseGameEngine


class MemoryTilesEngine(BaseGameEngine):
    game_slug = "memory-tiles"
    category = "memory"

    def generate_challenges(self, difficulty: str, seed: str, count: int = 1) -> List[Dict[str, Any]]:
        rng = random.Random(seed)
        num_pairs = {"Easy": 6, "Medium": 8, "Hard": 10}.get(difficulty, 8)

        symbols = ["star", "heart", "sparkles", "moon", "sun", "flame", "zap", "gem", "circle", "diamond"]
        chosen_symbols = rng.sample(symbols, num_pairs)

        card_pool = chosen_symbols * 2
        rng.shuffle(card_pool)

        return [{
            "step": 0,
            "grid_size": len(card_pool),
            "num_pairs": num_pairs,
            "cards": card_pool,
            "difficulty": difficulty,
        }]

    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        # Answer format: {"first_index": 2, "second_index": 7}
        if not isinstance(answer, dict):
            return False, 0, "Invalid pair format"

        i1 = answer.get("first_index")
        i2 = answer.get("second_index")
        cards = challenge.get("cards", [])

        if i1 is None or i2 is None or i1 == i2 or i1 >= len(cards) or i2 >= len(cards):
            return False, 0, "Out of bounds tile selection"

        if cards[i1] == cards[i2]:
            return True, 60, "Pair matched!"
        return False, 0, "Tiles do not match"

