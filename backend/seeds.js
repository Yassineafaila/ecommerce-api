const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const productModel = require("./models/productModel");
const usersModel = require("./models/userModel");
const orderModel = require("./models/orderModel");
const users = require("./data/users");
const products = require("./data/data1");
const connectDb = require("./config/dbConnection");
const userModel = require("./models/userModel");

const importData = async () => {
  await connectDb();
  try {
    await usersModel.deleteMany();
    await orderModel.deleteMany();
    await productModel.deleteMany();

    const createUsers = await userModel.create(users);
    const adminUser = createUsers[0]._id;
    const sampleProducts = products.map((p) => {
      return { ...p, user: adminUser };
    });
    await productModel.insertMany(sampleProducts);
    console.log("Data Inserted!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDb();
  try {
    await orderModel.deleteMany();
    await productModel.deleteMany();
    await userModel.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
