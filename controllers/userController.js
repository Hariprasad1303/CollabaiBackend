//import user model
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
      res.status(400).josn("Already existing User");
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
    res.status(500).json(err);
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
            username:existingUser.username,
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
exports.getUserDetailsController=async(req,res)=>{
  try{
    const {username,email,role}=req.user;
    res.status(200).json({username,email,role})
  }catch(err){
    res.status(500).json(err);
  }
}
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
