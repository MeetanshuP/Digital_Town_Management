const { Schema, model } = require("mongoose");

const ServiceRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  provider: {
    type: Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true
  },

  description: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  preferredDate: Date,

  status: {
    type: String,
    enum: [
      "PENDING",
      "ACCEPTED",
      "COMPLETED",
      "REJECTED",
      "CANCELLED"
    ],
    default: "PENDING"
  },

  completedAt: Date

}, { timestamps: true });

module.exports = model("ServiceRequest", ServiceRequestSchema);
