//import express
const express=require("express");

//import user controller
const userController=require('./controllers/userController')

//import project controller
const projectController=require('./controllers/projectController')

//import project controller
const notificationController=require('./controllers/notificationController')

//import employee controller
const employeeController=require('./controllers/employeeController');

//import task controller
const taskControler=require('./controllers/taskController')

//import verifyToken middleware
const verifyToken=require('./middlewares/verifyToken')

//import verifyManager middleware
const verifyManager=require('./middlewares/verifyManager');

//import verifyEmployee middleware
const verifyEmployee = require("./middlewares/verifyEmployee");

//create an instance
const route=new express.Router();

//route to sign up
route.post('/signup',userController.signupController);

//route to login 
route.post('/login',userController.loginController);

//route to get user details -both employes and manager
route.get('/userdetails',verifyToken,userController.getUserDetailsController)

//route to update profile
route.put('/profile',verifyToken,userController.updateController);

//route to  project create
route.post('/manager/projects',verifyToken,verifyManager,projectController.projectCreateController);

//route to  get project 
route.get('/manager/projects',verifyToken,projectController.getProjectController);

//route to update project
route.put('/manager/project/:id',verifyToken,verifyManager,projectController.projectUpdateController);

//route to delete project
route.delete('/manager/project/:id',verifyToken,verifyManager,projectController.projectDeleteController);

//route to get project count
route.get('/manager/projects/count',verifyToken,projectController.projectCountController)

//route to project invite
route.post('/manager/invite',verifyToken,verifyManager,projectController.projectInviteController)

//route to notifications(bothe employer and manager can seee the notifications )
route.get('/notifications',verifyToken,notificationController.getNotificationController);

//route to  mark as red  notifications
route.put('notifications/:id/read',verifyToken,notificationController.markAsReadController)

//route to accept invite for employee
route.put('/accept/:inviteId',verifyToken,employeeController.employeeInviteAcceptController);

//route to reject invite for employee
route.put('/reject/:inviteId',verifyToken,employeeController.employeeInviteRejectController);

//route to get the projects assigned for the employee
route.get('/employee/my-projects',verifyToken,employeeController.employeeGetProjectsController);

//route to get memebers of each prject which is inviiteioon accepted
route.get('/manager/project-members/:projectId',verifyToken,verifyManager,projectController.getMembersProjects)



//task creation

//route to create task
route.post('/manager/create-task',verifyToken,verifyManager,taskControler.createTaskController);

//route to fetch tasks created by manager for each project
route.get('/manager/tasks/project/:projectId',verifyToken,taskControler.fetchManagerTaskController)

//route to get all tasks created by that manager irrespective of project
route.get('/manager/tasks',verifyToken,verifyManager,taskControler.getAllTasksController)

//route to update taskk
route.put('/manager/tasks/:taskId',verifyToken,taskControler.updateTaskController);

//route to delete tasks
route.delete('/manager/delete-task/:taskId',verifyToken,verifyManager,taskControler.deleteTaskController);

//route to get task count for manager(which he is created)
route.get('/manager/tasks/count',verifyToken,taskControler.getTaskCountController)

//route to get task count which employee is assigned to
route.get('/employee/tasks/count',verifyToken,employeeController.employeeTaskskCountController)

//route to update status of tasks assigned to the employees
route.patch('/employee/tasks/:taskId/status',verifyToken,verifyEmployee,employeeController.employeeTastUpdateController);

//route to get employee team
route.get('/employee/team',verifyToken,verifyEmployee,employeeController.getMyTeamMembersController)

//route to get manager team
route.get('/manager/team',verifyToken,verifyManager,userController.getManagerTeamController);

//admin

//route for admin login
route.post('/admin/login',userController.adminLoginController);


//export route
module.exports=route;