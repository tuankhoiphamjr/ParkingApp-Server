const { user } = require("../models");
const monitorParkingService = require("../services/monitorParking.service");
const parkingServices = require("../services/parking.service");

exports.addMonitorParking = async (req, res) => {
      let { ownerId, parkingId } = req.body;
      let result = await monitorParkingService.createNewMonitor(
            ownerId,
            parkingId
      );
      if (!result?.status) {
            res.status(400).json({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.addComingVehicleToMonitor = async (req, res) => {
      let userId = req.userId;
      let parkingId = req.params.parkingId;
      let { ownerId, vehicleId, comingTime, status } = req.body;
      let result = await monitorParkingService.addComingVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime,
            status
      );
      // Bug tại đay nhưng không hiểu tại sao
      if (!result?.status) {
            res.status(400).json({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.getBookingInfo = async (req, res) => {
      let userId = req.userId;
      let result = await monitorParkingService.showBookingInfo(userId);
      if (!result?.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.getParkingInfo = async (req, res) => {
      let userId = req.userId;
      let result = await monitorParkingService.showParkingInfo(userId);
      if (!result?.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.getParkingHistoryInfo = async (req, res) => {
      let userId = req.userId;
      let result = await monitorParkingService.showParkingHistoryInfo(userId);
      if (!result?.status) {
            res.status(400).send({ message: result.message });
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
            res.status(400).json({
                  message: "Add new vehicle to monitor fail",
            });
            return;
      }

      let update = await parkingServices.updateParkingCurrentSlot(
            parkingId,
            false
      );
      if (!update?.status) {
            res.status(400).send({ message: "Update current slot fail" });
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
      let { userId, vehicleId, comingTime, outTime, price } = req.body;
      let result = await monitorParkingService.addOutVehicle(
            ownerId,
            parkingId,
            userId,
            vehicleId,
            comingTime,
            outTime,
            price
      );
      if (!result?.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      let update = await parkingServices.updateParkingCurrentSlot(
            parkingId,
            true
      );
      if (!update?.status) {
            res.status(400).send({ message: "Update current slot fail" });
            return;
      }
      res.status(200).json(result);
};

exports.getRevenueOfParkingByDateController = async (req, res) => {
      let parkingId = req.params.parkingId;
      let date = req.body.date;
      let result = await monitorParkingService.getRevenueOfParkingByDate(
            date,
            parkingId
      );
      if (!result.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.getRevenueOfParkingByMonthController = async (req, res) => {
      let parkingId = req.params.parkingId;
      let dateBody = req.body.date;
      let date = dateBody.split("/");
      let result = await monitorParkingService.getRevenueOfParkingByMonth(
            date[0],
            date[1],
            parkingId
      );
      if (!result.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};

exports.getRevenueAndVehicleNumbersOfParkingByMonthForStatisticalController =
      async (req, res) => {
            let parkingId = req.params.parkingId;
            let date = req.body.date;
            let result =
                  await monitorParkingService.getRevenueAndVehicleNumbersOfParkingByMonthForStatistical(
                        date,
                        parkingId
                  );
            if (!result.status) {
                  res.status(400).send({ message: result.message });
                  return;
            }
            res.status(200).json(result);
      };

exports.getRevenueVehicleNumberOfParkingByYearController = async (req, res) => {
      let parkingId = req.params.parkingId;
      let year = req.body.date;
      let result =
            await monitorParkingService.getRevenueVehicleNumberOfParkingByYear(
                  year,
                  parkingId
            );
      if (!result.status) {
            res.status(400).send({ message: result.message });
            return;
      }
      res.status(200).json(result);
};
