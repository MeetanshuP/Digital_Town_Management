const express = require("express");
const router = express.Router();

//Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");

//Controllers
const {
    registerUser,
    loginUser,
    getProfile,
    switchRole,
} = require("../controllers/authController");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getProfile);
router.patch('/switch-role', authMiddleware, switchRole);

router.get('/admin-only', authMiddleware, rbacMiddleware(['ADMIN']),
    (req, res) => {
        res.status(200).json({message : "Admin access granted"});
    }
);

module.exports = router;