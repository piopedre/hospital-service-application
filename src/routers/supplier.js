const express = require("express");
const router = new express.Router();
const authentication = require("../authentication/authentication");
const Supplier = require("../models/Supplier");
const {
  pharmaAuthentication,
} = require("../authentication/roleAuthentication");

router.post("/api/suppliers", authentication, async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/suppliers", authentication, async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    if (!suppliers.length) {
      return res.status(404).send();
    }
    res.status(200).send(suppliers);
  } catch (error) {
    res.status(500).send();
  }
});
router.patch("/api/supplier/:id", authentication, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "contact"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send();
  }
  try {
    const id = req.params.id;
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).send();
    }
    updates.forEach((update) => (supplier[update] = req.body[update]));
    await supplier.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.delete(
  "/api/supplier/:id",
  authentication,
  pharmaAuthentication,
  async (req, res) => {
    const id = req.params.id;

    try {
      const supplier = await Supplier.findById(id);

      if (!supplier) {
        return res.status(404).send();
      }
      await supplier.remove();
      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  }
);

module.exports = router;
