const mongoose = require("mongoose");
const db = require("../models");
const dbConfig = require("../config/db.config");
var bcrypt = require("bcryptjs");
const User = db.user;

// Create User in DB
createUser = async (
  phoneNumber,
  password,
  role,
  firstName,
  lastName,
  email
) => {
  let result = await User.create({
    phoneNumber,
    password,
    role,
    firstName,
    lastName,
    email,
  });
  return { result, status: true };
};

// Change status of user
setUserStatus = async (userId, status) => {
  let result;
  await User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userId) },
    { isActive: status },
    (err, data) => {
      if (err) {
        result = { message: err, status: false };
      }
      result = { message: "Success", status: true };
    }
  );
  return result;
};

// Get all user info by number phone
getUserByPhoneNumber = async (phoneNumber) => {
  let result = await User.findOne({ phoneNumber })
    .populate("avatar", "-_id -__v")
    .select("-__v");
  if (!result) {
    return { message: "User not found", status: false };
  }
  return { result, status: true };
};

// Get all user info by _id
getUserById = async (userID) => {
  let result = await User.findOne({ _id: userID })
    .populate("avatar", "-_id -__v")
    .select("-__v");
  if (!result) {
    return { message: "User not found", status: false };
  }
  return { result, status: true };
};

// Compare password
comparePassword = async (password, passHashinDB) => {
  let passwordIsValid = await bcrypt.compareSync(password, passHashinDB);
  if (!passwordIsValid) {
    return {
      status: false,
      message: "Invalid Password!",
    };
  }
  return {
    status: true,
    message: "Valid Password!",
  };
};

// Update password of user in DB
updatePassword = async (userId, newPassword) => {
  let result;
  await User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userId) },
    { password: bcrypt.hashSync(newPassword, 8) },
    (err, data) => {
      if (err) {
        result = { message: err, status: false };
      }
      result = { message: "Success", status: true };
    }
  );

  return result;
};

// Update user info in DB
updateUserInfo = async (userId, firstName, lastName, email) => {
  let result;
  await User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userId) },
    { firstName: firstName, lastName: lastName, email: email },
    (err, data) => {
      if (err) {
        result = { message: err, status: false };
      }
      result = { message: "Success", status: true };
    }
  );
  return result;
};

const userServices = {
  setUserStatus,
  createUser,
  getUserByPhoneNumber,
  getUserById,
  comparePassword,
  updatePassword,
  updateUserInfo,
};

module.exports = userServices;
