//import mongoose
const mongoose=require("mongoose");

//create notification schema
const notificationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"projects",
    },
    message:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

//create model for notification
const notifications=mongoose.model("nojtifications",notificationSchema);

//export model
module.exports=notifications;