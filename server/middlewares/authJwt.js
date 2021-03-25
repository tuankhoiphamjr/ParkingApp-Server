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
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        role: user.role,
      },
      (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (role === "admin") {
          next();
          return;
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        role: user.role,
      },
      (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (role === "moderator") {
          next();
          return;
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
