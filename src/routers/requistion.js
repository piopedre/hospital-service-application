const express = require("express");
const authentication = require("../authentication/authentication");
const Requistion = require("../models/Requistion");
const router = new express.Router();

router.post("/api/requistion", authentication, async (req, res) => {
  const requistion = new Requistion({
    ...req.body,
    requistingPharmacist: req.user._id,
  });
  try {
    await requistion.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});
router.get("/api/last-requistion", authentication, async (req, res) => {
  try {
    const requistion = await Requistion.find({
      ...req.query,
    });
    if (!requistion.length) {
      return res.status(404).send();
    }
    res.status(200).send(requistion.splice(-1));
  } catch (error) {
    res.status(500).send();
  }
});

//  GET REQUEST
router.get("/api/requistion", authentication, async (req, res) => {
  Object.keys(req.query).forEach((key) => {
    if (req.query[key] === "All") {
      delete req.query[key];
    }
  });
  try {
    if (req.query.startDate) {
      const requistions = await Requistion.find({
        createdAt: {
          $gte: new Date(req.query.startDate),
          $lt: new Date(req.query.endDate),
        },
        ...req.query,
      })
        .populate("requistingPharmacist")
        .populate("location")
        .populate("unit")
        .populate("clinic")
        .sort({ createdAt: -1 });

      if (!requistions.length) {
        return res.status(404).send();
      }
      return res.status(200).send(requistions);
    }
    // GET REQUISTION WITHIN A MONTH
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
    const requistions = await Requistion.find({
      createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
      ...req.query,
    })
      .populate("requistingPharmacist")
      .populate("location")
      .populate("unit")
      .populate("clinic")
      .sort({ createdAt: -1 });

    if (!requistions.length) {
      return res.status(404).send();
    }
    res.status(200).send(requistions);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/api/requistion/:id", authentication, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "products",
      "issuance",
      "costOfRequistion",
      "numberOfProducts",
      "reception",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send();
    }
    const requistion = await Requistion.findById(id);
    if (!requistion) {
      return res.status(404).send();
    }
    updates.forEach((update) => (requistion[update] = req.body[update]));
    await requistion.save();
    const mainRequistion = await Requistion.findById(requistion._id)
      .populate("location")
      .populate("unit")
      .populate("clinic");
    res.status(200).send(mainRequistion);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
