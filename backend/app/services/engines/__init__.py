from typing import Dict, Type
from app.services.engines.base import BaseGameEngine
from app.services.engines.math_sprint import MathSprintEngine
from app.services.engines.memory_tiles import MemoryTilesEngine
from app.services.engines.reaction_test import ReactionTestEngine
from app.services.engines.pattern_master import PatternMasterEngine
from app.services.engines.sequence_genius import SequenceGeniusEngine
from app.services.engines.color_confusion import ColorConfusionEngine


class GenericGameEngine(BaseGameEngine):
    def __init__(self, slug: str, category: str = "general"):
        self.game_slug = slug
        self.category = category

    def generate_challenges(self, difficulty: str, seed: str, count: int = 10):
        return [{"step": i, "prompt": f"Challenge {i+1}", "target": 1} for i in range(count)]

    def validate_answer(self, challenge, answer, elapsed_ms=None):
        return True, 50, "Well done!"


ENGINE_REGISTRY: Dict[str, Type[BaseGameEngine]] = {
    "math-sprint": MathSprintEngine,
    "memory-tiles": MemoryTilesEngine,
    "reaction-test": ReactionTestEngine,
    "pattern-master": PatternMasterEngine,
    "sequence-genius": SequenceGeniusEngine,
    "color-confusion": ColorConfusionEngine,
}


def get_game_engine(game_slug: str, category: str = "general") -> BaseGameEngine:
    engine_cls = ENGINE_REGISTRY.get(game_slug)
    if engine_cls:
        return engine_cls()
    return GenericGameEngine(game_slug, category)

