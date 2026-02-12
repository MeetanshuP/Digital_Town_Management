
const express = require("express");
const router = express.Router();
    
const { protect } = require("../middleware/authMiddleware");

const {
    createServiceRequest,
    updateRequestStatus,
} = require("../controllers/serviceRequestController");


router.patch("/:id/status", protect, updateRequestStatus);
router.post("/", protect, createServiceRequest);
