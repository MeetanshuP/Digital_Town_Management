const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

/**
 * Cached GET Routes
 */

// Cache list (5 min)
router.get("/", cacheMiddleware(300), getAllServices);

// Cache single service (5 min)
router.get("/:id", cacheMiddleware(300), getServiceById);


/**
 * Protected + Mutating Routes (NO CACHE)
 */

router.post("/", authMiddleware, createService);
router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;