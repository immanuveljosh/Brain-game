import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "MindSpark Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "mindspark_super_secret_jwt_key_change_in_production_9876543210"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./mindspark.db"
    POSTGRES_URL: str = "postgresql+asyncpg://mindspark:mindspark_password@localhost:5432/mindspark_db"
    USE_SQLITE_LOCAL: bool = True

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_ENABLED: bool = False

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 120
    AUTH_RATE_LIMIT_PER_MINUTE: int = 20

    # Game Progression Settings
    BASE_XP_PER_GAME: int = 50
    STREAK_BONUS_MULTIPLIER: float = 0.1
    MAX_BRAIN_SCORE: int = 1000
    MIN_BRAIN_SCORE: int = 0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def async_database_url(self) -> str:
        # If explicitly told to use SQLite or if DATABASE_URL starts with sqlite, use it
        if self.USE_SQLITE_LOCAL or "sqlite" in self.DATABASE_URL:
            return self.DATABASE_URL
        return self.POSTGRES_URL


settings = Settings()

