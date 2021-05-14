const mongoose = require("mongoose");
const db = require("../models");
const { validate } = require("../models/monitorParking.model");
const Vehicle = db.vehicle;
const BookingHistory = db.bookingHistory;

validateLicensePlates = async (licensePlates) => {
      const filter = {
            licensePlates: licensePlates,
      };
      let result = await Vehicle.find(filter);
      if (result.length === 0) {
            return true;
      }
      return false;
};

// Get vehicle of user
getVehicleInfoByOwnerId = async (ownerId) => {
      const filter = {
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let result = await Vehicle.find(filter);
      if (result.length === 0) {
            return { message: "Vehicle not found", status: false };
      }
      return { result, status: true };
};

addVehicle = async (ownerId, type, licensePlates, color, modelName) => {
      let validate = await validateLicensePlates(licensePlates);
      if (validate === false) {
            return {
                  message: "License Plates has been duplicated!",
                  status: false,
            };
      }
      let isActive = true;
      let result = await Vehicle.create({
            ownerId,
            type,
            licensePlates,
            color,
            modelName,
            isActive,
      });
      let vehicleId = result._id;
      let userId = ownerId;
      let res = await BookingHistory.create({
            vehicleId,
            userId,
      });
      if (!res)
            return {
                  message: "Add booking history for vehicle fail",
                  status: false,
            };
      return { result, status: true };
};

updateVehicleInfo = async (
      vehicleId,
      type,
      licensePlates,
      color,
      modelName
) => {
      let result = await Vehicle.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(vehicleId) },
            {
                  type: type,
                  licensePlates: licensePlates,
                  color: color,
                  modelName: modelName,
            }
      );
      if (!result) {
            return { message: "Vehicle not found", status: false };
      }
      return { message: "success", status: true };
};

deleteVehicle = async (vehicleId) => {
      let res = await BookingHistory.find({
            vehicleId: mongoose.Types.ObjectId(vehicleId),
      });
      if (res.length === 0) {
            return {
                  message: "Vehicle not found in booking history",
                  status: false,
            };
      }
      if (res[0].parkingBookingId || res[0].parkingId) {
            return { message: "Can not delete this vehicle", status: false };
      }
      let result = await Vehicle.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(vehicleId) },
            {
                  isActive: false,
            }
      );
      if (!result) {
            return { message: "Vehicle not found", status: false };
      }
      return { message: "success", status: true };
};

const vehicleService = {
      getVehicleInfoByOwnerId,
      addVehicle,
      updateVehicleInfo,
      deleteVehicle,
};
module.exports = vehicleService;
