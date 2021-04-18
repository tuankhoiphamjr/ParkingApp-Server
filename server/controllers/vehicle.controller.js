const vehicleService = require("../services/vehicle.service");

exports.getVehicleInfoController = async (req, res) => {
      let ownerId = req.userId;
      let { result, status } = await vehicleService.getVehicleInfoByOwnerId(
            ownerId
      );

      if (!status) {
            res.status(400).json({ message: "User does not have vehicle" });
            return;
      }
      res.status(200).json(result);
};

exports.addVehicleController = async (req, res) => {
      let ownerId = req.userId;
      let { type, licensePlates, color, modelName } = req.body;
      let { result, status } = await vehicleService.addVehicle(
            ownerId,
            type,
            licensePlates,
            color,
            modelName
      );

      if (!status) {
            res.status(400).json({
                  message: "Something went wrong in vehicle controller",
            });
            return;
      }
      res.status(200).json({
            message: "Add vehicle Successfully",
            result,
      });
};
