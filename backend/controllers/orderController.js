const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");
//@desc Get My Orders
//@route GET /api/orders/my-orders
//@access private

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.status(200).json(orders);
});
//@desc Get Order By Id
//@route GET /api/orders/:id
//@access private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email");

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc Add Order Items
//@route POST /api/orders
//@access private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length == 0) {
    res.status(400);
    throw new Error("No Order Items Found");
  } else {
    const order = new orderModel({
      orderItems: orderItems.map((order) => ({
        ...order,
        product: order._id,
        _id: undefined,
      })),
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      paymentResult: paymentResult,
      itemsPrice: itemsPrice,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
    });
    const createOrder = order.save();
    res.status(201).json(createOrder);
  }
});

//@desc Paid Orders
//@route PUT /api/orders/:id/pay
//@access private

const payOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc Get All Orders
//@route GET /api/orders
//@access private/admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find({});
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("Orders Not Found");
  }
});

//@desc Update Orders To Be Delivered
//@route PUT /api/orders/:id/admin
//@access private/admin
const deliveredOrders = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await orderModel.findById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});
module.exports = {
  getMyOrders,
  getOrderById,
  getAllOrders,
  deliveredOrders,
  payOrder,
  addOrderItems,
};
