const express = require("express");
const userRouter = express.Router();
const {
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  authUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/userController");
const { validateToken, validateAdmin } = require("../middleware/authHandler");
const { validate, userRegisterValidationRules, userLoginValidationRules } = require("../middleware/validateHandler");
userRouter.route("/login").post(authUser);
userRouter.route("/logout").post(logoutUser);
userRouter
  .route("/")
  .post(userRegisterValidationRules(),validate,registerUser)
  .get(validateToken, validateAdmin, getAllUsers);
userRouter
  .route("/profile")
  .get(validateToken, getUserProfile)
  .post(validateToken, updateUserProfile);
userRouter
  .route("/:id")
  .delete(validateToken, validateAdmin, deleteUserById)
  .put(validateToken, validateAdmin, updateUserById)
  .get(validateToken, validateAdmin, getUserById);

module.exports = userRouter;
