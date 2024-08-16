const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const authentication = require("../authentication/authentication");
const institutionAuthentication = require("../authentication/institutionAuthentication/institutionAuthentication");
const multer = require("multer");
const sharp = require("sharp");

router.post(
  "/api/users/registration",
  institutionAuthentication,
  async (req, res) => {
    try {
      const user = new User({ ...req.body, institution: req.institution._id });
      await user.save();
      res.status(201).send();
    } catch (e) {
      res.status(400).send();
    }
  }
);
router.post("/api/users/getUser", async (req, res) => {
  try {
    const user = await User.findOne(req.body);
    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send({ name: user.username });
  } catch (error) {
    res.status(400).send();
  }
});
// GET ALL ADMINS
router.get("/api/users", authentication, async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          { lastName: { $regex: req.query.search, $options: "i" } },
          { username: { $regex: req.query.search, $options: "i" } },
          { firstName: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(search)
      .find({
        _id: { $ne: req.user._id },
      })
      .populate("department")
      .populate("role")
      .limit(7);

    if (!users.length) {
      return res.status(404).send();
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send();
  }
});
router.get(
  "/api/users-institution",
  institutionAuthentication,
  async (req, res) => {
    const search = req.query.search
      ? {
          $or: [
            { lastName: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
            { firstName: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    try {
      const users = await User.find(search)
        .populate("department")
        .populate("role")
        .limit(7);
      if (!users.length) {
        return res.status(404).send();
      }
      res.status(200).send(users);
    } catch (error) {
      res.status(400).send();
    }
  }
);

router.post("/api/users/login", async (req, res) => {
  try {
    const user = await User.findUser(req.body);
    const token = await user.generateToken();
    res.status(200).send({
      token,
      user: {
        _id: user._id,
        username: user.username,
        admin: user.role.name === "DIRECTOR",
      },
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
// Unused Product
router.patch("/api/users/update-user", authentication, async (req, res) => {
  const allowedUpdates = ["firstName", "lastName", "username"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Update an invalid element" });
  }
  try {
    const user = await User.findById(req.user._id);
    updates.forEach(async (update) => {
      user[update] = req.body[update];
      await user.save();
    });

    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/api/users/:id", authentication, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send();
  }
});
// multer file upload
const upload = multer({
  linmits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("files must be jpg or jpeg or png"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/api/users/avatar",
  authentication,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 64, height: 64 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send();
  }
);

// router.get("/api/users/:id/avatar", async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     if (!user || !user.avatar) {
//       throw new Error("image not found");
//     }
//     res.set("Content-Type", "image/png");
//     res.send(user.avatar);
//   } catch (error) {
//     res.status(404).send();
//   }
// });
router.patch("/api/users/:id", institutionAuthentication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send();
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "username",
      "department",
      "role",
      "password",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send();
    }

    updates.forEach(async (update) => {
      user[update] = req.body[update];
      await user.save();
    });
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.patch(
  "/api/users/activate/:id",
  institutionAuthentication,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        res.status(404).send();
      }
      user.signError = 0;
      user.status = true;
      await user.save();
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
    }
  }
);
router.patch(
  "/api/users/deactivate/:id",
  institutionAuthentication,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        res.status(404).send();
      }
      user.signError = 10;
      user.status = false;
      await user.save();
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
    }
  }
);
router.get("/api/user/me", authentication, (req, res) => {
  res.send(req.user);
});
router.post("/api/user/logout", authentication, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("Admin is logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.delete(
  "/api/delete-user/:id",
  institutionAuthentication,
  async (req, res) => {
    const _id = req.params.id;

    try {
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).send();
      }
      user.remove();
      res.status(200).send();
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
