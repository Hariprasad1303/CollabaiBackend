//import user model
const users = require("../models/userModel");

//import jwt
const jwt = require("jsonwebtoken");

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

exports.loginController = async (req, res) => {
  //logic
  const { email, password} = req.body;
  console.log(email, password);
  try {
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      if (existingUser.password === password) {
        const token = jwt.sign({ userMail: existingUser.email }, "secretKey");
        res.status(200).json({existingUser,token});
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
