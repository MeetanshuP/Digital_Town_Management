const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    getAllGrievances,
    getGrievanceById,
    createGrievance,
    updateGrievance,
    deleteGrievance,
} = require("../controllers/grievanceController");

/* ================= GET ALL GRIEVANCES ================= */

router.get("/", authMiddleware, getAllGrievances);

/* ================= GET SINGLE GRIEVANCE ================= */

router.get("/:id", authMiddleware, getGrievanceById);

/* ================= CREATE GRIEVANCE ================= */

router.post(
    "/",
    authMiddleware,
    upload.single("evidence"),
    createGrievance
);

/* ================= UPDATE GRIEVANCE (ADMIN) ================= */

router.put(
    "/:id",
    authMiddleware,
    updateGrievance
);

/* ================= DELETE GRIEVANCE ================= */

router.delete(
    "/:id",
    authMiddleware,
    deleteGrievance
);

module.exports = router;