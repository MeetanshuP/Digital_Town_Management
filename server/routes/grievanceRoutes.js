const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllGrievances,
    getGrievanceById,
    createGrievance,
    updateGrievance,
    deleteGrievance,
} = require("../controllers/grievanceController");

// All grievance routes require authentication
router.get("/", authMiddleware, getAllGrievances);
router.get("/:id", authMiddleware, getGrievanceById);
router.post("/", authMiddleware, createGrievance);
router.put("/:id", authMiddleware, updateGrievance);
router.delete("/:id", authMiddleware, deleteGrievance);

module.exports = router;
