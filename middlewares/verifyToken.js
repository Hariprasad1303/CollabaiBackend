//import jwt
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    console.log("Verify Token middleware");
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    //verify AuthHeader
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorized tokken missing" });
    }

    //extract token
    const token = authHeader.split(" ")[1];
    console.log(token);

    //verify token
    const jwtResponse = jwt.verify(token, process.env.secretKey);
    console.log(jwtResponse);

    //verifies any invalid token payload or not
    if (!jwtResponse || !jwtResponse.id) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    //attach the user with request
    req.user = {
      id: jwtResponse.id,
      username:jwtResponse.username,
      email: jwtResponse.email,
      role: jwtResponse.role,
    };
    // proceeds to verifyManager
    next();
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.status(400).json({ message: "Token Expired" });
    }
    return res.status(401).json(err);
  }
};
module.exports = verifyToken;
