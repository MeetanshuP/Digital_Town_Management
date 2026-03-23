// Simple in-memory cache
const cacheStore = new Map();

/* ================= SET CACHE ================= */
const setCache = (key, value, ttlSeconds = 900) => {
    const expiryTime = Date.now() + ttlSeconds * 1000;

    cacheStore.set(key, {
        value,
        expiryTime
    });
};

/* ================= GET CACHE ================= */
const getCache = (key) => {
    const cached = cacheStore.get(key);

    if (!cached) return null;

    // Expired → delete and return null
    if (Date.now() > cached.expiryTime) {
        cacheStore.delete(key);
        return null;
    }

    return cached.value;
};

/* ================= CLEAR CACHE BY PATTERN ================= */
const clearCacheByPattern = (pattern) => {
    const keys = Array.from(cacheStore.keys());

    keys.forEach((key) => {
        // Simple pattern match (supports "news:*")
        if (key.startsWith(pattern.replace("*", ""))) {
            cacheStore.delete(key);
        }
    });

    console.log(`🧹 Cache cleared for pattern: ${pattern}`);
};

/* ================= OPTIONAL: CLEAR ALL CACHE ================= */
const clearAllCache = () => {
    cacheStore.clear();
    console.log("🧹 All cache cleared");
};

module.exports = {
    setCache,
    getCache,
    clearCacheByPattern,
    clearAllCache
};