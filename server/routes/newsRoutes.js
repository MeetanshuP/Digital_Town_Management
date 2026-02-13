const express = require("express");
const router = express.Router();

// Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/rbacMiddleware");

// Controllers
const {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getLocationBasedNews,
} = require("../controllers/newsController");

// Public routes
router.get("/", getAllNews);
router.get("/location", getLocationBasedNews);
router.get("/:id", getNewsById);

// Protected routes (require authentication)
router.post("/", authMiddleware, isAdmin, createNews);
router.put("/:id", authMiddleware, isAdmin, updateNews);
router.delete("/:id", authMiddleware, isAdmin, deleteNews);

module.exports = router;
