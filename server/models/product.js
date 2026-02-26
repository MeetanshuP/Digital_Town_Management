const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },

        category: {
            type: String,
            enum: ["fruits", "vegetables"],
            required: [true, "Category is required"],
        },

        image: {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        availability: {
            type: String,
            enum: ["available", "out_of_stock"],
            default: "available",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ availability: 1 });

module.exports = mongoose.model("Product", productSchema);
