const express = require("express");
const Location = require("../models/Location");
const institutionAuthentication = require("../authentication/institutionAuthentication/institutionAuthentication");
const router = new express.Router();

router.post("/api/location", institutionAuthentication, async (req, res) => {
  try {
    const location = new Location({
      ...req.body,
    });
    await location.save();
    req.institution.locations = [...req.institution.locations, location._id];
    await req.institution.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});
// router.get("/api/location", async (req, res) => {
//   try {
//     const locations = await Location.find({});
//     res.status(200).send(locations);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

module.exports = router;
