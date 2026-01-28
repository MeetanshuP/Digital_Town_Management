const express = require("express");
const {
  getPendingRequests,
  updateRequestStatus,
} = require("../controllers/adminServiceProviderController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/rbacMiddleware");

const router = express.Router();

router.get("/service-providers", authMiddleware, isAdmin, getPendingRequests);
router.patch(
  "/service-providers/:id",
  authMiddleware,
  isAdmin,
  updateRequestStatus
);

module.exports = router;
