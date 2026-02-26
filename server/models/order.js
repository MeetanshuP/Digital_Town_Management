const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
        },

        priceAtPurchase: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            validate: [(val) => val.length > 0, "Order must contain at least one item"],
        },

        status: {
            type: String,
            enum: [
                "placed",
                "accepted",
                "completed",
                "cancelled_by_seller",
            ],
            default: "placed",
        },

        cancellationRequest: {
            type: String,
            enum: ["none", "requested"],
            default: "none",
        },

        cancellationReason: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ seller: 1 });
orderSchema.index({ buyer: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
