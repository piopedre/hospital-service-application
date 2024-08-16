const express = require("express");
const authentication = require("../authentication/authentication");
const ProductSale = require("../models/ProductSale");
const Product = require("../models/Product");
const Unit = require("../models/Unit");
const {
  pharmaAuthentication,
} = require("../authentication/roleAuthentication");
const router = new express.Router();

router.post("/api/productsales", authentication, async (req, res) => {
  const productSale = new ProductSale({
    ...req.body,
    assessment: req.user._id,
  });
  try {
    await productSale.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/api/productsales/search", authentication, async (req, res) => {
  const search = req.query;
  const parameters = Object.keys(search);

  parameters.forEach((parameter) => {
    if (search[parameter] === "All" || !search[parameter]) {
      delete search[parameter];
    }
  });

  const startDate = new Date(search.start_date);
  const endDate = new Date(search.end_date);

  try {
    const sales = await ProductSale.find({
      createdAt: { $gte: startDate, $lt: endDate },
      ...search,
    })
      .populate("assessment")
      .populate("patient")
      .populate("location")
      .populate("unit")
      .populate("ward")
      .sort({ createdAt: -1 });

    if (!sales.length) {
      return res.status(404).send();
    }
    res.status(200).send(sales);
  } catch (e) {
    res.status(400).send();
  }
});
router.post("/api/sales-reorderlevel", authentication, async (req, res) => {
  if (!req.body.type) {
    return res.status(400).send();
  } else {
    if (req.body.type === "store") {
      try {
        const sales = await ProductSale.find({
          createdAt: { $gte: new Date(req.body.date) },
        }).sort({ createdAt: -1 });
        if (!sales.length) {
          return res.status(404).send();
        }
        const products = sales
          .flatMap((sale) => sale.products)
          .reduce((acc, cur) => {
            const duplicate = acc.find((product) => product.name === cur.name);
            if (duplicate) {
              const index = acc.findIndex(
                (product) => product.name === cur.name
              );
              duplicate.quantity = duplicate.quantity + cur.quantity;
              acc.splice(index, 1, duplicate);
            } else {
              const data = {
                name: cur.name,
                quantity: cur.quantity,
                packSize: cur.packSize,
              };
              acc.push(data);
            }
            return acc;
          }, []);

        products.forEach(async (product) => {
          const storeLocation = await Unit.findOne({ name: "STORE" });
          // for Store
          await Product.updateOne(
            { name: product.name, unit: { $eq: storeLocation._id } },
            {
              minimumQuantity: Math.ceil(product.quantity / product.packSize),
            }
          );
        });

        res.status(200).send();
      } catch (error) {
        res.status(400).send();
      }
    } else if (req.body.type === "otherUnits") {
      try {
        const sales = await ProductSale.find({
          createdAt: { $gte: new Date(req.body.date) },
          ...req.body,
        }).sort({ createdAt: -1 });
        if (!sales.length) {
          return res.status(404).send();
        }
        const products = Object.entries(
          sales
            .flatMap((sale) => sale.products)
            .reduce((acc, cur) => {
              acc[cur.name]
                ? (acc[cur.name] += +cur.quantity)
                : (acc[cur.name] = cur.quantity);
              return acc;
            }, {})
        ).map(([key, value]) => {
          return {
            name: key,
            quantity: value,
          };
        });

        products.forEach(async (product) => {
          // check for store and other units  products
          await Product.updateOne(
            {
              name: product.name,
              unit: req.body.unit,
              location: req.body.location,
              clinic: req.body.clinic,
            },
            { minimumQuantity: Math.ceil(product.quantity / 4) }
          );
        });
        res.status(200).send();
      } catch (error) {
        res.status(400).send();
      }
    }
  }
});

router.patch("/api/productsales/:id", authentication, async (req, res) => {
  const _id = req.params.id;

  try {
    if (!req.body.receipt) {
      return res.status(400).send();
    }
    const sale = await ProductSale.findOne({ _id });
    if (!sale) {
      return res.status(404).send();
    }
    sale.receipt = req.body.receipt;
    await sale.save();
    res.status(200).send(sale);
  } catch (e) {
    res.status(500).send();
  }
});
router.delete(
  "/api/productsales/:id",
  authentication,
  pharmaAuthentication,
  async (req, res) => {
    const _id = req.params.id;

    try {
      const sale = await ProductSale.findOne({ _id });
      if (!sale) {
        return res.status(404).send();
      }
      sale.remove();
      res.status(200).send(sale);
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
