const { Schema, model } = require("mongoose");

const FeedbackSchema = new Schema(
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
      type: String, // URL / filename / base64 etc.
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

module.exports = model("Feedback", FeedbackSchema);
