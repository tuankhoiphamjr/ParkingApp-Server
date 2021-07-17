const mongoose = require("mongoose");
const db = require("../models");
const dbConfig = require("../config/db.config");
var bcrypt = require("bcryptjs");
const User = db.user;
const dateFormat = require("../utils/dateFormat");

// Create User in DB
createUser = async (
      phoneNumber,
      password,
      role,
      firstName,
      lastName,
      email,
      avatar
) => {
      let result = await User.create({
            phoneNumber,
            password,
            role,
            firstName,
            lastName,
            email,
            avatar,
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
getUserByPhoneNumberAndRole = async (phoneNumber, role) => {
      let result = await User.findOne({ phoneNumber, role });
      if (!result) {
            return {
                  message: `User with role ${role} not found`,
                  status: false,
            };
      }
      return { result, status: true };
};

// Get all user info by _id
getUserById = async (userID) => {
      let result = await User.findOne({ _id: userID });
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
updateUserInfo = async (userId, firstName, lastName, email, avatar) => {
      let result;
      await User.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(userId) },
            {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  avatar: avatar,
            },
            (err, data) => {
                  if (err) {
                        result = { message: err, status: false };
                  }
                  result = { message: "Success", status: true };
            }
      );
      return result;
};

// Checking if user existed with ${role}
checkUserExist = async (phoneNumber, role) => {
      let result = await User.findOne({ phoneNumber: phoneNumber, role: role });
      if (result) {
            return {
                  status: true,
                  message: `Failed!! User has been register with role ${role}`,
            };
      }

      return { status: false, message: "User not registed yet" };
};

// Get number of user and owner
getNumOfUserAndOwner = async () => {
      let result = await User.find({ role: "user" });
      if (result.length === 0) {
            return {
                  message: "There are no User",
                  status: false,
            };
      }
      let res = await User.find({ role: "owner" });
      if (res.length === 0) {
            return {
                  message: "There are no Owner",
                  status: false,
            };
      }
      return {
            numberOfUser: result.length,
            numberOfOwner: res.length,
            status: true,
      };
};
getNumOfUserRegisterByMonth = async (month, year) => {
      let fromDate = new Date(Date.UTC(year, month - 1, 1));
      let toDate = new Date(Date.UTC(year, month, 0));
      let statisticalUser = Array(toDate.getDate()).fill(0);
      let statisticalOwner = Array(toDate.getDate()).fill(0);
      let statistical = Array(toDate.getDate());
      for (let i = 0; i < statistical.length; i++) {
            statistical[i] = [i + 1, 0, 0];
      }
      const filter = {
            createdAt: {
                  $gte: fromDate,
                  $lt: toDate,
            },
      };
      let res = await User.find(filter);
      if (res.length === 0) {
            return {
                  status: true,
                  result: statistical,
            };
      }
      res.forEach((user) => {
            let formatDateDB = dateFormat.dateDBFormat(user.createdAt);
            let outTime = formatDateDB.split(" ");
            let outDate = outTime[0].split("/");
            if (user.role === "owner") {
                  statisticalOwner[parseInt(outDate[0]) - 1] += 1;
            } else if (user.role === "user") {
                  statisticalUser[parseInt(outDate[0]) - 1] += 1;
            }
      });
      for (let i = 0; i < statistical.length; i++) {
            statistical[i] = [i + 1, statisticalOwner[i], statisticalUser[i]];
      }
      return {
            status: true,
            result: statistical,
      };
};

const userServices = {
      setUserStatus,
      createUser,
      getUserByPhoneNumberAndRole,
      getUserById,
      comparePassword,
      updatePassword,
      updateUserInfo,
      checkUserExist,
      getNumOfUserAndOwner,
      getNumOfUserRegisterByMonth,
};

module.exports = userServices;
