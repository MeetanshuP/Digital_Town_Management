const MarketplaceItem = require("../models/marketplaceItem");

/* ================= GET ALL MARKETPLACE ITEMS ================= */

exports.getAllItems = async (req, res) => {
    try {
        const items = await MarketplaceItem.find({ status: "available" })
            .populate("seller", "firstName lastName email phone")
            .populate("category")
            .sort({ createdAt: -1 });

        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= GET ITEM BY ID ================= */

exports.getItemById = async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id)
            .populate("seller", "firstName lastName email phone")
            .populate("category");

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= CREATE MARKETPLACE ITEM ================= */

exports.createItem = async (req, res) => {
    try {
        const { title, description, price, category } = req.body;

        if (!title || !price) {
            return res.status(400).json({
                message: "Title and price are required",
            });
        }

        const item = await MarketplaceItem.create({
            title,
            description,
            price,
            category,
            seller: req.user.id,
            status: "available",
        });

        return res.status(201).json({
            message: "Item created successfully",
            item,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= UPDATE MARKETPLACE ITEM ================= */

exports.updateItem = async (req, res) => {
    try {
        const { title, description, price, category, status } = req.body;

        const item = await MarketplaceItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check if user is the seller
        if (item.seller.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to update this item",
            });
        }

        if (title) item.title = title;
        if (description) item.description = description;
        if (price) item.price = price;
        if (category) item.category = category;
        if (status) item.status = status;

        await item.save();

        return res.status(200).json({
            message: "Item updated successfully",
            item,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= DELETE MARKETPLACE ITEM ================= */

exports.deleteItem = async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Check if user is the seller
        if (item.seller.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this item",
            });
        }

        await item.deleteOne();

        return res.status(200).json({
            message: "Item deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
