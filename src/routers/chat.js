const express = require("express");
const Chat = require("../models/Chat");
const User = require("../models/User");
const router = new express.Router();
const authentication = require("../authentication/authentication");

router.post("/api/access-chats", authentication, async (req, res) => {
  const id = req.body.userId;
  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: id } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "lastName",
    });
    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      const newChat = new Chat({
        name: "sender",
        isGroupChat: false,
        users: [req.user._id, id],
      });
      await newChat.save();
      const chat = await Chat.findById({ _id: newChat._id }).populate("users");
      res.status(201).send(chat);
    }
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/api/fetch-chats", authentication, async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "firstName lastName role",
    });
    if (chats.length > 0) {
      res.status(200).send(chats);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/api/createGroupChat", authentication, async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      throw new Error("can't create Group Chats");
    }
    const users = req.body.users;
    if (users.length < 2) {
      throw new Error("More than 2 users required to create group chat");
    }
    users.push(req.user._id);
    const groupChat = new Chat({
      name: req.body.name,
      isGroupChat: true,
      groupAdmin: req.user._id,
      users,
    });
    await groupChat.save();

    const mainGroupChat = await Chat.findById(groupChat._id)
      .populate("groupAdmin")
      .populate("users");
    res.status(201).send(mainGroupChat);
  } catch (error) {
    res.status(400).send();
  }
});
router.patch("/api/chats/:id", authentication, async (req, res) => {
  const id = req.params.id;

  try {
    let chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).send();
    }
    chat.latestMessage = req.body.messageId;
    await chat.save();
    chat = await chat.populate("users");
    chat = await chat.populate("latestMessage");
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "firstName lastName role",
    });

    res.status(200).send(chat);
  } catch (error) {
    res.status(400).send();
  }
});
router.patch("/api/renameGroupChat/:id", authentication, async (req, res) => {
  const id = req.params.id;
  try {
    const groupChat = await Chat.findById(id);
    if (!groupChat) {
      return res.status(404).send();
    }
    groupChat.name = req.body.name;
    await groupChat.save();
    res.status(200).send(groupChat);
  } catch (error) {
    res.status(400).send();
  }
});
router.patch("/api/editGroupChat/:id", authentication, async (req, res) => {
  const id = req.params.id;
  try {
    const groupChat = await Chat.findById(id);
    if (!groupChat) {
      return res.status(404).send();
    }
    if (req.body.users.length < 3) {
      return res.status(400).send();
    }
    groupChat.users = [...req.body.users];
    await groupChat.save();
    res.status(200).send(groupChat);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/api/deleteGroupChat/:id", authentication, async (req, res) => {
  const id = req.params.id;
  try {
    const groupChat = await Chat.findById(id);
    if (!groupChat) {
      return res.status(404).send();
    }
    await groupChat.remove();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
