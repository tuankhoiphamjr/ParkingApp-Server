const monitorParkingService = require("../services/monitorParking.service");

exports.addmonitorParking = async (req, res) => {
      let { ownerId, parkingId } = req.body;
      // let userId = req.userId;
      let { result, status } = await monitorParkingService.createNewMonitor(
            ownerId,
            parkingId
      );
      if (!status) {
            res.status(400).json({ message: "Add monitor fail" });
            return;
      }
      res.status(200).json(result);
};

exports.addComingVehicleToMonitor = async (req, res) => {
      let { ownerId, parkingId, userId, vehicleId, comingTime } = req.body;
      let result = await monitorParkingService.addComingVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime
      );
      // Bug tại đay nhưng không hiểu tại sao
      if (!result.status) {
            res.status(400).json({ message: "message" });
            return;
      }
      res.status(200).json(result);
};

exports.deleteComingVehicleInMonitor = async (req, res) => {
      let { parkingId, userId, vehicleId } = req.body;
      let result = await monitorParkingService.deleteComingVehicle(
            parkingId,
            userId,
            vehicleId
      );
      // Bug tại đay nhưng không hiểu tại sao
      if (!result.status) {
            res.status(400).json({ message: "message" });
            return;
      }
      res.status(200).json(result);
};

exports.getIsComingVehicle = async (req, res) => {
      let parkingId = req.params.parkingId;
      let result = await monitorParkingService.showListComingVehicle(parkingId);
      if (!result.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.addNewComingVehicleToMonitor = async (req, res) => {
      let { ownerId, parkingId, userId, vehicleId, comingTime } = req.body;
      let result = await monitorParkingService.addComeVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime
      );
      // Bug tại đay nhưng không hiểu tại sao
      if (!result.status) {
            res.status(400).json({ message: "message" });
            return;
      }
      res.status(200).json(result);
};

exports.getVehicleInParking = async (req, res) => {
      let parkingId = req.params.parkingId;
      let result = await monitorParkingService.showListVehicleInParking(
            parkingId
      );
      if (!result.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};
