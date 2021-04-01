const mongoose = require("mongoose");
const db = require("../models");
const dbConfig = require("../config/db.config");
var bcrypt = require("bcryptjs");
const Parking = db.parking;

// Create Parking in DB
createNewParkingPlace = async (ownerId, parkingName, parkingAddress) => {
  let result = await Parking.create({
    ownerId,
    parkingName,
    parkingAddress,
  });

  return { result, status: true };
};

// Update user info in DB
updateParkingInfoForOwner = async (
  id,
  parkingName,
  parkingAddress,
  initialSlots,
  curentSlots,
  superficies,
  openTime,
  closeTime
) => {
  let result;
  await Parking.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(id) },
    {
      parkingName: parkingName,
      parkingAddress: parkingAddress,
      initialSlots: initialSlots,
      curentSlots: curentSlots,
      superficies: superficies,
      openTime: openTime,
      closeTime: closeTime,
    },
    (err, data) => {
      if (err) {
        result = { message: err, status: false };
      }
      result = { message: "Success", status: true };
    }
  );
  console.log(result);
  return result;
};

// Get all Parking info by owner ID
getParkingInfoById = async (parkingId) => {
    let result = await Parking.findOne({ _id : parkingId }).select("-__v");
    if (!result) {
      return { message: "Parking not found", status: false };
    }
    return { result, status: true };
  };

const parkingServices = {
  createNewParkingPlace,
  getParkingInfoById,
  updateParkingInfoForOwner,
};

module.exports = parkingServices;
