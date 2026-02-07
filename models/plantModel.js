const mongoose=require("mongoose")
const plantSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plant name is required"]
    },
    price:{
        type:Number,
        required:[true,"Plant price is required"]
    },
    category:{
        type:String,
        required:[true,"Plant category is required"]
    },
    stock:{
        type:Number,
        required:[true,"Plant stock is required"]
    },
    description:{
        type:String,
        required:[true,"Plant description is required"]
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Creator ID is required"]
    }

},{
    timestamps:true
})
module.exports=mongoose.model("Plant",plantSchema)