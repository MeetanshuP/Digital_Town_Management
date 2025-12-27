const {Schema, model} = require ("mongoose");
const ServiceSchema = new Schema({
    serviceName : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
    },
    category : {
        type : String,
        required : true,
    },
    provider : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
},
    {timestamps : true},
);

const Service = model("Service", ServiceSchema);
module.exports = Service;