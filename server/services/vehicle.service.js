const mongoose = require("mongoose");
const db = require("../models");
const Vehicle = db.vehicle;

// Get vehicle of user
getVehicleInfoByOwnerId = async (ownerId) => {
      const filter = {
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let result = await Vehicle.find(filter).select("-__v");
      if (!result) {
            return { message: "Vehicle not found", status: false };
      }
      return { result, status: true };
};

addVehicle = async (ownerId, type, licensePlates, color, modelName) => {
      let result = await Vehicle.create({
            ownerId,
            type,
            licensePlates,
            color,
            modelName,
      });

      return { result, status: true };
};

const vehicleService = {
      getVehicleInfoByOwnerId,
      addVehicle,
};
module.exports = vehicleService;
