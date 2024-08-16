const express = require("express");
const router = new express.Router();
const Receipt = require("../models/Receipt");
const authentication = require("../authentication/authentication");

router.post("/api/receipts", authentication, async (req, res) => {
  try {
    const receipt = new Receipt(req.body);
    await receipt.save();
    res.status(201).send(receipt);
  } catch (error) {
    res.status(400).send();
  }
});
module.exports = router;
