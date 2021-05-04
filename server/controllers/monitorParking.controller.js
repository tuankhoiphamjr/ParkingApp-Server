const monitorParkingService = require("../services/monitorParking.service");

exports.addMonitorParking = async (req, res) => {
      let parkingId = req.body.parkingId;
      let ownerId = req.userId;
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
      let ownerId = req.userId;
      let parkingId = req.params.parkingId;
      let { userId, vehicleId, comingTime, status } = req.body;
      let result = await monitorParkingService.addComingVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime,
            status
      );
      // Bug tại đay nhưng không hiểu tại sao
      if (!result.status) {
            res.status(400).json({ message: "Add Coming Vehicle fail" });
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
            res.status(400).json({ message: "Delete fail" });
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
      let ownerId = req.userId;
      let parkingId = req.params.parkingId;
      let { userId, vehicleId, comingTime } = req.body;
      let result = await monitorParkingService.addComeVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime
      );
      // Bug tại đay nhưng không hiểu tại sao
      if (!result.status) {
            res.status(400).json({ message: "Add new vehicle to monitor fail" });
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

exports.addVehicleHasOutOfParking = async (req, res) => {
      let ownerId = req.userId;
      let parkingId = req.params.parkingId;
      let {
            userId,
            vehicleId,
            comingTime,
            outTime,
            price,
      } = req.body;
      let result = await monitorParkingService.addOutVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime,
            outTime,
            price
      );
      if (!result) {
            res.status(400).send({ message: "Something wrong" });
            return;
      }
      if (!result.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};
