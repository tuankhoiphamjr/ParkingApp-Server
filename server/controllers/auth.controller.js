const config = require("../config/auth.config");
const db = require("../models");
const { createUser } = require("../services/user.service");

const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user, mongoose } = require("../models");

exports.signup = (req, res) => {
  let { phoneNumber, password, role } = req.body;
  let result = createUser(phoneNumber, password, role);

  if (!result) {
    res.status(500).send({ message: err });
    return;
  }
  res.send({ message: "User was registered sucessfully!" });
};

exports.signin = (req, res) => {
  User.findOne({
    phoneNumber: req.body.phoneNumber,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user._id) },
      { isActive: true },
      {upsert: true}
    );

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accummulatePoint: user.accummulatePoint,
      isActive: user.isActive,
      accessToken: token,
    });
  });
};
