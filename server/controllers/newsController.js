const News = require("../models/news");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { clearCacheByPattern } = require("../utils/cacheInvalidation");

/* ================= GET ALL LOCAL NEWS ================= */

exports.getAllNews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        const skip = (page - 1) * limit;

        // ✅ Create unique cache key per page
        const cacheKey = `news:page:${page}:limit:${limit}`;

        // ✅ Try cache first
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            console.log("✅ Serving news from Redis:", cacheKey);

            return res.status(200).json({
                ...cachedData,
                source: "cache"
            });
        }

        // ❌ Cache miss → fetch from DB
        const [news, total] = await Promise.all([
            News.find()
                .populate("postedBy", "firstName lastName email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            News.countDocuments()
        ]);

        const responseData = {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: news
        };

        // ✅ Store in Redis (TTL: 10 min)
        await setCache(cacheKey, responseData, 600);

        console.log("🔥 Stored news in Redis:", cacheKey);

        return res.status(200).json(responseData);

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= GET NEWS BY ID ================= */

exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate("postedBy", "firstName lastName email");

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        return res.status(200).json(news);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= CREATE NEWS (ADMIN) ================= */

exports.createNews = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }

        // Upload image to Cloudinary
        const uploadFromBuffer = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "news" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await uploadFromBuffer();

        const news = await News.create({
            title,
            description,
            image: result.secure_url,
            postedBy: req.user.id,
        });

        // 🔥 Invalidate cache
        await clearCacheByPattern("news:*");

        return res.status(201).json({
            message: "News created successfully",
            news,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= UPDATE NEWS ================= */

exports.updateNews = async (req, res) => {
    try {
        const { title, description } = req.body;

        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        // Update title and description
        if (title) news.title = title;
        if (description) news.description = description;

        // If new image uploaded → upload to Cloudinary
        if (req.file) {

            const uploadFromBuffer = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "news" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );

                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const result = await uploadFromBuffer();
            news.image = result.secure_url;
        }

        await news.save();

        // 🔥 Invalidate cache
        await clearCacheByPattern("news:*");

        return res.status(200).json({
            message: "News updated successfully",
            news,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= DELETE NEWS ================= */

exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        await news.deleteOne();

        // 🔥 Invalidate cache
        await clearCacheByPattern("news:*");

        return res.status(200).json({
            message: "News deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= LOCATION BASED LIVE NEWS ================= */

const {
    getLocationFromCoordinates
} = require("../services/locationService");

const {
    fetchNewsByLocationAndCategory
} = require("../services/newsService");

const {
    getCache,
    setCache
} = require("../services/cacheService");

exports.getLocationBasedNews = async (req, res) => {
    try {
        const { lat, lon, category } = req.query;

        if (!lat || !lon || !category) {
            return res.status(400).json({
                message: "lat, lon and category are required",
            });
        }

        const location = await getLocationFromCoordinates(lat, lon);

        if (!location.state) {
            return res.status(500).json({
                message: "Unable to determine state from coordinates",
            });
        }

        const cacheKey = `news:${location.state}:${location.city || "NA"}:${category}`;

        const cachedNews = getCache(cacheKey);
        if (cachedNews) {
            return res.status(200).json({
                source: "cache",
                location,
                category,
                count: cachedNews.length,
                data: cachedNews,
            });
        }

        const news = await fetchNewsByLocationAndCategory({
            state: location.state,
            city: location.city,
            category,
        });

        setCache(cacheKey, news, 900);

        return res.status(200).json({
            source: "external",
            location,
            category,
            count: news.length,
            data: news,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};