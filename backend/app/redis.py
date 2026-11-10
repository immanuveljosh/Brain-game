import json
import time
from typing import Optional, Any
import redis.asyncio as aioredis
from app.config import settings

class CacheManager:
    def __init__(self):
        self._redis: Optional[aioredis.Redis] = None
        self._memory_cache: dict[str, tuple[Any, float]] = {}

    async def connect(self):
        if settings.REDIS_ENABLED:
            try:
                self._redis = aioredis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True,
                    socket_connect_timeout=2.0,
                )
                await self._redis.ping()
            except Exception:
                self._redis = None

    async def close(self):
        if self._redis:
            await self._redis.close()

    async def get(self, key: str) -> Optional[Any]:
        if self._redis:
            try:
                val = await self._redis.get(key)
                return json.loads(val) if val else None
            except Exception:
                pass
        
        # In-memory fallback
        item = self._memory_cache.get(key)
        if item:
            val, expiry = item
            if expiry == 0 or time.time() < expiry:
                return val
            else:
                del self._memory_cache[key]
        return None

    async def set(self, key: str, value: Any, expire_seconds: int = 300) -> bool:
        serialized = json.dumps(value)
        if self._redis:
            try:
                await self._redis.set(key, serialized, ex=expire_seconds)
                return True
            except Exception:
                pass

        # In-memory fallback
        expiry = time.time() + expire_seconds if expire_seconds > 0 else 0
        self._memory_cache[key] = (value, expiry)
        return True

    async def delete(self, key: str) -> bool:
        if self._redis:
            try:
                await self._redis.delete(key)
            except Exception:
                pass
        if key in self._memory_cache:
            del self._memory_cache[key]
        return True

    async def clear_prefix(self, prefix: str) -> bool:
        if self._redis:
            try:
                keys = await self._redis.keys(f"{prefix}*")
                if keys:
                    await self._redis.delete(*keys)
            except Exception:
                pass
        
        keys_to_del = [k for k in self._memory_cache if k.startswith(prefix)]
        for k in keys_to_del:
            del self._memory_cache[k]
        return True

cache = CacheManager()

