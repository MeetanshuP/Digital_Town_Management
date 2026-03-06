const express = require("express");
const router = express.Router();

// Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/rbacMiddleware");
const upload = require("../middleware/upload");

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

// Admin routes
router.post("/", authMiddleware, isAdmin, upload.single("image"), createNews);
router.put("/:id", authMiddleware, isAdmin, upload.single("image"), updateNews);
router.delete("/:id", authMiddleware, isAdmin, deleteNews);

module.exports = router;