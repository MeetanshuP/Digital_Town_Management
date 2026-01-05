const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ServiceCategorySchema = new Schema(
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

module.exports = model("ServiceCategory", ServiceCategorySchema);
