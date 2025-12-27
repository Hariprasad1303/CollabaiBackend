const verifyManager = (req,res,next) => {
  try {
    //check wheather user exist or not
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    //check the role is manager or employee
    if (!req.user.role.toLowerCase == "manager") {
      return res
        .status(403)
        .json({ message: "Access denied.Only manger can perform this action" });
    }

    //proceed to controller
    next();
  } catch (err) {
    console.error("verifyManager error:",err);
    return res.status(500).json({message:"Authorization error"}); 
 }
};
module.exports=verifyManager;
