const express = require("express");
const router = new express.Router();
const Ward = require("../models/Ward");
const authentication = require("../authentication/authentication");

router.post("/api/wards", authentication, async (req, res) => {
  try {
    const notValid = await Ward.find(req.body);
    if (!notValid.length) {
      const ward = new Ward(req.body);
      await ward.save();
      res.status(201).send();
    } else {
      return res.status(400).send();
    }
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/wards", authentication, async (req, res) => {
  try {
    const wards = await Ward.find({}).populate("location");
    if (!wards.length) {
      return res.status(404).send();
    }
    res.status(200).send(wards);
  } catch (error) {
    res.status(400).send();
  }
});
module.exports = router;
