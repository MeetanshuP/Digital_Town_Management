const { Schema, model } = require("mongoose");
const ServiceSchema = new Schema({
    serviceName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contactNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
},
    { timestamps: true },
);

ServiceSchema.index({ provider: 1 });

const Service = model("Service", ServiceSchema);
module.exports = Service;