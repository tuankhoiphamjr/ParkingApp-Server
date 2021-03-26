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
      result = { message: "Success", status: false };
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

comparePassword = async (password, passwordToCompare) => {
  let passwordIsValid = await bcrypt.compareSync(password, passwordToCompare);
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

const userServices = {
  setUserStatus,
  createUser,
  getUserByPhoneNumber,
  comparePassword,
};

module.exports = userServices;
