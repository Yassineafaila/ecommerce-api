const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel")
// validate the token
const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  token = req.headers.cookie; // get the token from the headers

  if (token) {
    token = token.split("=")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized ,token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized , no token");
  }
});

const validateAdmin = (req, res, next) => {
     if (req.user && req.user.isAdmin) {
       next();
     } else {
       res.status(401);
       throw new Error("Not authorized as admin");
     }
}
module.exports = { validateToken ,validateAdmin};
