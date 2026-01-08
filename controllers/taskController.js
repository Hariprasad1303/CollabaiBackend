//import tasks model
const { response } = require("express");
const tasks = require("../models/tasksModel");
const projects=require("../models/projectModel")

//create task controller by manager
exports.createTaskController = async (req, res) => {
  //logic
  try {
    const { title, description, priority, projectId, assignedTo, dueDate } =
      req.body;
    console.log(title, description,priority,projectId, assignedTo, dueDate);
    if (!title||!description ||!projectId || !assignedTo ||!dueDate ||!priority) {
      return res.status(400).json("Missing required fields");
    }
    //get project
    const project = await projects.findById(projectId);
    if (!project) {
      return res.status(404).json("project not found");
    }
    console.log(project)
    //get projectDuedate
    const projectDueDate = project.date;
    if(!projectDueDate){
      return res.status(400).json("project does not have a due date")
    }
    console.log(projectDueDate);

    //due date validation
    if (new Date(dueDate) > new Date(projectDueDate)) {
      return res
        .status(400)
        .json("task due date cannot exceed project due date");
    }

    const newTask = new tasks({
      title,
      description,
      priority,
      projectId,
      assignedTo,
      dueDate,
      createdBy: req.user.id,
    });
    await newTask.save();
    console.log(newTask);
    res.status(200).json(newTask);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// fetch tasks controller for each project
exports.fetchManagerTaskController = async (req, res) => {
  //logic
  try {
    const { projectId } = req.params;
    console.log(projectId);
    const task = await tasks.find({ projectId });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

//fetch alltasks controller irrespective of project
exports.getAllTasksController=async(req,res)=>{
  //logic
  try{
    const managerId=req.user.id;
    console.log(managerId);
    const managerTasks=await tasks.find({createdBy:managerId}).populate("assignedTo","username email").populate("projectId","name date");
    console.log(managerTasks);
    res.status(200).json(managerTasks);
  }catch(err){
    res.status(500).json(err.message)
  }
}
//update tasks controller
exports.updateTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, priority, dueDate, assignedTo, description } = req.body;
    const task = await tasks.findById(taskId);
    //check if there is an existing task or not
    if (!task) {
      return res.status(404).json("task not found");
    }
    //updating
    task.title = title || task.title;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.description = description || task.description;

    //saving the task
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

//delete task controler
exports.deleteTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await tasks.findById(taskId);
    //check that there is a task exist or not
    if (!task) {
      res.status(404).json("task not found");
    }
    await tasks.findByIdAndDelete(taskId);
    res.status(200).json("Task deleted succesfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

//controller to get total task count created by manager
exports.getTaskCountController=async(req,res)=>{
  try{
    const count=await tasks.countDocuments({createdBy:req.user.id});
    const todos=await tasks.countDocuments({createdBy:req.user.id,status:"todo"});
    const inProgress=await tasks.countDocuments({createdBy:req.user.id,status:"in-progress"});
    const completed=await tasks.countDocuments({createdBy:req.user.id,status:"done"});
    console.log(count,todos,inProgress,completed);
    res.status(200).json({count,todos,inProgress,completed});
  }catch(err){
    res.status(500).json(err.message);
  }
}
