const redisClient = require("./redisClient");

/**
 * Delete a specific cache key
 */
const clearCache = async (key) => {
    try {
        await redisClient.del(key);
        console.log(`🧹 Cache cleared: ${key}`);
    } catch (error) {
        console.error("Cache clear error:", error);
    }
};

/**
 * Clear cache by pattern
 */
const clearCacheByPattern = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);

        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`🧹 Cleared ${keys.length} cache keys`);
        }
    } catch (error) {
        console.error("Cache pattern clear error:", error);
    }
};

module.exports = {
    clearCache,
    clearCacheByPattern,
};