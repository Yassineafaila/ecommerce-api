const express = require("express");
const { validateToken, validateAdmin } = require("../middleware/authHandler");
const {
  getMyOrders,
  getOrderById,
  getAllOrders,
  deliveredOrders,
  payOrder,
  addOrderItems,
} = require("../controllers/orderController");
const orderRouter = express.Router();
orderRouter
  .route("/")
  .get(validateToken, validateAdmin, getAllOrders)
  .post(validateToken, addOrderItems);

orderRouter.route("/my-orders").get(validateToken, getMyOrders);
orderRouter.route("/:id").get(validateToken, getOrderById);
orderRouter.route("/:id/pay").put(validateToken, payOrder);
orderRouter
  .route("/:id/deliver")
  .put(validateToken, validateAdmin, deliveredOrders);
module.exports = orderRouter;
