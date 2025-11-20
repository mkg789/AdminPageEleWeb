const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// READ ALL
router.get("/", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// UPDATE
router.put("/:id", auth, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
