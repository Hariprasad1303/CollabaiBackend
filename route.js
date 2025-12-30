//import express
const express=require("express");

//import user controller
const userController=require('./controllers/userController')

//import project controller
const projectController=require('./controllers/projectController')

//import verifyToken middleware
const verifyToken=require('./middlewares/verifyToken')

//import verifyManager middleware
const verifyManager=require('./middlewares/verifyManager');

//create an instance
const route=new express.Router();

//route to sign up
route.post('/signup',userController.signupController);

//route to login 
route.post('/login',userController.loginController);

//route to get user details
route.get('/manager/userdetails',verifyToken,userController.getUserDetailsController)

//route to update profile
route.put('/manager/profile',verifyToken,userController.updateController);

//route to  project create
route.post('/manager/projects',verifyToken,verifyManager,projectController.projectCreateController);

//route to  get project 
route.get('/manager/projects',verifyToken,projectController.getProjectController);

//route to get project count
route.get('/manager/projects/count',verifyToken,projectController.projectCountController)

//route to project invite
route.post('/manager/invite',verifyToken,verifyManager,projectController.projectInviteController)

//export route
module.exports=route;