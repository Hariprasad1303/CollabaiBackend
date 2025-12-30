const notifications = require("../models/notificationModel")

//getNotifications controller
exports.getNotificationController=async(req,res)=>{
    //logic
    try{
      const data=await notifications.find({userId:req.user._id}).sort({createdAt:-1}).ppopulate({});
      console.log(data);
      res.status(200).json(data);  
    }catch(err){
        res.status(500).json(err)
    }
}