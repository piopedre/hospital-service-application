const pharmaAuthentication = (req, res, next) => {
  try {
    if (req.user.role.name === "INTERN OFFICER" || !req.user.status) {
      throw new Error();
    }
    req.user;
    next();
  } catch (error) {
    res.status(403).send({ error: "Not allowed" });
  }
};

module.exports = { pharmaAuthentication };
