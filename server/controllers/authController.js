const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================= TOKEN ================= */

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

/* ================= REGISTER ================= */

exports.registerUser = async (req, res) => {
    try {
        const { firstName, email, password, role } = req.body;

        if (!firstName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        const token = generateToken(user);

        return res.status(201).json({
            message: "User successfully created",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= LOGIN ================= */

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= PROFILE ================= */

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= SWITCH ROLE ================= */

exports.switchRole = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            return res.status(403).json({
                message: "Admin role cannot be switched",
            });
        }

        if (!user.isRoleSwitchEnabled) {
            return res.status(403).json({
                message: "Role switch not enabled for this user",
            });
        }

        user.role =
            user.role === "user" ? "service_provider" : "user";

        await user.save();

        return res.status(200).json({
            message: "Role switched successfully",
            newRole: user.role,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

