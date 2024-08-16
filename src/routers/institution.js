const express = require("express");
const Institution = require("../models/Institution");
const institutionAuthentication = require("../authentication/institutionAuthentication/institutionAuthentication");
const router = new express.Router();

router.post("/api/institution", async (req, res) => {
  try {
    const invalid = await Institution.find({});
    if (invalid.length) {
      return res.status(400).send();
    }
    const institution = new Institution({
      ...req.body,
    });
    await institution.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.post("/api/institution-locations", async (req, res) => {
  const department = req.body.department;
  try {
    const institution = await Institution.findOne({
      departments: { $elemMatch: { $eq: department } },
    }).populate("locations");
    if (!institution) {
      return res.status(404).send();
    }
    res.status(200).send({
      locations: institution.locations,
      institution: { name: institution.name, username: institution.username },
    });
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/institution", institutionAuthentication, async (req, res) => {
  try {
    const institution = await Institution.findById(req.institution._id)
      .populate("locations")
      .populate("departments");

    res.status(200).send(institution);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/api/institution/login", async (req, res) => {
  try {
    const institution = await Institution.findInstitution(req.body);
    const { token, name } = await institution.generateToken();

    res.status(200).send({ name, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post(
  "/api/institution/logout",
  institutionAuthentication,
  async (req, res) => {
    try {
      req.institution.tokens = [];
      await req.institution.save();
      res.status(200).send("institution is logout");
    } catch (error) {
      res.status(500).send();
    }
  }
);

module.exports = router;
