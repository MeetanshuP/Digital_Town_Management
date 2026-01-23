const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {isAdmin} = require("../middleware/rbacMiddleware");

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message : "Request Granted",
        user : req.user,
    });
});

router.get('/admin-only', authMiddleware, isAdmin, (req, res) => {
    res.json({
        message : "Admin access granted",
    });
});

module.exports = router;