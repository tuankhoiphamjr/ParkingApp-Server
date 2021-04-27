const monitorParkingService = require("../services/monitorParking.service");

exports.addmonitorParking = async (req, res) => {
      let { ownerId, parkingId } = req.body;
      // let userId = req.userId;
      let { result, status } = await monitorParkingService.createNewMonitor(
            ownerId,
            parkingId,
      );
      if (!status) {
            res.status(400).json({ message: 'Add monitor fail' });
            return;
      }
      res.status(200).json(result);
};

exports.addComingVehicleToMonitor = async (req, res) => {
      let { ownerId, parkingId, userId, vehicleId, comingTime } = req.body;
      // let userId = req.userId;
      let result = await monitorParkingService.addComingVehicle(
            ownerId, 
            parkingId, 
            userId, 
            vehicleId, 
            comingTime
      );
      if (!result.status) {
            res.status(400).json({ message: 'message' });
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