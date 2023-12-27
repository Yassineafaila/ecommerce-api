const express = require("express");
const dotenv = require("dotenv").config();
const color = require("colors");
const app = express();
const errorHandling = require("./middleware/errorHandling");
//connect to database:
const connectDb = require("./config/dbConnection");
connectDb();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//imports routes:
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter=require("./routes/orderRoutes")

const PORT = process.env.PORT || 5000;

//routes:
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders",orderRouter)

//middlewares :
 
app.use(errorHandling);

//listen on a port :
app.listen(PORT, () => {
  console.log(`The Server Is Running On The PORT ${PORT.red}`.blue.inverse);
});
