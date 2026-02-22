const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const fs = require("fs/promises");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

/* -------------------------- creating new products ------------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/products");
  },
  filename: (req, file, cb) => {
    const timeStamp = Date.now();
    const originalName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g);
    cb(null, `${timeStamp}-${originalName}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowFiles = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
  if (allowFiles.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpg,jpeg,png and gif are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limit: {
    fileSize: 2 * 1024 * 1024,
  },
});
router.post(
  "/",
  authMiddleware,
  checkRole("seller"),
  upload.array("images", 8),
  async (req, res) => {
    const { title, description, category, price, stock } = req.body;
    const images = req.files.map((image) => image.filename);
    console.log(req.user);
    if (images.length === 0) {
      return res
        .status(400)
        .json({ message: "Images feild can not be empty!" });
    }
    const newProduct = new Product({
      title,
      description,
      seller: req.user._id,
      category,
      price,
      stock,
      images,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  },
);

/* ------------------------ getting all the products ------------------------ */
router.get("/", async (req, res) => {
  //pagination the product
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 8;

  // search by query

  const queryCategory = req.query.category || null;
  const querySearch = req.query.search || null;
  const query = {}
  if (queryCategory) {
    const category = await Category.findOne({ name: queryCategory });
    if (!category) {
      return res.status(404).json({message:"Category Not found!!!"})
    }
    query.category = category._id;
  }
  if (querySearch) {
    query.title = { $regex: querySearch, $options: "i" };
}

  const products = await Product.find(query)
    .select("-category -description -__v -seller")
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();
  const updatedProducts = products.map((product) => {
    const totalReviews = product.reviews.length;
    const sumOfRating = product.reviews.reduce(
      (accum, curELm) => accum + curELm.rating,
      0,
    );
    const averageRating = sumOfRating / (totalReviews || 1);
    return {
      ...product,
      images: product.images[0],
      reviews: { totalReviews, averageRating },
    };
  });
  const totalProducts = await Product.countDocuments();
  const totalPage = Math.ceil(totalProducts / perPage);
  return res.json({
    Products: updatedProducts,
    currentPage: page,
    totalPage,
    totalProducts,
    postPerPage: perPage
  });
});

/* --------------------------- seach product by id -------------------------- */

router.get("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId).populate("seller", "_id username email").populate("reviews.user", "_id username email").select("-seller -__v");
  if (!product) {
    return res.status(404).json({ message: "Product not found!!!" })
  }
  res.json(product);
});

router.delete("/:productId",authMiddleware,async(req,res)=>{
  const productId = req.params.productId;
  const product = await Product.findById(productId)
    if (!product) {
    return res.status(404).json({ message: "Product not found!!!" })
  }
  if (req.user.role === "admin" || req.user._id.toString() === product.seller.toString()) {
    await product.deleteOne();
    //also we need to delete the products images from the local server
    product.images.forEach(async(element) => {
      const fullpath = path.join(__dirname, "/upload/products", element);
      await fs.unlink(fullpath);
    })
    return res.status(200).json({ message: "Product deleted successfully!!!" });
  }
    res.status(403).json({message:"Access denied. Admin or seller only"})
})

module.exports = router;
