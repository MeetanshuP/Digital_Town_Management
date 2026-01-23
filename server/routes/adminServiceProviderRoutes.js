const express = require("express");
const {
  getPendingRequests,
  updateRequestStatus,
} = require("../controllers/adminServiceProviderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/rbacMiddleware");

const router = express.Router();

router.get("/service-providers", authMiddleware, adminOnly, getPendingRequests);
router.patch(
  "/service-providers/:id",
  authMiddleware,
  adminOnly,
  updateRequestStatus
);

module.exports = router;
