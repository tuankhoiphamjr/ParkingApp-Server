const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
// const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  let userId = req.userId;
  User.findOne({ _id: userId, role: "admin" }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;
  });
};

isOwner = (req, res, next) => {
  let userId = req.userId;
  User.findOne({ _id: userId, role: "owner" }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Owner Role!" });
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isOwner,
};
module.exports = authJwt;
