const Institution = require("../../models/Institution");
const jwt = require("jsonwebtoken");
const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded_id = jwt.verify(token, process.env.INSTITUTIONKEY);
    const institution = await Institution.findOne({
      _id: decoded_id._id,
      "tokens.token": token,
    });
    if (!institution) {
      throw new Error();
    }
    req.token = token;
    req.institution = institution;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = authentication;
