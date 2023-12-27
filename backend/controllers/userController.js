const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { tokenGenerate } = require("../utils/utils");
//@desc Auth user & get token
//@route POST /api/users/login
//@access Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)

  const user = await userModel.findOne({ email });
  console.log(user)
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    });
    // await tokenGenerate(user)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Invalid email or password");
  }
});

//@desc Register user & get token
//@route POST /api/users
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //check if the input are full
  
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(404);
    throw new Error("This Email already exists");
  } else {
    const user = await userModel.create({ name, email, password });
    if (user) {
      // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      //   expiresIn: "30d",
      // });
      // res.cookie("jwt", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV !== "development",
      //   sameSite: "strict",
      //   maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      // });
      await tokenGenerate(user)
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("Something went wrong while trying to create user");
    }
  }
});

//@desc Logout user/ clear cookie
//@route POST /api/users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged Out Successfully " });
});

//@desc Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  console.log("hi");
  const user = await userModel.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not found");
  }
});

//@desc Update  user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
///admin routes:
//@desc Get All Users
//@route GET /api/users/
//@access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find({});
  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error("Users not found");
  }
});

//@desc Get User By Id
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User information not found");
  }
});

//@desc Delete User
//@route Delete /api/users/:id
//@access Private/Admin
const deleteUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (user) {
    const { deletedCount } = await userModel.deleteOne({ _id: id });
    if (deletedCount == 1) {
      res.status(200).json({ message: "deleted successfully" });
    } else {
      res.status(500);
      throw new Error("something went wrong while deleting");
    }
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
//@desc update User By Id
//@route PUT /api/users/:id
//@access Private/Admin
const updateUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

module.exports = {
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  authUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};
