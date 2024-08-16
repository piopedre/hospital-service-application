const express = require("express");
const router = new express.Router();
const authentication = require("../authentication/authentication");
const ProductCategory = require("../models/ProductCategory");
const Product = require("../models/Product");

router.post(
  "/api/product/new-category",
  authentication,
  async (req, res) => {
    try {
      const category = new ProductCategory(req.body);
      await category.save();
      res.status(201).send();
    } catch (e) {
      res.status(400).send();
    }
  }
  // work on roleAuthenication
);
router.get("/api/product/categories", authentication, async (req, res) => {
  try {
    const categories = await ProductCategory.find({});
    if (!categories.length) {
      return res.status(404).send();
    }
    res.status(200).send(categories);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch(
  "/api/product/categories/:id",
  authentication,
  async (req, res) => {
    try {
      const _id = req.params.id;
      const category = await ProductCategory.findOne({ _id });
      if (!category) {
        return res.status(404).send();
      }
      category.category = req.body.category;
      await category.save();
      res.status(200).send(category);
    } catch (error) {
      res.status(500).send();
    }
  }
);
router.delete(
  "/api/product/categories/:id",
  authentication,
  async (req, res) => {
    try {
      const _id = req.params.id;
      const category = await ProductCategory.findOne({ _id });
      if (!category) {
        return res.status(404).send();
      }
      const product = await Product.findOne({ productCategory: category._id });
      if (product) {
        return res.status(403).send();
      }
      await category.remove();
      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  }
);
module.exports = router;
