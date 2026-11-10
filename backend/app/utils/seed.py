import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models.user import User, UserProfile, UserStats
from app.models.game import Game
from app.models.achievement import Achievement
from app.utils.security import hash_password

INITIAL_GAMES = [
    # 1. Memory
    {"name": "Memory Tiles", "slug": "memory-tiles", "category": "memory", "difficulty": "Medium", "description": "Flip and uncover hidden pairs on the matrix."},
    {"name": "Sequence Genius", "slug": "sequence-genius", "category": "memory", "difficulty": "Medium", "description": "Watch the sequence light up and repeat the exact order."},
    {"name": "Card Matching", "slug": "card-matching", "category": "memory", "difficulty": "Easy", "description": "Match pairs of concept cards before countdown runs out."},
    {"name": "Number Recall", "slug": "number-recall", "category": "memory", "difficulty": "Hard", "description": "Memorize rapidly flashing number strings."},
    {"name": "Sound Memory", "slug": "sound-memory", "category": "memory", "difficulty": "Medium", "description": "Listen to melodic audio patterns and recreate harmonies."},
    # 2. Logic
    {"name": "Pattern Master", "slug": "pattern-master", "category": "logic", "difficulty": "Medium", "description": "Analyze sequences of symbols and geometry to find missing patterns."},
    {"name": "Logic Master", "slug": "logic-master", "category": "logic", "difficulty": "Hard", "description": "Solve logical conditions and truth riddles."},
    {"name": "Odd One Out", "slug": "odd-one-out", "category": "logic", "difficulty": "Easy", "description": "Quickly isolate anomalies that break the categorical rule."},
    {"name": "Brain Detective", "slug": "brain-detective", "category": "logic", "difficulty": "Hard", "description": "Synthesize clues and deductions to solve crimes."},
    {"name": "Sudoku Sprint", "slug": "sudoku", "category": "logic", "difficulty": "Medium", "description": "Classic numbers grid logic puzzle."},
    # 3. Math
    {"name": "Math Sprint", "slug": "math-sprint", "category": "math", "difficulty": "Medium", "description": "Rapid-fire mental arithmetic equations against the clock."},
    {"name": "Number Challenge", "slug": "number-challenge", "category": "math", "difficulty": "Hard", "description": "Combine operational digits to hit exact target value."},
    {"name": "Missing Numbers", "slug": "missing-numbers", "category": "math", "difficulty": "Easy", "description": "Fill arithmetic equation blanks."},
    {"name": "Calculation Race", "slug": "calculation-race", "category": "math", "difficulty": "Medium", "description": "Rapidly compare left vs right equation values."},
    # 4. Speed & Focus
    {"name": "Reaction Test", "slug": "reaction-test", "category": "focus", "difficulty": "Easy", "description": "Tap with maximum reflex speed when triggered green."},
    {"name": "Color Confusion", "slug": "color-confusion", "category": "focus", "difficulty": "Hard", "description": "Tap the true INK color of letters, ignoring the word."},
    {"name": "Focus Finder", "slug": "focus-finder", "category": "focus", "difficulty": "Medium", "description": "Track multiple moving targets amongst bouncing decoys."},
    {"name": "Attention Switch", "slug": "attention-switch", "category": "focus", "difficulty": "Hard", "description": "Alternating rule prompts switch sorting behavior rapidly."},
    # 5. Visual Intelligence
    {"name": "Shape Rotation", "slug": "shape-rotation", "category": "visual", "difficulty": "Medium", "description": "Mentally rotate 3D polyhedra to verify matches."},
    {"name": "Visual Patterns", "slug": "visual-patterns", "category": "visual", "difficulty": "Easy", "description": "Complete kaleidoscope symmetries with precision."},
    {"name": "Image Differences", "slug": "image-differences", "category": "visual", "difficulty": "Medium", "description": "Examine two high-resolution scenes and isolate variations."},
    {"name": "Brain Maze", "slug": "brain-maze", "category": "visual", "difficulty": "Hard", "description": "Trace topological labyrinth paths mentally without dead ends."},
    # 6. Language & Words
    {"name": "Word Master", "slug": "word-master", "category": "language", "difficulty": "Medium", "description": "Construct valid high-scoring words using letter tiles."},
    {"name": "Anagram", "slug": "anagram", "category": "language", "difficulty": "Easy", "description": "Decipher jumbled anagram letter collections."},
    {"name": "Vocabulary Quiz", "slug": "vocabulary-quiz", "category": "language", "difficulty": "Medium", "description": "Select synonyms, antonyms, and definitions."},
    {"name": "Word Connections", "slug": "word-connections", "category": "language", "difficulty": "Hard", "description": "Group 16 words into four thematic quartets."},
]

