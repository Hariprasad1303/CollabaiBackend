const notifications = require("../models/notificationModel")

//getNotifications controller
exports.getNotificationController=async(req,res)=>{
    //logic
    try{
      const data=await notifications.find({userId:req.user.id}).sort({createdAt:-1});
      console.log(data);
      res.status(200).json(data);  
    }catch(err){
        res.status(500).json(err)
    }
}

//markAs read controller
exports.markAsReadController=async(req,res)=>{
    const id=req.params.id;
    const updated=await notifications.findByIdAndUpdate(id,{ isRead:true},{new:true});
    res.status(200).json(updated);
}