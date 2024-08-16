const express = require("express");
const authentication = require("../authentication/authentication");
const Transfer = require("../models/Transfer");
const router = new express.Router();

router.post("/api/transfer", authentication, async (req, res) => {
  try {
    const transfer = new Transfer({
      ...req.body,
      pharmacist: req.user._id,
    });
    await transfer.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/transfer", authentication, async (req, res) => {
  try {
    const transfers = await Transfer.find({
      ...req.query,
      received: false,
    })
      .populate("pharmacist")
      .populate("location")
      .populate("unit")
      .populate("clinic")
      .sort({ createdAt: -1 });
    if (!transfers.length) {
      return res.status(404).send();
    }
    res.status(200).send(transfers);
  } catch (error) {
    res.status(500).send();
  }
});
router.patch("/api/transfer/:id", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const transfer = await Transfer.findById(id);
    if (!transfer) {
      return res.status(404).send();
    }
    transfer.received = true;
    await transfer.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/transfers", authentication, async (req, res) => {
  try {
    const transfers = await Transfer.find({
      ...req.query,
      createdAt: {
        $gte: new Date(req.query.startDate),
        $lt: new Date(req.query.endDate),
      },
      received: true,
    })
      .populate("pharmacist")
      .populate("location")
      .populate("unit")
      .populate("clinic")
      .sort({ createdAt: -1 });
    if (!transfers.length) {
      return res.status(404).send();
    }
    res.status(200).send(transfers);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
