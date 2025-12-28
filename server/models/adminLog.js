const {Schema, model} = require ("mongoose");
const AdminLogSchema = new Schema({
    admin : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    action : {
        type : String,
        required : true,
    },
    targetModel : {
        type : String,
        required : true,
    },
    targetId :{
        type : Schema.Types.ObjectId,
        required : true,
    },
    
},
    {timestamps : true}
);

const AdminLog = model("AdminLog", AdminLogSchema);
module.exports = AdminLog;