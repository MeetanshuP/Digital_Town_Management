const {Schema, model} = require("mongoose");
const FeedbackSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    type : {
        type : String,
        enum : ["complaint", "feedback", "suggestion"],
        default : "feedback",
    },
    message : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        enum : ["open", "in_progress", "resolved"],
        default : "open",
    },
},
    {timestamps : true}
); 

const FeedBack = model("Feedback", FeedbackSchema);
module.exports = FeedBack;
