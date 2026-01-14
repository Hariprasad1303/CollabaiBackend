//import bcrypt
const bcrypt=require("bcrypt");

//import nodemailer
const nodemailer=require("nodemailer");

//import projectMembers model
const projectMembers = require("../models/projectMemberModel");

//import project model
const projects = require("../models/projectModel");

//import user modal
const users = require("../models/userModel");

//import tasks model
const tasks=require("../models/tasksModel")

//import jwt
const jwt = require("jsonwebtoken");


//sign up controller both manager and employee
exports.signupController = async (req, res) => {
  //logic
  const { username, email, password, role } = req.body;
  console.log(username, email, password, role);
  try {
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      res.status(400).json("Already existing User");
    } else {
      const newUser = new users({
        username,
        email,
        password,
        role,
      });
      //save data to mongodb
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//login controller-both manager and employee
exports.loginController = async (req, res) => {
  //logic
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      if (existingUser.password === password) {
        const token = jwt.sign(
          {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
          },
          process.env.secretKey
        );
        res.status(200).json({ existingUser, token });
      } else {
        res.status(400).json("password does not match");
      }
    } else {
      res.status(400).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//get user details
exports.getUserDetailsController = async (req, res) => {
  try {
    const { username, email, role } = req.user;
    res.status(200).json({ username, email, role });
  } catch (err) {
    res.status(500).json(err);
  }
};

//update profile controller
exports.updateController = async (req, res) => {
  //logic
  try {
    const { username, email } = req.body;
    console.log(username, email);
    const updatedUser = await users.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get team members controllers manager
exports.getManagerTeamController = async (req, res) => {
  try {
    //the user(manager) iniated the request
    const managerId = req.user.id;
    console.log(managerId);

    // find all projects created by this manager
    const managerProjects = await projects
      .find({ createdBy: managerId })
      .select("_id name date");
    console.log(managerProjects);

    //extract projectIds
    const projectIds = managerProjects.map((m) => m._id);
    console.log(projectIds);

    //find all accepted members  in this projects of manager
    const teamMembers = await projectMembers
      .find({ projectId: { $in: projectIds }, status: "accept" })
      .populate("userId", "username email role")
      .populate("projectId", "name date");
    console.log(teamMembers);

    //remove duplicates and groups per user
    const unique = new Map();
    teamMembers.forEach((m) => {
      const userId = m.userId._id.toString();
      //check user exists or not
      if (!unique.has(userId)) {
        unique.set(userId, {
          _id: m.userId._id,
          username: m.userId.username,
          email: m.userId.email,
          role: m.userId.role,
          projects: [],
        });
      }
      unique.get(userId).projects.push({
        name: m.projectId.name,
        dueDate: m.projectId.date
      });
    });

    const members = [...unique.values()];
    console.log(members);

    const totalMembers=members.length;
    console.log(totalMembers)

    res.status(200).json({members,totalMembers});
  } catch (err) {
    res.status(500).json(err.message);
  }
};


//admin login controller
exports.adminLoginController=async(req,res)=>{
  try{
    //destructuring the request
    const {email,password}=req.body;
    console.log(req.body);
    console.log(email,password);

    //find the admin
    const admin=await users.findOne({email,role:"admin"});
    if(!admin){
      return res.status(404).json("admin not found");
    }
    console.log(admin);
    console.log(admin.password,password);

    //password verification
    const isMatch=await  bcrypt.compare(password,admin.password);
    if(!isMatch){
      return res.status(401).json("Invalid password")
    }
    console.log(isMatch)

    //generate otp
    const otp=Math.floor(10000+Math.random()*90000).toString();
    console.log(otp);

    admin.otp=otp;
    admin.otpExpiry=Date.now()+5*60*1000;
    await admin.save();
    console.log(process.env.ADMIN_EMAIL);
    console.log(process.env.ADMIN_PASSWORD);

    //send otp to gmail
    const transporter=nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_PASSWORD
      }
    })

    await transporter.sendMail({
      to:admin.email,
      subject:"Collab AI Login OTP",
      html:`<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p> `
    })
    res.status(200).json("otp send to admin email");
  }catch(err){
    res.status(500).json(err.message)
  }
}


//admin verify Otp controller
exports.adminOtpVerifyController=async(req,res)=>{
  try{
    const {email,otp}=req.body;
    console.log(email,otp);

    //find the admin
    const admin =await users.findOne({email,role:"admin"});
    if(!admin){
      return res.status(404).json("admin not found")
    }
    console.log(admin);

    //verifying admin otp
    if(admin.otp!=otp){
      return res.status(400).json("Invalid OTP");
    }

    //check that otp is expired or not
    if( admin.otpExpiry< Date.now()){
      return res.status(400).json("OTP Expired");
    }


    //clear otp
    admin.otp=null;
    admin.otpExpiry=null;
    await admin.save();

    //create jwt
    const token=jwt.sign({id:admin._id,role:"admin"},process.env.secretKey);
    console.log(token)


    res.status(200).json({token,admin:{
      id:admin._id,
      username:admin.username,
      email:admin.email,
      password:admin.password
    }});
  }catch(err){
    res.status(500).json(err.message);
  }
}


//get manager each project details
exports.getManagerProjectDetailsController=async(req,res)=>{
  try{
    //the user who requesting fopor details
    const managerId=req.user.id;

    //which project the manager requesting details for
    const projectId=req.params.projectId;

    //verify Project
    const project=await projects.find({
      _id:projectId,
      createdBy:managerId
    })
    if(!project){
      return res.status(403).json("Not authorised")
    }

    //get members in this project
    const members=await projectMembers.find({projectId,status:"accept"}).populate("userId","username email role");

    //get all the tasks in this project
    const Tasks=await tasks.find({projectId}).populate("assignedTo","username email");
   
    //project stats
    const stats={
      totalMembers:members.length,
      totaltasks:Tasks.length,
      todo:Tasks.filter(t=>t.status==="todo").length,
      inProgress:Tasks.filter(t=>t.status==="in-progress").length,
      completed:Tasks.filter(t=>t.status==="completed").length
    }

    res.status(200).json({
      project,members,Tasks,stats
    });
  }catch(err){
    res.status(500).json(err.message);
  }
}
