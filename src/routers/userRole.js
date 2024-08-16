const express = require("express");
const router = new express.Router();
const UserRole = require("../models/UserRole");
const institutionAuthentication = require("../authentication/institutionAuthentication/institutionAuthentication");

router.post("/api/user-role", institutionAuthentication, async (req, res) => {
  try {
    const userRole = new UserRole({
      ...req.body,
    });
    await userRole.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/user-role", institutionAuthentication, async (req, res) => {
  try {
    const userRoles = await UserRole.find();
    if (!userRoles.length) {
      return res.status(404).send();
    }
    res.status(200).send(userRoles);
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;
