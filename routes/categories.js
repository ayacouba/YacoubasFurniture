const express = require("express");
const router = express.Router();
const { getAllCategories } = require("../database");

router.get("/categories", (req, res) => {
  getAllCategories((err, categories) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(categories);
    }
  });
});

module.exports = router;
