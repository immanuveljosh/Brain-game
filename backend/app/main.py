import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings
from app.database import engine, Base, AsyncSessionLocal
from app.redis import cache
from app.utils.seed import seed_initial_data

# Import API Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.profile import router as profile_router
from app.api.v1.games import router as games_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.results import router as results_router
from app.api.v1.stats import router as stats_router
from app.api.v1.brain_score import router as brain_score_router
from app.api.v1.challenges import router as challenges_router
from app.api.v1.achievements import router as achievements_router
from app.api.v1.leaderboards import router as leaderboards_router
from app.api.v1.rewards import router as rewards_router
from app.api.v1.friends import router as friends_router
from app.api.v1.multiplayer import router as multiplayer_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.admin import router as admin_router


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed initial games/achievements
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await cache.connect()

    async with AsyncSessionLocal() as session:
        await seed_initial_data(session)

    yield

    # Shutdown
    await cache.close()
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade RESTful API backend for MindSpark Cognitive Training Platform",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)


# Health check
@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


# Include v1 Routers
api_v1_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=f"{api_v1_prefix}/auth", tags=["Authentication"])
app.include_router(users_router, prefix=f"{api_v1_prefix}/users", tags=["Users"])
app.include_router(profile_router, prefix=f"{api_v1_prefix}/profile", tags=["User Profile"])
app.include_router(games_router, prefix=f"{api_v1_prefix}/games", tags=["Games"])
app.include_router(sessions_router, prefix=f"{api_v1_prefix}/sessions", tags=["Game Sessions"])
app.include_router(results_router, prefix=f"{api_v1_prefix}/results", tags=["Game Results"])
app.include_router(stats_router, prefix=f"{api_v1_prefix}/stats", tags=["User Stats"])
app.include_router(brain_score_router, prefix=f"{api_v1_prefix}/brain-score", tags=["Brain Score"])
app.include_router(challenges_router, prefix=f"{api_v1_prefix}/challenges", tags=["Daily Challenges"])
app.include_router(achievements_router, prefix=f"{api_v1_prefix}/achievements", tags=["Achievements"])
app.include_router(leaderboards_router, prefix=f"{api_v1_prefix}/leaderboards", tags=["Leaderboards"])
app.include_router(rewards_router, prefix=f"{api_v1_prefix}/rewards", tags=["Rewards"])
app.include_router(friends_router, prefix=f"{api_v1_prefix}/friends", tags=["Friends"])
app.include_router(multiplayer_router, prefix=f"{api_v1_prefix}/multiplayer", tags=["Multiplayer Duels"])
app.include_router(analytics_router, prefix=f"{api_v1_prefix}/analytics", tags=["Analytics"])
app.include_router(admin_router, prefix=f"{api_v1_prefix}/admin", tags=["Admin"])

