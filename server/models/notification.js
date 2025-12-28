const {Schema, model} = require ("mongoose");
const NotificationSchema = new Schema({
   user : {
    type : Schema.Types.ObjectId,
    ref : "User",
    required : true,
   },
   title : {
    type : String,
    required : true,
    trim : true,
   },
   message : {
    type : String,
    required : true
   },
   type : {
    type : String,
    enum : ["info", "warning", "alert"],
    default : "info",
   },
   isRead : {
    type : Boolean,
    default : false,
   },
}, 
    {timestamps : true}
);

const Notification = model("Notification", NotificationSchema);
module.exports = Notification;