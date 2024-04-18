const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById } = require("../database");

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

module.exports = router;
