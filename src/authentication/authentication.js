const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded_id = jwt.verify(token, process.env.ADMINKEY);
    const user = await User.findOne({
      _id: decoded_id._id,
      "tokens.token": token,
    }).populate("role");
    if (!user || !user.role || !user.status) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = authentication;
