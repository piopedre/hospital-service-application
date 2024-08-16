const express = require("express");
const router = new express.Router();
const OutOfStock = require("../models/OutOfStock");
const authentication = require("../authentication/authentication");

router.post("/api/out-of-stock", authentication, async (req, res) => {
  try {
    const outOfStock = new OutOfStock(req.body);
    await outOfStock.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/out-of-stock", authentication, async (req, res) => {
  try {
    const outOfStocks = await OutOfStock.find({
      createdAt: {
        $gte: new Date(req.query.startDate),
        $lt: new Date(req.query.endDate),
      },
      ...req.query,
    }).sort({ createdAt: -1 });
    if (!outOfStocks.length) {
      return res.status(404).send();
    }
    return res.status(200).send(outOfStocks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/api/get-all-os", authentication, async (req, res) => {
  try {
    const outOfStocks = await OutOfStock.find({
      name: { $regex: req.query.productName, $options: "i" },
    })
      .limit(20)
      .sort({ createdAt: -1 });
    if (!outOfStocks.length) {
      return res.status(404).send();
    }
    res.status(200).send(outOfStocks);
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;
