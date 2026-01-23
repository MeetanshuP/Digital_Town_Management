const {Schema, model} = require ("mongoose");

const UserSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        select : false,
    },
    phone : {
        type : String,
    },
    address : {
        street : String,
        city : String,
        state : String,
        pincode : String,
    },
    role : {
        type : String,
        enum : ["user", "service_provider", "admin"],
        default : "user",
    },
    isRoleSwitchEnabled: {
        type : Boolean,
        default : false,
    },
}, {timestamps : true})

const User = model("User", UserSchema);
module.exports = User;