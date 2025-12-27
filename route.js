//import express
const express=require("express");

//import user controller
const userController=require('./controllers/userController')

//create an instance
const route=new express.Router();

//route to sign up
route.post('/signup',userController.signupController);

//export route
module.exports=route;