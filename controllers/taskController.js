//import tasks model
const tasks = require("../models/tasksModel");

//create task controller by manager
exports.createTaskController = async (req, res) => {
  //logic
  try {
    const { title, description, priority, projectId, assignedTo, dueDate } =
      req.body;
    console.log(title, description,projectId, assignedTo, dueDate);
    if (!title || !projectId || !assignedTo) {
      return res.status(400).json("Missing required fields");
    }
    const newTask = new tasks({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      createdBy: req.user.id,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json(err);
  }
};


// fetch tasks controller
exports.fetchTaskController=async(req,res)=>{
    //logic
    try{
      const {projectId}=req.params;
      console.log(projectId);
      const task=await tasks.find({projectId});
      res.status(200).json(task);  

    }catch(err){
        res.status(500).json(err)
    }
}

//update tasks controller
exports.updateTaskController=async(req,res)=>{
 try{
    const {taskId}=req.params;
    const {title,priority,dueDate,assignedTo,description}=req.body;
    const task=await tasks.findById(taskId);
    //check if there is an existing task or not
    if(!task){
        return res.status(404).json("task not found");
    }
    //updating
    task.title=title||task.title
    task.priority=priority||task.priority
    task.dueDate=dueDate||task.dueDate
    task.assignedTo=assignedTo||task.assignedTo
    task.description=description||task.description

    //saving the task
   await task.save();
   res.status(200).json(task); 

 }catch(err){
    res.status(500).json(err);
 }   
}


//delete task controler
exports.deleteTaskController=async(req,res)=>{
  try{
    const {taskId}=req.params;
    const task=await tasks.findById(taskId);
    //check that there is a task exist or not
    if(!task){
      res.status(404).json("task not found")
    }
    await tasks.findByIdAndDelete(taskId);
    res.status(200).json("Task deleted succesfully");

  }catch(err){
    res.status(500).json(err)
  }
}