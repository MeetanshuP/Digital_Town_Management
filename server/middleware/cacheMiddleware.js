const redisClient = require("../utils/redisClient");

/**
 * Generate smart cache key
 */
const generateCacheKey = (req) => {
    const base = req.baseUrl + req.path;

    const query = Object.keys(req.query).length
        ? `?${new URLSearchParams(req.query).toString()}`
        : "";

    return `cache:${base}${query}`;
};

/**
 * Cache Middleware
 */
const cacheMiddleware = (duration = 300) => {
    return async (req, res, next) => {
        try {
            const key = generateCacheKey(req);

            // 1. Check cache
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            // 2. Override res.json
            const originalJson = res.json.bind(res);

            res.json = async (body) => {
                try {
                    await redisClient.set(
                        key,
                        JSON.stringify(body),
                        { EX: duration }
                    );
                } catch (err) {
                    console.error("Redis SET error:", err);
                }

                return originalJson(body);
            };

            next();
        } catch (error) {
            console.error("Cache middleware error:", error);
            next();
        }
    };
};

module.exports = cacheMiddleware;