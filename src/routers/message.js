const authentication = require("../authentication/authentication");
const Message = require("../models/Message");
const User = require("../models/User");
const express = require("express");

const router = new express.Router();

// GET ALL MESSAGES BY CHAT ID
router.get("/api/messages/:id", authentication, async (req, res) => {
  try {
    const chat = req.params.id;
    const messages = await Message.find({ chat })
      .populate("sender")
      .populate("chat");

    if (!messages.length) {
      return res.status(404).send();
    }

    res.status(200).send(messages);
  } catch (error) {
    res.status(400).send();
  }
});

// POST

router.post("/api/message", authentication, async (req, res) => {
  try {
    if (!req.body.content || !req.body.chat) {
      return res.status(400).send();
    }
    let message = new Message({
      sender: req.user._id,
      content: req.body.content,
      chat: req.body.chat,
    });
    await message.save();
    message = await message.populate("chat");
    message = await message.populate("sender");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName",
    });
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
