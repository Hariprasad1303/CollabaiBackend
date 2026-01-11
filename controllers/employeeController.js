//import projectMembers model
const projectMembers = require("../models/projectMemberModel");

//import projects
const projects = require("../models/projectModel");
const tasks = require("../models/tasksModel");
const { translateAliases } = require("../models/userModel");

//employee invite accept controller
exports.employeeInviteAcceptController = async (req, res) => {
  //logic
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    //step 1 find the invite
    const invite = await projectMembers.findById(inviteId);
    if (!invite) {
      return res.status(404).json("user not found");
    }
    console.log(invite);

    //invite security
    if (invite.userId.toString() !== userId) {
      return res.status(403).json("unauthorised");
    }

    //invitation handle
    if (invite.status !== "pending") {
      return res.status(400).json("invitation already processed");
    }

    //accept invite
    invite.status = "accept";
    await invite.save();
    res.status(200).json(invite);
  } catch (err) {
    res.status(500).json(err);
  }
};

//employee reject invite controller
exports.employeeInviteRejectController = async (req, res) => {
  //logic
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;
    //find the invite
    const invite = await projectMembers.findById(inviteId);
    if (!invite) {
      return res.status(404).json("Invitation not found");
    }

    //invitation security
    if (invite.userId.toString !== userId) {
      return res.status(403).json("Unauthorised");
    }

    //handle invite
    if (invite.status !== "pending") {
      return res.status(400).json("Invitation already processed");
    }

    //reject invite
    invite.status == "reject";
    await invite.save();
  } catch (err) {
    res.status(500).json(err);
  }
};

//get the project particularly assigned to the employee
exports.employeeGetProjectsController = async (req, res) => {
  try {
    const userId = req.user.id;
    //find the accepted memberships
    const memberships = await projectMembers
      .find({ userId, status: "accept" })
      .populate("projectId");
    console.log(memberships);

    //extract only projectdata
    const employeeProjects = await memberships.map((m) => m.projectId);
    res.status(200).json(employeeProjects);
  } catch (err) {
    res.status(500).json(err);
  }
};

// employee task status update controller
exports.employeeTastUpdateController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    //allowed status
    const allowedStatus = ["todo", "in-progress", "done"];

    //check it is an allowed status or not
    if (!allowedStatus.includes(status)) {
      return res.status(404).json("Invalid Status Value");
    }
    //find task
    const task = await tasks.findById(taskId);
    //check the task exists or not
    if (!task) {
      return res.status(404).json("Task not Found");
    }
    console.log(task);
    //check ownership
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json("You can only update yopur own tasks");
    }
    //saving the task
    task.status = status;
    await task.save();
  } catch (err) {
    res.status(500).json(err);
  }
};

//employee task count controller
exports.employeeTaskskCountController = async (req, res) => {
  try {
    const employeeId = req.user.id;
    //find the no of tasks the employee is  assigned
    const count = await tasks.countDocuments({ assignedTo: employeeId });
    //find the no of task of employee is in todo status
    const todos = await tasks.countDocuments({
      assignedTo: employeeId,
      status: "todo",
    });
    //find the no of task of employee is in in-progress status
    const inProgress = await tasks.countDocuments({
      assignedTo: employeeId,
      status: "in-progress",
    });
    //find the no of task of employee is in completed status
    const completed = await tasks.countDocuments({
      assignedTo: employeeId,
      status: "done",
    });
    //find the no of project the employee is assigned till now
    const projectCount = await projectMembers.countDocuments({
      userId: employeeId,
    });
    console.log(count, todos, inProgress, completed, projectCount);
    res.status(200).json({ count, todos, inProgress, completed, projectCount });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getMyTeamMembersController = async (req, res) => {
  try {
    //the one who iniating the request
    const employeeId = req.user.id;

    //find the projects employee working in
    const employeeProjects = await projectMembers
      .find({
        userId: employeeId,
        status: "accept",
      })
      .select("projectId");
    console.log(employeeProjects);

    //extracting the projectIds
    const projectIds = employeeProjects.map((m) => m.projectId);
    console.log(projectIds);

    //find the team members
    const teamMembers = await projectMembers
      .find({
        projectId: { $in: projectIds },
        status: "accept",
        userId:{$ne:employeeId}
      })
      .populate("userId", "username email role")
      .populate("projectId", "name date");
    console.log(teamMembers);

    //remove duplicates beacuse a person xcan work in multiple projects
    const unique = new Map();
    teamMembers.forEach((m) => {
      const userId = m.userId._id.toString();
      console.log(userId);
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
        dueDate: m.projectId.date,
      });
    });
    //team mebers of the employee
    const members = [...unique.values()];
    console.log(members);

    //total members
    const totalMembers = members.length;
    console.log(totalMembers);

    res.status(200).json({ members, totalMembers });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
