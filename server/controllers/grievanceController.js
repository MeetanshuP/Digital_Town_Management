const Feedback = require("../models/feedback");

/* ================= GET ALL GRIEVANCES ================= */

exports.getAllGrievances = async (req, res) => {
    try {
        let query = {};

        // If not admin, only show user's own grievances
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        const grievances = await Feedback.find(query)
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).json(grievances);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= GET GRIEVANCE BY ID ================= */

exports.getGrievanceById = async (req, res) => {
    try {
        const grievance = await Feedback.findById(req.params.id)
            .populate("user", "firstName lastName email");

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        return res.status(200).json(grievance);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= CREATE GRIEVANCE ================= */

exports.createGrievance = async (req, res) => {
    try {
        const { subject, message, category, evidence } = req.body;

        if (!subject || !message || !category || !evidence) {
            return res.status(400).json({
                message: "Subject and message are required",
            });
        }
        console.log(req.body);
        const grievance = await Feedback.create({
            subject,
            message,
            category: category || "general",
            evidence: evidence || "",
            user: req.user.id,
            status: "open",
        });

        return res.status(201).json({
            message: "Grievance submitted successfully",
            grievance,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= UPDATE GRIEVANCE ================= */

exports.updateGrievance = async (req, res) => {
    try {
        const { status, response } = req.body;

        const grievance = await Feedback.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        if (status) grievance.status = status;
        if (response) grievance.response = response;

        await grievance.save();

        return res.status(200).json({
            message: "Grievance updated successfully",
            grievance,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= DELETE GRIEVANCE ================= */

exports.deleteGrievance = async (req, res) => {
    try {
        const grievance = await Feedback.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: "Grievance not found" });
        }

        // Check if user is the owner
        if (grievance.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this grievance",
            });
        }

        await grievance.deleteOne();

        return res.status(200).json({
            message: "Grievance deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
