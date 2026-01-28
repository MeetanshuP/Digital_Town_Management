const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MarketplaceCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = model("MarketplaceCategory", MarketplaceCategorySchema);
