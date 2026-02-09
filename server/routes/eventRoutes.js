const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/rbacMiddleware");

const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    participateEvent,
} = require("../controllers/eventController");

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", authMiddleware, isAdmin, createEvent);
router.put("/:id", authMiddleware, isAdmin, updateEvent);
router.delete("/:id", authMiddleware, isAdmin, deleteEvent);
router.post("/:id/participate", authMiddleware, participateEvent);

module.exports = router;
