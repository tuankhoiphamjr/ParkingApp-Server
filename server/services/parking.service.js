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
      unitHour,
      priceByVehicle,
      openTime,
      closeTime,
      images
) => {
      let currentSlots = initialSlots;
      let result = await Parking.create({
            ownerId,
            parkingName,
            parkingAddress,
            coordinate,
            vechileType,
            superficies,
            initialSlots,
            currentSlots,
            description,
            unitHour,
            priceByVehicle,
            openTime,
            closeTime,
            images,
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
      description,
      unitHour,
      priceByVehicle,
      images
) => {
      let result;
      let res = await Parking.find({ _id: mongoose.Types.ObjectId(parkingId) });
      if (res.length === 0) {
            return { message: "Parking not found", status: false };
      }
      let currentSlots = initialSlots - res.initialSlots + res.currentSlots;
      await Parking.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(parkingId), ownerId: ownerId },
            {
                  parkingName: parkingName,
                  parkingAddress: parkingAddress,
                  initialSlots: initialSlots,
                  currentSlots: currentSlots,
                  superficies: superficies,
                  openTime: openTime,
                  closeTime: closeTime,
                  pricePerHour: pricePerHour,
                  vechileType: vechileType,
                  description: description,
                  unitHour: unitHour,
                  priceByVehicle: priceByVehicle,
                  images: images,
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

updateParkingCurrentSlot = async (parkingId, isOut) => {
      let parkingInfo = await getParkingInfoById(parkingId);
      let currentSlots = isOut
            ? parkingInfo.result.currentSlots + 1
            : parkingInfo.result.currentSlots - 1;
      let update = await Parking.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(parkingId) },
            {
                  currentSlots: currentSlots,
            }
      );
      if (update.length === 0) {
            return { message: "Update current slots fail", status: false };
      }
      return { message: "Update current slots successfully", status: true };
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

// Get parking has field status equal to false info
getCensorshipParking = async () => {
      let result = await Parking.find({ isVerified: false });
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
      console.log(checkIfParkingExisted);
      if (checkIfParkingExisted.result.length === 0)
            return {
                  status: false,
                  message: "Parking not Found or Deleted Or user are not owner of parking",
            };
      await Parking.deleteOne(
            { _id: parkingId, ownerId: ownerId },
            (err, data) => {
                  if (err) {
                        result = { message: err, status: false };
                  }
                  result = {
                        message: "Delete Parking successfully",
                        status: true,
                  };
            }
      );
      return result;
};

// Verify Parking by Admin
verifyParking = async (parkingId, status) => {
      let result;
      await Parking.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(parkingId) },
            { isVerified: status },
            (err, data) => {
                  if (err) {
                        result = { message: err, status: false };
                  }

                  if (!data) {
                        result = {
                              message: "Parking not found or something went wrong",
                              status: false,
                        };
                  } else {
                        result = {
                              message: `Parking are verify to ${status}`,
                              status: true,
                        };
                  }
            }
      );
      return result;
};

// Open or Close a parking by owner (manage parking)
/**
 * @type {Bolean}
 * status: false || true
 */
changeParkingOpenStatus = async (status, parkingId, ownerId) => {
      let result = await Parking.findOneAndUpdate(
            {
                  _id: mongoose.Types.ObjectId(parkingId),
                  ownerId: mongoose.Types.ObjectId(ownerId),
            },
            { isOpen: status }
      );

      if (!result) {
            return {
                  status: false,
                  message: "Can't find Parking or Something went wrong",
            };
      }

      return { status: true, message: "Success" };
};

const parkingServices = {
      createNewParkingPlace,
      getParkingInfoById,
      updateParkingInfoForOwner,
      updateParkingCurrentSlot,
      getAllVerifiedParkingInfo,
      getParkingsByOwnerId,
      getCensorshipParking,
      deleteParkingByOwner,
      verifyParking,
      changeParkingOpenStatus,
};

module.exports = parkingServices;
