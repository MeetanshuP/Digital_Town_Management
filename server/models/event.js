const { Schema, model } = require("mongoose");

const EventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        eventDate: {
            type: Date,
            required: true,
        },

        eventTime: {
            type: String,
        },

        status: {
            type: String,
            enum: ["completed", "upcoming", "cancelled"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

const Event = model("Event", EventSchema);
module.exports = Event;