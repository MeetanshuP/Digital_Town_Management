const express = require("express");
const router = express.Router();

// Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/rbacMiddleware");
const upload = require("../middleware/upload");
const cacheMiddleware = require("../middleware/cacheMiddleware");

// Controllers
const {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getLocationBasedNews,
} = require("../controllers/newsController");

// ================= PUBLIC ROUTES (CACHED) =================

// All news (5 min cache)
router.get("/", cacheMiddleware(300), getAllNews);

// Location-based news (5 min cache)
router.get("/location", cacheMiddleware(300), getLocationBasedNews);

// Single news (10 min cache)
router.get("/:id", cacheMiddleware(600), getNewsById);

// ================= ADMIN ROUTES =================

router.post("/", authMiddleware, isAdmin, upload.single("image"), createNews);
router.put("/:id", authMiddleware, isAdmin, upload.single("image"), updateNews);
router.delete("/:id", authMiddleware, isAdmin, deleteNews);

module.exports = router;