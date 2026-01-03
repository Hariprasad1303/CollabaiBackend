//import mongoose
const mongoose = require("mongoose");

//creatre an task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "projects",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  dueDate:{
    type:Date
  }
},{timestamps:true});

const tasks=mongoose.model("tasks",taskSchema);
module.exports=tasks;
