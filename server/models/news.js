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

    image: {
      type: String,
      required: true
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },
  { timestamps: true }
);

const News = model("News", NewsSchema);

module.exports = News;