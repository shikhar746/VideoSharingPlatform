import { getRedisClient } from "../db/redis.js";

/**
 * cacheMiddleware(ttlSeconds, keyBuilder?)
 *
 * Uses the Upstash REST client (@upstash/redis), not ioredis. Key behavioral
 * differences from a TCP/ioredis setup:
 *  - There's no persistent connection or "status" to check — every call is
 *    a single HTTPS request. We just check the client exists.
 *  - redis.get() auto-deserializes JSON, so no JSON.parse() needed here.
 *  - redis.set() takes options as an object: { ex: seconds } instead of
 *    ioredis's ("EX", seconds) argument style.
 *
 * - On GET requests: checks Redis for a cached response under the cache key.
 *   - HIT  -> returns the cached JSON immediately, sets header X-Cache: HIT
 *   - MISS -> lets the request continue, then intercepts res.json() to store
 *             the response body in Redis before sending it, sets X-Cache: MISS
 *
 * - If Redis isn't configured or a call fails, this middleware quietly does
 *   nothing and the request behaves as if there were no caching at all.
 *   Caching should never be why your API is down.
 *
 * keyBuilder: optional (req) => string, defaults to req.originalUrl
 */
const cacheMiddleware = (ttlSeconds = 60, keyBuilder = null) => {
    return async (req, res, next) => {
        const redis = getRedisClient();

        // No Redis configured — skip caching entirely, don't block the request
        if (!redis) {
            return next();
        }

        // Only cache safe, idempotent reads
        if (req.method !== "GET") {
            return next();
        }

        const cacheKey = `cache:${keyBuilder ? keyBuilder(req) : req.originalUrl}`;

        try {
            const cached = await redis.get(cacheKey); // already deserialized
            if (cached) {
                res.setHeader("X-Cache", "HIT");
                return res.status(200).json(cached);
            }
        } catch (err) {
            console.log("Redis GET failed, bypassing cache:", err.message);
            return next();
        }

        // Cache miss — intercept res.json() so we can store the response
        // once the actual route handler produces it.
        const originalJson = res.json.bind(res);

        res.json = (body) => {
            res.setHeader("X-Cache", "MISS");

            // Only cache successful responses — don't cache errors
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redis
                    .set(cacheKey, body, { ex: ttlSeconds })
                    .catch((err) =>
                        console.log("Redis SET failed (response still sent normally):", err.message)
                    );
            }

            return originalJson(body);
        };

        next();
    };
};

/**
 * invalidateCache(pattern)
 * Deletes all cache keys matching a pattern, e.g. "cache:/api/v1/videos*"
 * Call this from write/update/delete controllers for the same resource
 * so stale reads don't linger after a mutation.
 *
 * Note: the Upstash REST client supports `keys()` with glob patterns the
 * same way ioredis does, backed by the same underlying Redis SCAN semantics.
 */
const invalidateCache = async (pattern) => {
    const redis = getRedisClient();
    if (!redis) return;

    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (err) {
        console.log("Redis cache invalidation failed:", err.message);
    }
};

export { cacheMiddleware, invalidateCache };