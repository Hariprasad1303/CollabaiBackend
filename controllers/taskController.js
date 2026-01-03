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
