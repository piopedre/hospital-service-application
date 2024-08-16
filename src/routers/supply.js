const express = require("express");
const authentication = require("../authentication/authentication");
const {
  pharmaAuthentication,
} = require("../authentication/roleAuthentication");
const Supply = require("../models/Supply");
const router = new express.Router();

router.post("/api/supply", authentication, async (req, res) => {
  try {
    const supply = new Supply({
      ...req.body,
      pharmacist: req.user._id,
    });
    await supply.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/supply", authentication, async (req, res) => {
  try {
    if (req.query.startDate) {
      const supplies = await Supply.find({
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lt: new Date(req.query.endDate),
        },
        ...req.query,
      })
        .populate("supplier")
        .populate("pharmacist")
        .populate("location")
        .populate("unit")
        .sort({ createdAt: -1 });
      if (!supplies.length) {
        return res.status(404).send();
      }
      return res.status(200).send(supplies);
    }
    // GET SUPPLIES WITHIN A MONTH
    let startDate = null;
    let endDate = null;
    let now = new Date();
    startDate = `${now.getFullYear()}-${now.getMonth() + 1}`;
    if (now.getMonth() == 11) {
      let current = new Date(now.getFullYear() + 1, 0, 1);
      endDate = `${current.getFullYear()}-${current.getMonth() + 1}`;
    } else {
      let current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      endDate = `${current.getFullYear()}-${current.getMonth() + 1}`;
    }
    const supplies = await Supply.find({
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
      ...req.query,
    })
      .populate("supplier")
      .populate("pharmacist")
      .populate("location")
      .populate("unit")
      .sort({ createdAt: -1 });
    if (!supplies.length) {
      return res.status(404).send();
    }
    res.status(200).send(supplies);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete(
  "/api/supply/:id",
  authentication,
  pharmaAuthentication,
  async (req, res) => {
    const id = req.params.id;
    try {
      const supply = await Supply.findById(id);
      if (!supply) {
        return res.status(404).send();
      }
      await supply.remove();
      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  }
);
module.exports = router;
