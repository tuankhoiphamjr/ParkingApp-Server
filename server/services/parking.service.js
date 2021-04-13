const mongoose = require("mongoose");
const db = require("../models");
const dbConfig = require("../config/db.config");
var bcrypt = require("bcryptjs");
const Parking = db.parking;

// Create Parking in DB
createNewParkingPlace = async (
  ownerId,
  parkingName,
  parkingAddress,
  coordinate,
  vechileType,
  superficies,
  initialSlots,
  description
) => {
  let result = await Parking.create({
    ownerId,
    parkingName,
    parkingAddress,
    coordinate,
    vechileType,
    superficies,
    initialSlots,
    description,
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
  let result = await Parking.findOne({ _id: parkingId }).select("-__v");
  if (!result) {
    return { message: "Parking not found", status: false };
  }
  return { result, status: true };
};

updateParkingCurrentSlot = async (parkingId) => {
  let parkingInfo = getParkingInfoById(parkingId);
  let result;
  await Parking.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(parkingId) },
    {
      curentSlots: parkingInfo.curentSlots - 1,
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

const parkingServices = {
  createNewParkingPlace,
  getParkingInfoById,
  updateParkingInfoForOwner,
  updateParkingCurrentSlot,
};

module.exports = parkingServices;
