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
  description,
  openTime,
  closeTime
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
    openTime,
    closeTime,
  });

  return { result, status: true };
};

// Update parking Info for owner by ID of parking
updateParkingInfoForOwner = async (
  parkingId,
  ownerId,
  parkingName,
  parkingAddress,
  initialSlots,
  superficies,
  openTime,
  closeTime,
  pricePerHour,
  vechileType,
  description
) => {
  let result;
  await Parking.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(parkingId), ownerId: ownerId },
    {
      parkingName: parkingName,
      parkingAddress: parkingAddress,
      initialSlots: initialSlots,
      superficies: superficies,
      openTime: openTime,
      closeTime: closeTime,
      pricePerHour: pricePerHour,
      vechileType: vechileType,
      description: description,
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

// Get all Parking info by parking ID
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

//Get all parking place info that is verified
getAllVerifiedParkingInfo = async () => {
  let result = await Parking.find({ isVerified: true });
  if (!result) {
    return { status: false, message: "Not Found Car Parking" };
  }

  return { status: true, result: result };
};

//Get all parking place of owner
getParkingsByOwnerId = async (ownerId) => {
  let result = await Parking.find({ ownerId: ownerId });
  if (!result) {
    return { status: false, message: "Something went wrong" };
  }
  return { status: true, result: result };
};

// Get Parking info by owner Id and parking id
getParkingByOwnerIdAndParkingId = async (ownerId, parkingId) => {
  let result = await Parking.find({ ownerId: ownerId, _id: parkingId });
  if (!result) {
    return { status: false, message: "Something went wrong" };
  }
  return { status: true, result: result };
};

// Delete a parking by owner
deleteParkingByOwner = async (ownerId, parkingId) => {
  let result;
  let checkIfParkingExisted = await getParkingByOwnerIdAndParkingId(
    ownerId,
    parkingId
  );
  console.log(checkIfParkingExisted)
  if (checkIfParkingExisted.result.length === 0)
    return { status: false, message: "Parking not Found or Deleted Or user are not owner of parking" };
  await Parking.deleteOne({ _id: parkingId, ownerId: ownerId }, (err, data) => {
    if (err) {
      result = { message: err, status: false };
    }
    result = { message: "Delete Parking successfully", status: true };
  });
  return result;
};

const parkingServices = {
  createNewParkingPlace,
  getParkingInfoById,
  updateParkingInfoForOwner,
  updateParkingCurrentSlot,
  getAllVerifiedParkingInfo,
  getParkingsByOwnerId,
  deleteParkingByOwner,
};

module.exports = parkingServices;
