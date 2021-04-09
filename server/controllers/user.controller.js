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
      let userId = req.userId;
      let newPassword = req.body.newPassword;
      let oldPassword = req.body.oldPassword;

      let { result, status } = await userServices.getUserById(userId);
      if (!status) {
            res.status(400).send({ message: result.message });
      }

      let passwordCompareCheck = await userServices.comparePassword(
            oldPassword,
            result.password
      );

      if (!passwordCompareCheck.status) {
            return res.status(400).send({
                  message: "Passwords does not match",
            });
      }

      let response = await userServices.updatePassword(userId, newPassword);
      if (!response.status) {
            res.status(400).send(response);
      }
      res.status(200).send(response);
};

exports.updateUserInfo = async (req, res) => {
      let { firstName, lastName, email } = req.body;
      let userId = req.userId;
      let result = await userServices.updateUserInfo(
            userId,
            firstName,
            lastName,
            email
      );
      if (!result.status) {
            return res.status(400).send({
                  message: "Update user info failed.",
            });
      }
      return res
            .status(200)
            .send({ message: "Update user info successfully." });
};

exports.getUserInfo = async (req, res) => {
      let userId = "606043a9dbb53128dc928a9c";
      // let userId = req.userId;
      let { result, status } = await userServices.getUserById(userId);
      if (!status) {
            res.status(400).send({ message: result.message });
      }
      res.status(200).json(result);
};
