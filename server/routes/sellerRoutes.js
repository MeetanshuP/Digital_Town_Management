const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const rbac = require("../middleware/rbacMiddleware");

const sellerController = require("../controllers/sellerController");

// USER ROUTE //

// Apply to become seller
router.post(
    "/apply",
    authMiddleware,
    sellerController.applyForSeller
);

// ADMIN ROUTES //

// Get pending seller applications
router.get(
    "/pending",
    authMiddleware,
    rbac.isAdmin,
    sellerController.getPendingSellerRequests
);

// Approve seller
router.patch(
    "/approve/:userId",
    authMiddleware,
    rbac.isAdmin,
    sellerController.approveSeller
);

// Reject seller
router.patch(
    "/reject/:userId",
    authMiddleware,
    rbac.isAdmin,
    sellerController.rejectSeller
);

module.exports = router;
