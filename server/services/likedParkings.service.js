const mongoose = require("mongoose");
const db = require("../models");
const dbConfig = require("../config/db.config");
var bcrypt = require("bcryptjs");
const LikedParkings = db.likedParkings;

likeParking = async (
  userId,
  parkingId,
  userName,
  parkingName,
  parkingAddress
) => {
  const filter = {
    userId: mongoose.Types.ObjectId(userId),
    parkingId: mongoose.Types.ObjectId(parkingId),
  };
  let resFound = await LikedParkings.find(filter);
  if (resFound?.length) {
    const res = await LikedParkings.deleteMany({
      userId,
      parkingId,
    });
    if (res) {
      return { result: res, status: true };
    } else {
      return { status: false, message: "BAD REQUEST" };
    }
  } else {
    const _res = await LikedParkings.create({
      userId,
      parkingAddress,
      userName,
      parkingId,
      parkingName,
    });
    if (_res) {
      return { result: _res, status: true };
    } else {
      return { status: false, message: "BAD REQUEST" };
    }
  }
};
// Create Parking in DB
checkIfParkingIsLiked = async (userId, parkingId) => {
  const filter = {
    userId: mongoose.Types.ObjectId(userId),
    parkingId: mongoose.Types.ObjectId(parkingId),
  };
  let resFound = await LikedParkings.find(filter);
  console.log(resFound);
  if (resFound?.length) {
    return { result: resFound, status: true };
  } else {
    return { status: false, message: "NOT_FOUND" };
  }
};

getListParkingisLikedByUserId = async (userId) => {
  const filter = {
    userId: mongoose.Types.ObjectId(userId),
  };
  let resFound = await LikedParkings.find(filter);
  return { result: resFound, status: true };
};
const likedParkingsService = {
  likeParking,
  checkIfParkingIsLiked,
  getListParkingisLikedByUserId
};

module.exports = likedParkingsService;
