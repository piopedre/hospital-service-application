const express = require("express");
const ProductLog = require("../models/ProductLog");
const authentication = require("../authentication/authentication");
const router = new express.Router();

router.post("/api/productlogs", authentication, async (req, res) => {
  const productlog = new ProductLog({
    ...req.body,
    signature: req.user._id,
  });
  try {
    await productlog.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get(
  "/api/productlogsbyproduct/:id",
  authentication,
  async (req, res) => {
    const product = req.params.id;
    try {
      const productLog = await ProductLog.find({ product })
        .populate("signature")
        .sort({ createdAt: -1 })
        .limit(20)
        .skip(req.query.skip);

      if (!productLog.length) {
        return res.status(404).send();
      }
      const isFinished = productLog.length < 20;
      res.status(200).send({ productLog, isFinished });
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
