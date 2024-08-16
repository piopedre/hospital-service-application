const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Chat = require("./Chat");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  avatar: {
    type: Buffer,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserRole",
  },
  status: {
    type: Boolean,
    default: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Institution",
  },
  signError: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.ADMINKEY, {
    expiresIn: "9h",
  });
  if (!token) {
    throw new Error("Unable to authenicate");
  }
  user.tokens = [];
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  delete userObject.__v;
  delete userObject.institution;

  return userObject;
};
userSchema.statics.findUser = async (body) => {
  const { username, password, department } = body;
  const user = await User.findOne({ username, department }).populate("role");
  if (!user) {
    throw new Error("Incorrect Username or Password");
  }
  if (user.signError > 4 || !user.status) {
    if (user.signError > 4) {
      throw new Error(
        "Your account is blocked, due to frequent incorrect passwords, please kindly  contact admin"
      );
    } else {
      throw new Error(
        "Your account is not activated, please kindly contact admin"
      );
    }
  }
  const passwordVerified = await bcrypt.compare(password, user.password);
  if (!passwordVerified) {
    user.signError = user.signError + 1;
    await user.save();
    throw new Error("Incorrect Username or Password");
  }

  user.signError = 0;
  await user.save();
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
  }
  if (user.isModified("firstName")) {
    user.firstName = user.firstName[0].toUpperCase() + user.firstName.slice(1);
  }
  next();
});

// Remove user from chats
userSchema.pre("remove", async function (next) {
  const user = this;
  await Chat.deleteMany({
    users: { $elemMatch: { $eq: user._id } },
    isGroupChat: false,
  });
  const groupChats = await Chat.find({
    users: { $elemMatch: { $eq: user._id } },
  });
  if (groupChats.length) {
    groupChats.forEach(async (chat) => {
      chat.users = chat.users.filter((userEl) => userEl !== user._id);
      await chat.save();
    });
  }
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
