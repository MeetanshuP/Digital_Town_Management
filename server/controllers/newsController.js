const News = require("../models/news");

/* ================= GET ALL NEWS ================= */

exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find({ status: "active" })
            .populate("postedBy", "firstName lastName email")
            // Emergency news first, then latest
            .sort({ isEmergency: -1, createdAt: -1 });

        return res.status(200).json(news);
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

/* ================= CREATE NEWS ================= */

exports.createNews = async (req, res) => {
    try {
        const { title, description, category, isEmergency } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }

        const news = await News.create({
            title,
            description,
            category: category || "general",
            isEmergency: isEmergency || false, // 🚨
            postedBy: req.user.id,
        });

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
        const { title, description, category, status, isEmergency } = req.body;

        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        if (title) news.title = title;
        if (description) news.description = description;
        if (category) news.category = category;
        if (status) news.status = status;

        // Emergency toggle
        if (isEmergency !== undefined) {
            news.isEmergency = isEmergency;
        }

        await news.save();

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
} = require("../services/location.service");

const {
    fetchNewsByLocationAndCategory
} = require("../services/news.service");

const {
    getCache,
    setCache
} = require("../services/cache.service");

exports.getLocationBasedNews = async (req, res) => {
    try {
        const { lat, lon, category } = req.query;

        if (!lat || !lon || !category) {
            return res.status(400).json({
                message: "lat, lon and category are required",
            });
        }

        // 1️⃣ Resolve location
        const location = await getLocationFromCoordinates(lat, lon);

        if (!location.state) {
            return res.status(500).json({
                message: "Unable to determine state from coordinates",
            });
        }

        // 2️⃣ Cache key
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

        // 3️⃣ Fetch from external API
        const news = await fetchNewsByLocationAndCategory({
            state: location.state,
            city: location.city,
            category,
        });

        // 4️⃣ Cache for 15 minutes
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
