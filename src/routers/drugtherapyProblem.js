const express = require("express");
const DrugTherapyProblem = require("../models/DrugTherapyProblem");
const router = new express.Router();
const authentication = require("../authentication/authentication");
router.post("/api/drugtherapyProblem", authentication, async (req, res) => {
  try {
    const drugtherapyProblem = new DrugTherapyProblem({
      pharmacist: req.user.id,
      ...req.body,
    });
    await drugtherapyProblem.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/drugtherapyProblem", authentication, async (req, res) => {
  try {
    if (req.query.startDate) {
      const drugtherapyProblems = await DrugTherapyProblem.find({
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lt: new Date(req.query.endDate),
        },
        ...req.query,
      })
        .populate("pharmacist")
        .populate("patient")
        .populate("location")
        .populate("clinic")
        .populate("unit")
        .sort({ createdAt: -1 });
      if (!drugtherapyProblems.length) {
        return res.status(404).send();
      }
      return res.status(200).send(drugtherapyProblems);
    }
    // GET DTPS WITHIN A MONTH
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
    const drugtherapyProblems = await DrugTherapyProblem.find({
      createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
      ...req.query,
    })
      .populate("pharmacist")
      .populate("patient")
      .populate("location")
      .populate("clinic")
      .populate("unit")
      .sort({ createdAt: -1 });
    if (!drugtherapyProblems.length) {
      return res.status(404).send();
    }
    return res.status(200).send(drugtherapyProblems);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
