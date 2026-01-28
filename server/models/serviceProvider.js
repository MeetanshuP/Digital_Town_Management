const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        serviceCategory: {
            type: String,
            required: true,
        },
        serviceTitle: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            // required: true,
        },
        experience: {
            type: Number,
            // required: true,
        },
        location: {
            type: String,
            // required: true,
        },
        serviceImage: {
            type: String, // Cloudinary URL (optional)
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

module.exports =mongoose.models.ServiceProvider || mongoose.model(
    "ServiceProvider",
    ServiceProviderSchema
);
