const mongoose = require("mongoose");
const db = require("../models");
const NotifyToken = db.notifyToken;

// Use to create token in DB for Notification
createToken = async (deviceId, token, userId, role) => {
  let result = await NotifyToken.create({
    deviceId,
    token,
    userId,
    role,
  });
  return { result, status: true };
};

// Get Token By User Id And Device Id
getTokenByUserIdAndDeviceId = async (userId, deviceId) => {
  let result = await NotifyToken.findOne({
    userId: userId,
    deviceId: deviceId,
  });
  if (!result) {
    return { message: "Token not found", status: false };
  }
  return { result, status: true };
};

// Get token by ID Array
getTokensByUsersIdArray = async (usersIdArray) => {
  let result = [];

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  // await asyncForEach(usersIdArray, async (userId) => {
    // await NotifyToken.find({ userId: userId }, (err, data) => {
    //   if (err) {
    //     result = { message: err, status: false };
    //   }
    //   data.forEach((token) => {
    //     result.push(token.token);
    //   });
    // });
  // });

  for (let i = 0; i < usersIdArray.length; i++) {
    await NotifyToken.find({ userId: usersIdArray[i] }, (err, data) => {
      if (err) {
        result = { message: err, status: false };
      }
      data.forEach((token) => {
        result.push(token.token);
      });
    });
  }
  return result;
};

const tokenServices = {
  createToken,
  getTokenByUserIdAndDeviceId,
  getTokensByUsersIdArray,
};

module.exports = tokenServices;
