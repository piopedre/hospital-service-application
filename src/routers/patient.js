const express = require("express");
const router = new express.Router();
const Patient = require("../models/Patient");
const authentication = require("../authentication/authentication");

router.post("/api/patients", authentication, async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/api/update-patient/:id", authentication, async (req, res) => {
  const id = req.params.id;

  try {
    const patient = await Patient.findById(id);
    if (!req.body.totalPrice) {
      throw {
        message: "can't update Balance",
      };
    }
    const newBalance = patient.balance - req.body.totalPrice;
    patient.balance = newBalance;
    await patient.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.patch(
  "/api/update-patient-balance/:id",
  authentication,
  async (req, res) => {
    const id = req.params.id;
    try {
      const patient = await Patient.findById(id);
      if (!req.body.amount) {
        throw {
          message: "can't update Balance",
        };
      }
      patient.balance += +req.body.amount;
      await patient.save();
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
    }
  }
);
router.get("/api/patients", authentication, async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          { lastName: { $regex: req.query.search, $options: "i" } },
          { fileNumber: { $regex: req.query.search, $options: "i" } },
          { firstName: { $regex: req.query.search, $options: "i" } },
          { otherName: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const patients = await Patient.find(search)
      .limit(40)
      .sort({ fileNumber: -1 });
    if (!patients.length) {
      throw new Error("no patients found");
    }
    res.status(200).send(patients);
  } catch (error) {
    res.status(404).send();
  }
});
module.exports = router;
