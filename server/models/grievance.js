const { Schema, model } = require("mongoose");

const GrievanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["general", "complaint", "feedback", "suggestion"],
      default: "general",
    },

    evidence: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    location: {
      address: String,
      lat: Number,
      lng: Number,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },

    department: {
      type: String,
      default: "",
    },

    adminRemark: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = model("Grievance", GrievanceSchema);