const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([{ id: 1, name: "John Doe", email: "john@example.com" }]);
});

router.get("/:id", (req, res) => {
  res.json({ id: req.params.id, name: "John Doe", email: "john@exmaple.com" });
});

module.exports = router;
