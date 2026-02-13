// Simple in-memory cache

const cacheStore = new Map();

const setCache = (key, value, ttlSeconds = 900) => {
    const expiryTime = Date.now() + ttlSeconds * 1000;

    cacheStore.set(key, {
        value,
        expiryTime
    });
};

const getCache = (key) => {
    const cached = cacheStore.get(key);

    if (!cached) return null;

    if (Date.now() > cached.expiryTime) {
        cacheStore.delete(key);
        return null;
    }

    return cached.value;
};

module.exports = {
    setCache,
    getCache
};
