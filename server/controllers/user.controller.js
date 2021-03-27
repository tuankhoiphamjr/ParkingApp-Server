const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const db = require("../models");
const userServices = require("../services/user.service");

const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.changePassword = async (req, res) => {
  let userId = req.body.userId;
  let newPassword = req.body.newPassword;
  let oldPassword = req.body.oldPassword;

  let { result, status } = await userServices.getUserById(userId);
  if (!status) {
    res.status(404).send({ message: result.message });
  }

  let passwordCompareCheck = await userServices.comparePassword(
    oldPassword,
    result.password
  );

  if (!passwordCompareCheck.status) {
    return res.status(401).send({
      message: "Passwords does not match",
    });
  }

  let response = await userServices.updatePassword(userId, newPassword);
  if (!response.status) {
    res.status(401).send(response);
  }
  res.status(200).send(response);
};
