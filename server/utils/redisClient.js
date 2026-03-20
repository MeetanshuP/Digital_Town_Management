const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Redis connection failed:", error);
    }
})();

module.exports = redisClient;