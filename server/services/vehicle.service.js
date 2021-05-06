const mongoose = require("mongoose");
const db = require("../models");
const Vehicle = db.vehicle;
const BookingHistory = db.bookingHistory;

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

addVehicle = async (ownerId, type, licensePlates, color, modelName, images) => {
      let result = await Vehicle.create({
            ownerId,
            type,
            licensePlates,
            color,
            modelName,
            images
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

updateVehicleInfo = async (ownerId, type, licensePlates, color, modelName) => {
      let result = await Vehicle.findOneAndUpdate(
            { ownerId: mongoose.Types.ObjectId(ownerId) },
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

const vehicleService = {
      getVehicleInfoByOwnerId,
      addVehicle,
      updateVehicleInfo,
};
module.exports = vehicleService;
