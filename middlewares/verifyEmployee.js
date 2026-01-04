//import jwt
const jwt=require("jsonwebtoken");

//import users model
const users = require("../models/userModel");

const verifyEmployee=async(req,res,next)=>{
   try{
    //get header form token
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json("Authorised token missing");
    }

    //get token
    const token=authHeader.split(" ")[1];
    console.log(token);

    //verifyToken
    const jwtResponse=jwt.verify(token,process.env.secretKey);
    console.log(jwtResponse);

    //find user
    const user=await users.findById(jwtResponse.id);
    //check user exists or not
    if(!user){
        return res.status(401).json("user not found")
    }
    console.log(user);

    //check role
    if(user.role!=="employee"){
        return res.status(400).json("Access denied.Employee only");
    }
    
    next();

   }catch(err){
    return res.status(401).json("Invalid token or expired token")
   } 
}
module.exports=verifyEmployee;