//import mongoose
const mongoose=require("mongoose");

//create schema
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
       type:String,
       enum:["employee","manager","admin"],
       default:"employee" 
    }
},{timestamps:true});

//create model using schema
const users=mongoose.model("users",userSchema);
module.exports=users;