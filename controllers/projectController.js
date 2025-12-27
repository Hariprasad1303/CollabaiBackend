//import project model
const projects = require("../models/projectModel");

exports.projectCreateController = async(req, res) => {
  //logic
  try{
    console.log("inside project create controller")
    console.log("Logged in user",req.user);

    //only manager is allowed to create projects
    if(req.user.role!=="manager"){
      res.status(403).json({message:"Only manager can create projects"});
    }

    const {name,description,priority,date}=req.body;
    //cheack all fields are filled
    if(!name ||!description ||!priority||!date){
      res.status(400).json({message:"Please fill all forms"});
    }

    //create new project  
    const newProject=new projects({
      name:name.trim(),
      description:description.trim(),
      priority:priority||"Medium",
      date,
      createdBy:req.user.id
    })
    await  newProject.save();
    res.status(200).json(newProject);

  }catch(err){
    json.status(500).json(err);
  }
  
};
