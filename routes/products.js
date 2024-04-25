const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  updateProduct,
  bulkUploadProducts,
} = require("../database");

const upload = multer({ dest: "uploads/" });

router.post("/products/bulk-upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please upload a file." });
  }

  bulkUploadProducts(req.file.path, (error, results) => {
    if (error) {
      console.error("Error bulk uploading products:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Bulk upload successful", data: results });
  });
});

router.get("/products", (req, res) => {
  getAllProducts((err, products) => {
    console.log("Fetching products:", products);
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(products);
    }
  });
});

router.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  getProductById(productId, (err, product) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  });
});

router.get("/category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  getProductsByCategoryId(categoryId, (err, products) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(products);
    }
  });
});

router.post("/products/:id/update", (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  updateProduct(id, productData, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json({ message: "Product updated successfully", result });
    }
  });
});
module.exports = router;
