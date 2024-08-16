const express = require("express");
const Unit = require("../models/Unit");
const Department = require("../models/Department");
const router = new express.Router();
const institutionAuthentication = require("../authentication/institutionAuthentication/institutionAuthentication");

router.post("/api/unit", institutionAuthentication, async (req, res) => {
  try {
    const unit = new Unit({
      ...req.body,
    });
    await unit.save();
    const department = await Department.findById(req.body.department);
    department.units = [...department.units, unit._id];
    await department.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.post("/api/units/department", async (req, res) => {
  const department = req.body.department;
  try {
    const units = await Unit.find({ department });
    if (!units.length) {
      return res.status(404).send();
    }
    res.status(200).send(units);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
