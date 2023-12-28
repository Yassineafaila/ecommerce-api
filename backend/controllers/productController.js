const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
////@desc fetch all products
//@route GET/api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({});
  if (!products) {
    res.status(404);
    throw new Error("Data Not Found");
  }
  res.status(200).json(products);
});

//@desc fetch products for the admin
//@route GET /api/products/myProducts
//@access Private/Admin

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productModel.find({ admin: req.user._id })
  if (!products) {
    res.status(404)
    throw new Error("Data Not Found")
  }
  res.status(200).json(products)
})
//@desc fetch a product
//@route GET/api/product/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const singleProduct = await productModel.findById({ _id: id });
  if (!singleProduct) {
    res.status(404);
    throw new Error("Data Not Found");
  }
  res.status(200).json(singleProduct);
});

//@desc Create a products
//@route POST /api/product
//@access private/admin

const createProduct = asyncHandler(async (req, res) => {
   const {filename:imageFilename}=req.file
   console.log(imageFilename)
  const {
    name,    
    description,
    brand,
    category,
    price,
    countInStock,
    rating,
    numReviews,
  } = req.body;
  
  const newProduct = new productModel({
    admin: req.user._id,
    name,
    image:imageFilename,
    description,
    brand,
    category,
    price,
    countInStock,
    rating,
    numReviews,
  })
  

  const createProduct = await newProduct.save();
  res.status(201).json(createProduct);
});

//@desc update a product
//@route POST /api/product/:id
//@access private/admin

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const {
    name,
    image,
    description,
    brand,
    category,
    price,
    countInStock,
    rating,
    numReviews,
  } = req.body;
  const updateProduct = await productModel.findByIdAndUpdate(id, {
    name,
    image,
    description,
    brand,
    category,
    price,
    countInStock,
    rating,
    numReviews,
  });
  if (updateProduct) {
    res.status(200).json({ message: "updated successfully" });
  } else {
    res.status(500);
    throw new Error("Something Went Wrong When Trying To Update");
  }
});

//@desc delete a product
//@route DELETE /api/product/:id
//@access private/admin

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id
  const removedProduct = await productModel.findByIdAndDelete(id)
  if (removedProduct) {
    res.status(200).json({message:"product deleted successfully"})
  } else {
    res.status(500)
    throw new Error("Something Went Wrong When Trying To Delete")
  }
});
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
