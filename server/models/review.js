const {Schema, model} = require("mongoose");
const ReviewSchema = new Schema ({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    targetModel : {
        type : String,
        enum : ["Service", "MarketplaceItem"],
        required : true,
    },
    targetId : {
        type : Schema.Types.ObjectId,
        required : true,
    },
    rating : {
        type : Number,
        required : true,
        min : 1,
        max  : 5,
    },
    comment : {
        type : String,
        trim : true,
    },
},
    {timestamps : true}
);

ReviewSchema.index(
  { user: 1, targetModel: 1, targetId: 1 },
  { unique: true }
);

const Review = model("Review", ReviewSchema);
module.exports = Review;