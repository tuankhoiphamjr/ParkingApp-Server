const monitorParkingService = require("../services/monitorParking.service");

exports.addmonitorParking = async (req, res) => {
      let { ownerId, parkingId } = req.body;
      // let userId = req.userId;
      let { result, status } = await monitorParkingService.createNewMonitor(
            ownerId,
            parkingId,
      );

      if (!status) {
            res.status(400).json({ message: "Something went wrong" });
            return;
      }
      res.status(200).json(result);
};