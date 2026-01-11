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
    console.log(email,password);

    //find the admin
    const admin=await users.find({email,role:"admin"});
    if(!admin){
      return res.status(404).json("admin not found");
    }
    console.log(admin)


    res.status(200).json(admin);
  }catch(err){
    res.status(500).json(err.message)
  }
}

