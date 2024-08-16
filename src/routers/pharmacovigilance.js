const express = require("express");
const router = new express.Router();
const Pharmacovigilance = require("./../models/Pharmacovigilance");
const authentication = require("../authentication/authentication");
const {
  pharmaAuthentication,
} = require("../authentication/roleAuthentication");
router.post("/api/pharmacovigilance", authentication, async (req, res) => {
  try {
    const pharmacovigilance = new Pharmacovigilance({
      form: req.body,
    });
    await pharmacovigilance.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get(
  "/api/pharmacovigilance",
  authentication,
  pharmaAuthentication,
  async (req, res) => {
    try {
      const pharmacovigilances = await Pharmacovigilance.find({
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lt: new Date(req.query.endDate),
        },
        ...req.query,
      }).sort({ createdAt: -1 });
      if (!pharmacovigilances.length) {
        return res.status(404).send();
      }
      return res.status(200).send(pharmacovigilances);
    } catch (error) {
      res.status(500).send();
    }
  }
);

module.exports = router;
