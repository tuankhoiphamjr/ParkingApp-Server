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
      let { type, licensePlates, color, modelName, images, description } =
            req.body;
      let { result, status } = await vehicleService.addVehicle(
            ownerId,
            type,
            licensePlates,
            color,
            modelName,
            images,
            description
      );

      if (!status) {
            console.log(result);
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

exports.updateVehicleInfo = async (req, res) => {
      let {
            vehicleId,
            type,
            licensePlates,
            color,
            modelName,
            images,
            description,
      } = req.body;
      let result = await vehicleService.updateVehicleInfo(
            vehicleId,
            type,
            licensePlates,
            color,
            modelName,
            images,
            description
      );
      if (!result.status) {
            return res.status(400).send({
                  message: "Update vehicle info failed.",
            });
      }
      return res
            .status(200)
            .send({ message: "Update vehicle info successfully." });
};

exports.deleteVehicleInfo = async (req, res) => {
      let { vehicleId } = req.body;
      let result = await vehicleService.deleteVehicle(vehicleId);
      if (!result.status) {
            return res.status(400).send({
                  message: result.message,
            });
      }
      return res.status(200).send({ message: "Delete vehicle successfully." });
};
