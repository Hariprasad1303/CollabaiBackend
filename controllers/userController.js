//import user model
const users=require("../models/userModel")

exports.signupController=(req,res)=>{
    //logic
    const {username,email,password,role}=req.body;
    console.log(username,email,password,role);
    res.status(200).json("Request received");
}