const jwt = require("jsonwebtoken");

// function for generate token
async function tokenGenerate(user) {
  console.log("hi token")
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  console.log("send token")
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  
}
module.exports = { tokenGenerate };
