const mongoose = require("mongoose");
const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;

createUser = async (
  phoneNumber,
  password,
  role,
  firstName,
  lastName,
  email
) => {
  // const newUser = new User({
  //   phoneNumber: phoneNumber,
  //   password: bcrypt.hashSync(password, 8),
  //   role: role,
  // });

  // let result = await newUser.save((err, user) => {
  //   if (err) {
  //     return { message: err, status: false };
  //   }
  //   return user;
  // });

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

getUserByPhoneNumber = async (phoneNumber) => {
  let result = await User.findOne({ phoneNumber }).select("-__v");
  if (!result) {
    return { message: "User not found", status: false };
  }
  return { result, status: true };
};

getUserById = async (userID) => {
  let result = await User.findOne({ _id: userID }).select("-__v");
  if (!result) {
    return { message: "User not found", status: false };
  }
  return { result, status: true };
};

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

const userServices = {
  setUserStatus,
  createUser,
  getUserByPhoneNumber,
  getUserById,
  comparePassword,
  updatePassword,
};

module.exports = userServices;