INITIAL_ACHIEVEMENTS = [
    {
        "name": "First Victory",
        "slug": "first-victory",
        "description": "Complete your first brain training game session.",
        "icon": "Sparkles",
        "category": "General",
        "requirements": {"type": "first_game", "threshold": 1},
        "reward_xp": 50,
        "reward_coins": 25,
        "rarity": "Common",
    },
    {
        "name": "7-Day Streak",
        "slug": "streak-7",
        "description": "Maintain a 7-day daily cognitive training streak.",
        "icon": "Flame",
        "category": "Streak",
        "requirements": {"type": "streak", "threshold": 7},
        "reward_xp": 100,
        "reward_coins": 50,
        "rarity": "Rare",
    },
    {
        "name": "Math Genius",
        "slug": "math-genius",
        "description": "Score 500+ points in a single Math Sprint session.",
        "icon": "Calculator",
        "category": "Math",
        "requirements": {"type": "math_genius", "threshold": 500},
        "reward_xp": 150,
        "reward_coins": 75,
        "rarity": "Epic",
    },
    {
        "name": "Speedster",
        "slug": "speedster",
        "description": "Score 600+ points in Reaction Test.",
        "icon": "Zap",
        "category": "Focus",
        "requirements": {"type": "speedster", "threshold": 600},
        "reward_xp": 150,
        "reward_coins": 75,
        "rarity": "Epic",
    },
    {
        "name": "100 Games Played",
        "slug": "centurion",
        "description": "Complete 100 total brain training sessions.",
        "icon": "Trophy",
        "category": "General",
        "requirements": {"type": "games_played", "threshold": 100},
        "reward_xp": 300,
        "reward_coins": 150,
        "rarity": "Legendary",
    },
    {
        "name": "Perfect Accuracy",
        "slug": "perfect-accuracy",
        "description": "Finish a session with 100% accuracy and at least 300 points.",
        "icon": "Award",
        "category": "General",
        "requirements": {"type": "perfect_accuracy", "threshold": 100},
        "reward_xp": 200,
        "reward_coins": 100,
        "rarity": "Epic",
    },
    {
        "name": "Grandmaster 1000",
        "slug": "grandmaster",
        "description": "Reach a total Brain Performance Score of 800+.",
        "icon": "Crown",
        "category": "Mastery",
        "requirements": {"type": "brain_score", "threshold": 800},
        "reward_xp": 500,
        "reward_coins": 250,
        "rarity": "Legendary",
    },
]


async def seed_initial_data(db: AsyncSession):
    # 1. Seed Games
    for g in INITIAL_GAMES:
        stmt = select(Game).where(Game.slug == g["slug"])
        existing = (await db.execute(stmt)).scalar_one_or_none()
        if not existing:
            game = Game(**g)
            db.add(game)

    # 2. Seed Achievements
    for ach in INITIAL_ACHIEVEMENTS:
        stmt = select(Achievement).where(Achievement.slug == ach["slug"])
        existing = (await db.execute(stmt)).scalar_one_or_none()
        if not existing:
            achievement = Achievement(**ach)
            db.add(achievement)

    # 3. Seed Admin User
    admin_stmt = select(User).where(User.email == "admin@mindspark.com")
    admin_user = (await db.execute(admin_stmt)).scalar_one_or_none()
    if not admin_user:
        admin = User(
            username="admin",
            email="admin@mindspark.com",
            password_hash=hash_password("admin123"),
            is_active=True,
            is_verified=True,
            role="admin",
        )
        db.add(admin)
        await db.flush()
        db.add(UserProfile(user_id=admin.id, display_name="Admin Chief"))
        db.add(UserStats(user_id=admin.id, brain_score=900, level=10, total_xp=5000, coins=1000))

    # 4. Seed Demo User John
    john_stmt = select(User).where(User.email == "john@gmail.com")
    john_user = (await db.execute(john_stmt)).scalar_one_or_none()
    if not john_user:
        john = User(
            username="john",
            email="john@gmail.com",
            password_hash=hash_password("john123"),
            is_active=True,
            is_verified=True,
            role="user",
        )
        db.add(john)
        await db.flush()
        db.add(UserProfile(user_id=john.id, display_name="John Explorer"))
        db.add(UserStats(
            user_id=john.id,
            brain_score=762,
            level=5,
            total_xp=650,
            coins=1250,
            current_streak=12,
            longest_streak=14,
            total_games_played=42,
            total_play_time=3600,
            accuracy_average=86.5,
        ))

    await db.commit()

