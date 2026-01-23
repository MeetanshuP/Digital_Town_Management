const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const ADMIN_EMAILS = [
    "vanditmuniya@gmail.com",
    "mitanshuparmar@gmail.com",
    "mitanshuparmar2003@gmail.com"
];

/* ================= REGISTER ================= */

// exports.registerUser = async (req, res) => {
//     try {
//         const { firstName,lastName,contactNumber, email, password, role } = req.body;

//         if (!firstName || !lastName || !contactNumber || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: "User already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         console.log(firstName,lastName,contactNumber,email,password,role);
//         const user = await User.create({
//             firstName,
//             lastName,
//             contactNumber,
//             email,
//             password: hashedPassword,
//             role: role || "user",
//         });

//         const token = generateToken({ id: user._id, role: user.role });

//         return res.status(201).json({
//             message: "User successfully created",
//             token,
//             user: {
//                 id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 contactNumber: user.contactNumber,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Server error",
//             error: error.message,
//         });
//     }
// };


exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, email, password } = req.body;

        if (!firstName || !lastName || !contactNumber || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Decide role securely
        const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

        const user = await User.create({
            firstName,
            lastName,
            contactNumber,
            email,
            password: hashedPassword,
            role,
        });

        const token = generateToken({ id: user._id, role: user.role });

        return res.status(201).json({
            message: "User successfully created",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                contactNumber: user.contactNumber,
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

// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 message: "Email and password required",
//             });
//         }

//         const user = await User.findOne({ email }).select("+password");
//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         const token = generateToken({ id: user._id, role: user.role });

//         return res.status(200).json({
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 contactNumber: user.contactNumber,
//                 email: user.email,
//                 role: user.role,
//             },
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Server error",
//             error: error.message,
//         });
//     }
// };


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

        // ✅ Decide effective role at login time
        const effectiveRole = ADMIN_EMAILS.includes(user.email)
            ? "admin"
            : "user";

        // OPTIONAL: sync DB role if mismatch (recommended)
        if (user.role !== effectiveRole) {
            user.role = effectiveRole;
            await user.save();
        }

        const token = generateToken({
            id: user._id,
            role: effectiveRole,
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                contactNumber: user.contactNumber,
                email: user.email,
                role: effectiveRole,
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

