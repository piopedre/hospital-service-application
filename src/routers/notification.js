const express = require("express");
const Notification = require("../models/Notification");
const router = new express.Router();
const authentication = require("../authentication/authentication");
const User = require("../models/User");
const Unit = require("../models/Unit");

// router.post("/api/notification", authentication, async (req, res) => {
//   try {
//     const notification = new Notification({
//       message: req.body.id,
//     });
//     await notification.save();
//     await notification.populate("message");
//     const sentNotification = await User.populate(notification, {
//       path: "sender",
//       select: "firstName lastName",
//     });
//     const finalNotification = await User.populate(sentNotification, {
//       path: "chat",
//       select: "name",
//     });
//     res.status(201).send(finalNotification);
//   } catch (error) {
//     res.status(400).send();
//   }
// });
router.post("/api/notification", authentication, async (req, res) => {
  let notification = null;
  try {
    if (req.body.type === "message") {
      notification = new Notification({
        ...req.body,
        receipents: req.body.receipents,
      });
    } else {
      notification = new Notification({
        ...req.body,
      });
    }
    await notification.save();
    const notificationMessage = await Notification.findById(notification._id)
      .populate("clinic")
      .populate("location")
      .populate("unit")
      .populate("chat");
    res.status(201).send(notificationMessage);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/api/notification/:id", authentication, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(401).send();
    }
    notification.read = true;
    await notification.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/notification/message", authentication, async (req, res) => {
  try {
    const notifications = await Notification.find({
      read: false,
      type: "message",
    });
    if (!notifications) {
      return res.status(401).send();
    }
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/api/notification", authentication, async (req, res) => {
  try {
    let notifications = null;
    if (!req.query.unit) {
      throw new Error("Invalid Search");
    }
    const unit = await Unit.findById(req.query.unit);
    if (unit.name === "STORE") {
      notifications = await Notification.find({
        $or: [
          {
            read: false,
            type: { $ne: "message" },
            ...req.query,
          },
          {
            read: false,
            type: "requistion",
          },
        ],
      })
        .limit(20)
        .sort({ createdAt: -1 });
    } else {
      notifications = await Notification.find({
        $and: [
          {
            read: false,
            type: { $ne: "message" },
            ...req.query,
          },
          {
            read: false,
            type: { $ne: "requistion" },
            ...req.query,
          },
        ],
      })
        .limit(20)
        .sort({ createdAt: -1 });
    }

    if (!notifications) {
      return res.status(404).send();
    }

    res.status(200).send(notifications);
  } catch (error) {
    res.status(400).send();
  }
});
module.exports = router;
