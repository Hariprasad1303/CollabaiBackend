//import mongoose
const mongoose=require("mongoose");

//create projectmemeber schema
const projectMemberSchema=new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"projects",
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true
    },
    status:{
        type:String,
        enum:["pending","accept","rejected"],
        default:"pending"
    },
},{timestamps:true});

//create projectMember model
const projectMembers=mongoose.model("projectMembers",projectMemberSchema);

//export model
module.exports=projectMembers;