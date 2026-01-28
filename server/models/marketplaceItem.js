const {Schema, model} = require ("mongoose");
const MarketplaceItemSchema = new Schema ({
    itemName : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
    },
    price : {
        type : Number,
        required : true,
        min : 0,
    },
    seller : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    category : {
        type: Schema.Types.ObjectId,
        ref: "MarketplaceCategory",
        required : true,
    },
    images : {
        type : [String],
    },
    status : {
        type : String,
        enum : ["active", "sold", "inactive"],
        default : "active",
    },
}, 
    {timestamps : true}
);

const MarketplaceItem = model ("MarketplaceItem", MarketplaceItemSchema);
module.exports = MarketplaceItem;