const News = require("../models/news");

/* ================= GET ALL NEWS ================= */

exports.getAllNews = async (req, res) => {
    try {
        const news = await News.find({ status: "active" })
            .populate("postedBy", "firstName lastName email")
            .sort({ createdAt: -1 });

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
        const { title, description, category } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }

        const news = await News.create({
            title,
            description,
            category: category || "general",
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
        const { title, description, category, status } = req.body;

        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        // Update fields
        if (title) news.title = title;
        if (description) news.description = description;
        if (category) news.category = category;
        if (status) news.status = status;

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
