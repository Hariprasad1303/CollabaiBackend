//import projectMembers model
const projectMembers = require("../models/projectMemberModel");

//import projects
const projects = require("../models/projectModel");

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
    const userId=req.user.id;
    //find the accepted memberships
    const memberships=await projectMembers.find({userId,status:"accept"}).populate("projectId");
    console.log(memberships);

    //extract only projectdata
    const employeeProjects=await memberships.map(m=>m.projectId);
    res.status(200).json(employeeProjects);

  } catch (err) {
    res.status(500).json(err);
  }
};
