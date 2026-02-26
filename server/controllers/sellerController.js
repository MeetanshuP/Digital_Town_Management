const User = require("../models/user");

// USER: Apply To Become Seller //

exports.applyForSeller = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Already approved seller
        if (user.roles.includes("seller")) {
            return res.status(400).json({ message: "You are already a seller" });
        }

        // Already applied
        if (user.sellerStatus === "pending") {
            return res.status(400).json({ message: "Application already pending" });
        }

        user.sellerStatus = "pending";
        await user.save();

        res.status(200).json({ message: "Seller application submitted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Get Pending Seller Requests // 

exports.getPendingSellerRequests = async (req, res) => {
    try {
        const users = await User.find({ sellerStatus: "pending" })
            .select("firstName lastName email sellerStatus");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Approve Seller //

exports.approveSeller = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.roles.includes("seller")) {
            return res.status(400).json({ message: "Already a seller" });
        }

        user.roles.push("seller");
        user.sellerStatus = "approved";

        await user.save();

        res.status(200).json({ message: "Seller approved successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: Reject Seller //

exports.rejectSeller = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.sellerStatus = "rejected";

        await user.save();

        res.status(200).json({ message: "Seller application rejected" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
