const { Schema, model } = require("mongoose");

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["announcement", "general", "emergency"],
      default: "general"
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active"
    },
    isEmergency: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

const News = model("News", NewsSchema);
module.exports = News;