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
    state: {
        type: String,
        // required: true
    },
    district: String,
    city: String,

    address: {
        type: String,
        // required: true
    },
    provider : {
        type : Schema.Types.ObjectId,
        ref : "ServiceProvider",
        required : true,
        // default: null
    },
    contactNumber: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
        type: [Number], // [lng, lat]
    }
    },

  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  }
},
    { timestamps: true },
);

ServiceSchema.index({ provider: 1 });
ServiceSchema.index({ location: "2dsphere" });

const Service = model("Service", ServiceSchema);
module.exports = Service;