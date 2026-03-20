const Grievance = require("../models/Grievance");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../config/cloudinary");

/* ================= GET ALL GRIEVANCES ================= */

exports.getAllGrievances = async (req, res) => {
    try {

        let query = {};

        if (req.user.role !== "admin") {
            query.user = req.user.id;
        }

        const grievances = await Grievance.find(query)
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json(grievances);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });

    }
};

/* ================= GET GRIEVANCE BY ID ================= */

exports.getGrievanceById = async (req, res) => {
    try {

        const grievance = await Grievance.findById(req.params.id)
            .populate("user", "firstName lastName email");

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found",
            });
        }

        res.status(200).json(grievance);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });

    }
};

/* ================= CREATE GRIEVANCE ================= */

exports.createGrievance = async (req, res) => {
    try {

        const { subject, message, category } = req.body;

        if (!subject || !message) {
            return res.status(400).json({
                message: "Subject and message are required",
            });
        }

        let evidence = {};

        if (req.file) {

            const result = await uploadToCloudinary(req.file.buffer);

            evidence = {
                url: result.secure_url,
                public_id: result.public_id,
            };

        }

        const grievance = await Grievance.create({
            subject,
            message,
            category: category || "general",
            user: req.user.id,
            status: "open",
            evidence,
        });

        res.status(201).json({
            message: "Grievance submitted successfully",
            grievance,
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });

    }
};

/* ================= UPDATE GRIEVANCE ================= */

exports.updateGrievance = async (req, res) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can update grievances",
            });
        }

        const { status, adminRemark } = req.body;

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found",
            });
        }

        if (status) grievance.status = status;
        if (adminRemark) grievance.adminRemark = adminRemark;

        await grievance.save();

        res.status(200).json({
            message: "Grievance updated successfully",
            grievance,
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });

    }
};

/* ================= DELETE GRIEVANCE ================= */

exports.deleteGrievance = async (req, res) => {
    try {

        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({
                message: "Grievance not found",
            });
        }

        if (
            grievance.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Not authorized to delete this grievance",
            });
        }

        // Delete image from Cloudinary
        if (grievance.evidence?.public_id) {
            await cloudinary.uploader.destroy(grievance.evidence.public_id);
        }

        await grievance.deleteOne();

        res.status(200).json({
            message: "Grievance deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });

    }
};