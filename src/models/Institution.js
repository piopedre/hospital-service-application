const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 10,
      required: true,
    },
    city: {
      type: String,
      required: true,
      uppercase: true,
    },
    state: {
      type: String,
      required: true,
      uppercase: true,
    },
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Location",
      },
    ],
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Department",
      },
    ],
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
institutionSchema.methods.toJSON = function () {
  const institution = this;
  const institutionObject = institution.toObject();
  delete institutionObject.password;
  delete institutionObject.tokens;

  return institutionObject;
};
institutionSchema.statics.findInstitution = async (body) => {
  const { username, password } = body;
  const institution = await Institution.findOne({ username });
  if (!institution) {
    throw new Error("unable to login");
  }
  const passwordVerified = await bcrypt.compare(password, institution.password);
  if (!passwordVerified) {
    throw new Error("unable to login");
  }
  return institution;
};
institutionSchema.methods.generateToken = async function () {
  const institution = this;
  const token = jwt.sign(
    { _id: institution._id.toString() },
    process.env.INSTITUTIONKEY,
    {
      expiresIn: "2h",
    }
  );
  if (!token) {
    throw new Error("unable to authenicate");
  }
  institution.tokens = [];
  institution.tokens = institution.tokens.concat({ token });
  await institution.save();
  return { token, name: institution.username };
};
institutionSchema.pre("save", async function (next) {
  const institution = this;
  if (institution.isModified("password")) {
    const salt = await bcrypt.genSalt(8);
    institution.password = await bcrypt.hash(institution.password, salt);
  }
  next();
});

const Institution = mongoose.model("Institution", institutionSchema);
module.exports = Institution;
