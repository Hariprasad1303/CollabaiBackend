//import mongoose
const mongoose=require("mongoose")

//import bcrypt
const bcrypt=require("bcrypt");


//import dotenv
require("dotenv").config()

//import user model
const users=require("./models/userModel")

//connect mongodb
const connectionString=process.env.DATABASE;
console.log(connectionString);
mongoose.connect(connectionString).then(()=>{
    console.log("dbConnected")
}).catch((err)=>console.log(err));


async function hashAdmin(){
    //find admin
    const admin=await users.findOne({role:"admin"});
    console.log(admin);
    

    //hashing the password
    const hashed=await bcrypt.hash(admin.password,10);
    console.log(hashed);

    admin.password=hashed;
    await admin.save();
    
    console.log("admin password hashed");
    process.exit();
}

//function call
hashAdmin();
