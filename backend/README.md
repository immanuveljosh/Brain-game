# MindSpark Backend – Production Architecture & API Reference

MindSpark is a cognitive puzzle and brain-training backend built with **Python 3.12+**, **FastAPI**, **PostgreSQL**, **SQLAlchemy 2.0 (Async)**, **Alembic**, **Pydantic v2**, **Redis**, **PyJWT**, **Argon2**, and **Docker**.

---

## 1. System Architecture

```
                               ┌────────────────────────────────────────┐
                               │           React + TypeScript           │
                               │          MindSpark Frontend            │
                               └──────────────────┬─────────────────────┘
                                                  │ HTTPS / WSS
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │         FastAPI Web Service            │
                               │   (Security Headers, CORS, Limiter)    │
                               └───────┬────────────────────────┬───────┘
                                       │                        │
                    ┌──────────────────┴─────────────┐          │
                    ▼                                ▼          ▼
       ┌────────────────────────┐        ┌────────────────────────┐
       │   PostgreSQL 16        │        │   Redis 7 (Cache)      │
       │   (AsyncPG Pool)       │        │   (Leaderboard / TTL)  │
       └────────────────────────┘        └────────────────────────┘
```

---

## 2. Technology Stack

- **Framework**: FastAPI (Async ASGI, OpenAPI 3.1 docs)
- **Database**: PostgreSQL 16 (AsyncPG driver) with SQLite+aiosqlite zero-dependency local fallback
- **ORM**: SQLAlchemy 2.0 with async declarative mapping
- **Migrations**: Alembic
- **Validation & Serialization**: Pydantic v2 with `ConfigDict(from_attributes=True)`
- **Caching**: Redis with an in-memory fallback cache
- **Security & Passwords**: Argon2id (`argon2-cffi`)
- **Authentication**: JWT (Access Token + Refresh Token + JTI revocation)
- **Real-time Duels**: WebSockets for 1v1 live matchmaking
- **Testing**: pytest & pytest-asyncio (in-memory async database fixtures)
- **Containerization**: Multi-stage Dockerfile and docker-compose.yml

---

## 3. Database Schema Overview

The database contains 13 core relational tables:

1. **`users`**: User accounts, Argon2 password hashes, avatar, roles (`user`, `admin`), active/verified flags.
2. **`user_profiles`**: Display name, country, timezone, language, dark theme, notification preferences.
3. **`user_stats`**: Brain performance score (0-1000), total XP, current level, coins, daily streaks, play time, average accuracy.
4. **`games`**: 26 brain games categorized into Memory, Logic, Math, Focus, Visual, Language.
5. **`game_sessions`**: Complete session lifecycle (started, duration, validated score, accuracy, seed, status).
6. **`game_results`**: Historical game results with reaction times and reward records.
7. **`achievements`**: Badges across Common, Rare, Epic, and Legendary tiers with criteria.
8. **`user_achievements`**: Junction table for unlocked user trophies.
9. **`daily_challenges`**: Three scheduled challenges per calendar day.
10. **`challenge_progress`**: User challenge completion status.
11. **`daily_activity`**: Day-by-day training logs (games played, minutes trained, XP gained).
12. **`leaderboard_snapshots`**: Periodic snapshots for global, weekly, and monthly rankings.
13. **`rewards`**: Auditable log of all coin and XP reward distributions.
14. **`friendships`**: Friend connections and requests.
15. **`multiplayer_rooms`**: 1v1 duel room codes, live host/guest scores, and match results.
16. **`revoked_tokens`**: Blacklisted JWT token JTIs for secure logout.

---

## 4. API Endpoints Map

### Authentication (`/api/v1/auth`)
- `POST /register`: Register new account with Argon2 password hashing.
- `POST /login`: Authenticate and receive Access + Refresh JWT tokens.
- `POST /refresh`: Issue a new Access Token from a valid Refresh Token.
- `POST /logout`: Invalidate current token and revoke session.
- `POST /change-password`: Secure password change.
- `POST /forgot-password` & `POST /reset-password`: Account recovery.

