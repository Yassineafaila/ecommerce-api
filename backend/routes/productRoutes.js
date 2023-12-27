const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/productController");
const { validateToken, validateAdmin } = require("../middleware/authHandler");
const productRouter = express.Router();
productRouter
  .route("/")
  .get(getProducts)
    .post(validateToken, validateAdmin, createProduct);
productRouter.route("/my-products").get(validateToken,validateAdmin,getAllProducts)
productRouter
  .route("/:id")
  .get(getProductById)
  .put(validateToken, validateAdmin, updateProduct)
  .delete(validateToken, validateAdmin, deleteProduct);

module.exports = productRouter;
