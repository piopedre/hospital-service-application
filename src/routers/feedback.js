const express = require("express");
const router = new express.Router();
const Feedback = require("../models/Feedback");
const authentication = require("../authentication/authentication");

router.post("/api/feedback", authentication, async (req, res) => {
  try {
    const feedback = new Feedback({ ...req.body, pharmacist: req.user._id });
    await feedback.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/feedback", authentication, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      createdAt: {
        $gte: new Date(req.query.startDate),
        $lt: new Date(req.query.endDate),
      },
      ...req.query,
    })
      .sort({ createdAt: -1 })
      .populate("pharmacist");
    if (!feedback.length) {
      return res.status(404).send();
    }
    return res.status(200).send(feedback);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