### Users & Profiles (`/api/v1/users`, `/api/v1/profile`)
- `GET /api/v1/users/me`: Return current user account, stats, and profile.
- `DELETE /api/v1/users/me`: Account deletion.
- `GET /api/v1/profile/`: Fetch user display preferences and theme.
- `PUT /api/v1/profile/`: Update display name, country, timezone, and notification settings.

### Game Sessions & Validation (`/api/v1/sessions`)
- `POST /start`: Start a new game session with a deterministic seed and server-generated challenges.
- `POST /{session_id}/answer`: Submit a step answer with latency and anti-cheat validation.
- `POST /{session_id}/complete`: Finalize session, calculate XP, update stats, evaluate achievements, and update streak.
- `POST /{session_id}/cancel`: Cancel an active session.
- `GET /history/me`: Retrieve user game session history.

### Games Library (`/api/v1/games`)
- `GET /`: List all active games with category and difficulty filters.
- `GET /categories`: List the 6 categories with game counts and descriptions.
- `GET /{slug}`: Game instructions and configuration.

### Cognitive Diagnostics & Scores (`/api/v1/brain-score`, `/api/v1/stats`)
- `GET /api/v1/brain-score/`: Weighted Brain Score (0 - 1000), cognitive percentiles, and estimated Brain Age.
- `GET /api/v1/brain-score/history`: 14-day cognitive vitality timeline.
- `GET /api/v1/stats/me`: Level, XP progress, coins, and streaks.

### Daily Challenges & Missions (`/api/v1/challenges`)
- `GET /today`: Today's 3 scheduled challenges with user completion status.
- `POST /claim-bonus`: Claim 100 bonus coins + 150 XP upon clearing all 3 challenges.

### Achievements & Leaderboards (`/api/v1/achievements`, `/api/v1/leaderboards`)
- `GET /api/v1/achievements/`: List all badges with live progress and unlock timestamps.
- `GET /api/v1/leaderboards/`: Paginated rankings (Global, Friends, Weekly) with the user's live rank.

### Social & Multiplayer (`/api/v1/friends`, `/api/v1/multiplayer`)
- `GET /api/v1/friends/`: Active friends list with online presence.
- `POST /api/v1/friends/request`: Send friend request.
- `POST /api/v1/multiplayer/rooms`: Create a 1v1 duel room.
- `POST /api/v1/multiplayer/rooms/join`: Join a duel via a 6-character room code.
- `WSS /api/v1/multiplayer/ws/{room_code}`: Real-time WebSocket connection for live duels.

### Admin Moderation (`/api/v1/admin`)
- `GET /stats`: System KPIs (total users, sessions, average brain score).
- `GET /users`: Paginated user moderation table.
- `PUT /users/{id}`: Activate, deactivate, or assign admin role.
- `POST /games`: Create new cognitive game definition.

---

## 5. Game Engine Lifecycle & Anti-Cheat

The game engine validates inputs on the server:
- **Math Sprint**: Server validates arithmetic operations and flags responses faster than 80ms as bot behavior.
- **Reaction Test**: Random delay (`1.5s - 4.0s`). Reactions under 100ms are flagged as false starts or automated clicks.
- **Memory Tiles**: Validates tile indexes and matching logic server-side.
- **Pattern Master**: Checks answers against mathematical sequences (Fibonacci, geometric progressions, rotation).
- **Color Confusion**: Verifies ink color selection against Stroop effect rules.

---

## 6. How to Run

### Local Development (Zero-Dependency SQLite Mode)
```bash
# From workspace root:
cd backend

# Install dependencies:
pip install -r requirements.txt

# Run Uvicorn:
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Seeded Accounts:
  - Admin: `admin@mindspark.com` / `admin123`
  - Demo User: `john@gmail.com` / `john123`

### Run Automated Tests
```bash
python -m pytest backend/tests -v
```

### Production Deployment (Docker Compose)
```bash
cd backend
docker-compose up -d --build
```
This launches:
1. `mindspark_postgres`: PostgreSQL 16 on port 5432 with persistent volumes.
2. `mindspark_redis`: Redis 7 on port 6379 for caching.
3. `mindspark_backend`: FastAPI app with 4 Uvicorn workers on port 8000.

