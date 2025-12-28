//import project model
const projects = require("../models/projectModel");

exports.projectCreateController = async(req, res) => {
  //logic
  try{
    console.log("inside project create controller")
    console.log("Logged in user",req.user);

    //only manager is allowed to create projects
    if(req.user.role!=="manager"){
      return res.status(403).json({message:"Only manager can create projects"});
    }

    const {name,description,priority,date}=req.body;
    //cheack all fields are filled
    if(!name ||!description ||!priority||!date){
     return  res.status(400).json({message:"Please fill all forms"});
    }

    //create new project  
    const newProject=new projects({
      name:name.trim(),
      description:description.trim(),
      priority:priority||"Medium",
      date,
      createdBy:req.user.id,
    })
    await  newProject.save();
    res.status(200).json(newProject);

  }catch(err){
    res.status(500).json(err);
  }
  
};

exports.getProjectController=async(req,res)=>{
  try{
    console.log("Fetching Projects for:",req.user);
     //ensurring that only mnager  
    if(req.user.role !=="manager"){
      return res.status(403).json({message:"only managers can create their project"})
    }
    //fetch the projects created by this manager
    const project=await projects.find({createdBy:req.user.id}).sort({createdBy:-1});
    res.status(200).json(project)

  }catch(err){
    res.status(500).json(err)
  }

}

