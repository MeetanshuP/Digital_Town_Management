const { Schema, model } = require("mongoose");

const TransactionSchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  item: {
    type: Schema.Types.ObjectId,
    ref: "MarketplaceItem",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },

  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "card"],
    default: "cod",
  },

  transactionDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = model("Transaction", TransactionSchema);
