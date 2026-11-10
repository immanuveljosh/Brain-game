import random
from typing import Dict, Any, List, Tuple, Optional
from app.services.engines.base import BaseGameEngine


class SequenceGeniusEngine(BaseGameEngine):
    game_slug = "sequence-genius"
    category = "memory"

    def generate_challenges(self, difficulty: str, seed: str, count: int = 7) -> List[Dict[str, Any]]:
        rng = random.Random(seed)
        seq = []
        challenges = []
        for step in range(1, count + 1):
            seq.append(rng.randint(0, 3))
            challenges.append({
                "level": step,
                "length": len(seq),
                "sequence": list(seq),
            })
        return challenges

    def validate_answer(
        self,
        challenge: Dict[str, Any],
        answer: Any,
        elapsed_ms: Optional[int] = None,
    ) -> Tuple[bool, int, str]:
        # Answer is the reproduced sequence list e.g. [0, 2, 1]
        if not isinstance(answer, list):
            return False, 0, "Invalid sequence format"

        expected = challenge.get("sequence", [])
        if answer == expected:
            pts = len(expected) * 35
            return True, pts, "Sequence reproduced flawlessly!"
        return False, 0, "Incorrect sequence entry"

