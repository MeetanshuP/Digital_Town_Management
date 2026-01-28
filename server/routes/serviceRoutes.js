const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authMiddleware, createService);
router.put("/:id", authMiddleware, updateService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;
