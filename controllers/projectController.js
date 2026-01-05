//import models
const projects = require("../models/projectModel");
const users = require("../models/userModel");
const notifications = require("../models/notificationModel");
const projectMembers = require("../models/projectMemberModel");

//create project controller
exports.projectCreateController = async (req, res) => {
  //logic
  try {
    console.log("inside project create controller");
    console.log("Logged in user", req.user);

    //only manager is allowed to create projects
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "Only manager can create projects" });
    }

    const { name, description, priority, date } = req.body;
    //cheack all fields are filled
    if (!name || !description || !priority || !date) {
      return res.status(400).json({ message: "Please fill all forms" });
    }

    //create new project
    const newProject = new projects({
      name: name.trim(),
      description: description.trim(),
      priority: priority || "Medium",
      date,
      createdBy: req.user.id,
    });
    await newProject.save();
    res.status(200).json(newProject);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get project controller
exports.getProjectController = async (req, res) => {
  try {
    console.log("Fetching Projects for:", req.user);
    //ensurring that only mnager
    if (req.user.role !== "manager") {
      return res
        .status(403)
        .json({ message: "only managers can create their project" });
    }
    //fetch the projects created by this manager
    const project = await projects
      .find({ createdBy: req.user.id })
      .sort({ createdBy: -1 });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json(err);
  }
};

//project count controller
exports.projectCountController = async (req, res) => {
  try {
    let count;
    if (req.user.role == "manager") {
      count = await projects.countDocuments({ createdBy: req.user.id });
      res.status(200).json({ count });
    } else if (req.user.role == "admin") {
      count = await projects.countDocuments();
      res.status(200).json({ count });
    } else {
      res.status(403).json({ message: "access denied" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//project invite controller
exports.projectInviteController = async (req, res) => {
  //logic
  try {
    console.log("HEADERS:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    const { username, email, projectName } = req.body;
    console.log(username, email, projectName);

    //to check all fields are filled
    if (!username || !email || !projectName) {
      return res.status(400).json("please fill all the details");
    }

    //find the user with email and username
    const user = await users.findOne({ email, username });
    if (!user) {
      return res.status(404).json("user not Found");
    }
    console.log(user);
    console.log("USER ID:", user._id);

    //find the project owned by this manager
    const project = await projects.findOne({
      name: projectName,
      createdBy: req.user.id,
    });
    if (!project) {
      return res.status(404).json("project not found");
    }
    console.log(user);
    console.log("USER ID:", user._id);

    //check that user is invited or not
    const exists = await projectMembers.findOne({
      projectId: project._id,
      userId: user._id,
    });
    console.log(exists);
    if (exists) {
      return res.status(400).json("User Already Invited");
    }

    //membership
    const invite = await projectMembers.create({
      projectId: project._id,
      userId: user._id,
      invitedBy: req.user.id,
      status: "pending",
    });

    //notification
    const notification = await notifications.create({
      userId: user._id,
      projectId: project._id,
      inviteId: invite._id,
      message: `you are invited  to ${project.name}`,
    });
    res
      .status(200)
      .json({ message: "Invitation sent succesfully", invite, notification });
  } catch (err) {
    res.status(500).json(err);
  }
};

//project delete  controller
exports.projectDeleteController = async (req, res) => {
  //logic
  try {
    const { id } = req.params;
    const deleted = await projects.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json("project not found");
    }
    res.status(200).json("project deleted succesfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

//project update controller
exports.projectUpdateController = async (req, res) => {
  //logic
  try {
    const { id } = req.params;
    console.log(id);
    const { name, description, priority, date } = req.body;
    const updated = await projects.findByIdAndUpdate(
      id,
      { name, description, priority, date },
      { new: true }
    );
    if (!updated) {
      res.status(404).json("project Not found");
    }
    console.log(updated);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

//fetch manager Projects
exports.getMembersProjects =async (req, res) => {
  //logic
  try {
    const { projectId } = req.params;
    console.log(projectId);
    //accepted members
    const acceptedMembers =await projectMembers.find({ projectId, status: "accept" });
    console.log(acceptedMembers);
    //check there is accepted memebers or not  
    if(acceptedMembers.length===0){
      return res.status(404).json("members not found");
    }  
    console.log("Accepted members are",acceptedMembers);

    res.status(200).json(acceptedMembers);
  } catch (err) {
    res.status(500).json(err);
  }
};
