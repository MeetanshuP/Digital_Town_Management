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

  status: {
    type: String,
    enum: [
      "SUBMITTED",
      "IN_PROGRESS",
      "COMPLETED",
      "REJECTED"
    ],
    default: "SUBMITTED"
  },

  remarks: String,

  updatedBy: {
    type: String,
    enum: ["USER", "ADMIN", "PROVIDER"],
    default: "USER"
  }

}, { timestamps: true });

module.exports = model("ServiceRequest", ServiceRequestSchema);
