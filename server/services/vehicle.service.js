const mongoose = require("mongoose");
const db = require("../models");
const Vehicle = db.vehicle;

// Get vehicle of user
getVehicleInfoByOwnerId = async (ownerId) => {
      const filter = {
            ownerId: mongoose.Types.ObjectId(ownerId),
      };
      let result = await Vehicle.find(filter);
      if (result.length ===0) {
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

      return { result, status: true };
};

updateVehicleInfo = async (ownerId, type, licensePlates, color, modelName) => {
      let result =  await Vehicle.findOneAndUpdate(
        { ownerId : mongoose.Types.ObjectId(ownerId) },
        { type: type, licensePlates: licensePlates, color: color, modelName: modelName });
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
