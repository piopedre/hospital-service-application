const express = require("express");
const Department = require("../models/Department");
const router = new express.Router();
const institutionAuthentication = require("../authentication/institutionAuthentication/institutionAuthentication");

router.post("/api/department", institutionAuthentication, async (req, res) => {
  try {
    const department = new Department({
      ...req.body,
    });
    await department.save();
    req.institution.departments = [
      ...req.institution.departments,
      department._id,
    ];
    await req.institution.save();
    res.status(201).send(department);
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/department", async (req, res) => {
  try {
    const departments = await Department.find({});
    if (!departments.length) {
      return res.status(404).send();
    }
    res.status(200).send(departments);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/api/get-clinics", async (req, res) => {
  try {
    const department = await Department.findOne({
      name: { $regex: req.body.$clinic, $options: "i" },
    }).populate("units");
    if (!department) {
      return res.status(404).send();
    }
    res.status(200).send(department.units);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
