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
            return;
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
            return;
      }
      res.status(200).send(response);
};

exports.updateUserInfo = async (req, res) => {
      let { firstName, lastName, email, avatar } = req.body;
      let userId = req.userId;
      let result = await userServices.updateUserInfo(
            userId,
            firstName,
            lastName,
            email, 
            avatar
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

exports.getUserInfoById = async (req, res) => {
      let userId = req.params.userId;
      let { result, status } = await userServices.getUserById(userId);
      if (!status) {
            res.status(400).send({ message: "Get user fail" });
            return;
      }
      res.status(200).json(result);
};

exports.getUserInfoByIdForUser = async (req, res) => {
      let userId = req.userId;
      let { result, status } = await userServices.getUserById(userId);
      if (!status) {
            res.status(400).send({ message: "Get user fail" });
            return;
      }
      res.status(200).json(result);
};

exports.getAllUserInfos = async (req, res) => {
      let { result, status } = await userServices.getAllUserInfos();
      if (!status) {
            res.status(400).send({ message: "Get user fail" });
            return;
      }
      res.status(200).json(result);
};

exports.updateNewPassword = async (req, res) => {
      let {userId, newPassword} = req.body;
      let response = await userServices.updatePassword(userId, newPassword);
      if (!response.status) {
            res.status(400).send(response);
            return;
      }
      res.status(200).send(response);
};