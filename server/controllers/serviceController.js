const Service = require("../models/service");

/* ================= GET ALL SERVICES ================= */

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ status: "active" })
            .populate("category")
            .sort({ createdAt: -1 });

        return res.status(200).json(services);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= GET SERVICE BY ID ================= */

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate("category");

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        return res.status(200).json(service);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= CREATE SERVICE ================= */

exports.createService = async (req, res) => {
    try {
        const { name, description, contactNumber, category, address } = req.body;

        if (!name || !contactNumber) {
            return res.status(400).json({
                message: "Name and contact number are required",
            });
        }

        const service = await Service.create({
            name,
            description,
            contactNumber,
            category,
            address,
        });

        return res.status(201).json({
            message: "Service created successfully",
            service,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= UPDATE SERVICE ================= */

exports.updateService = async (req, res) => {
    try {
        const { name, description, contactNumber, category, address, status } = req.body;

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (name) service.name = name;
        if (description) service.description = description;
        if (contactNumber) service.contactNumber = contactNumber;
        if (category) service.category = category;
        if (address) service.address = address;
        if (status) service.status = status;

        await service.save();

        return res.status(200).json({
            message: "Service updated successfully",
            service,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= DELETE SERVICE ================= */

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        await service.deleteOne();

        return res.status(200).json({
            message: "Service deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
