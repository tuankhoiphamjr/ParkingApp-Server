const parkingServices = require("../services/parking.service");
const monitorService = require("../services/monitorParking.service");
const userServices = require("../services/user.service");
const feedbackService = require("../services/feedback.service");

// Get all parking has field isVerified equal to false info
exports.getParkingsNeedVerified = async (req, res) => {
      let result = await parkingServices.getCensorshipParking();
      if (!result.status) {
            return res
                  .status(400)
                  .json({ status: false, message: result.message });
      }
      return res.status(200).json({ status: true, result: result.result });
};

// Verify a Parking By Admin
exports.verifyParkingController = async (req, res) => {
      let parkingId = req.params.parkingId;
      let ownerId = req.body.ownerId;
      let result = await parkingServices.verifyParking(parkingId, true);
      if (!result) {
            return res
                  .status(400)
                  .json({ status: false, message: "Some thing wrong" });
      }
      if (!result?.status) {
            return res
                  .status(400)
                  .json({ status: false, message: result.message });
      }
      let response = await monitorService.createNewMonitor(ownerId, parkingId);
      if (!response) {
            return res
                  .status(400)
                  .json({ status: false, message: "Some thing wrong" });
      }
      if (!response?.status) {
            res.status(400).json({ message: response.message });
            return;
      }
      return res.status(200).json({ status: true, result: result.message });
};

// Get number of user and owner
exports.getNumOfUserAndOwner = async (req, res) => {
      let result = await userServices.getNumOfUserAndOwner();
      if (!result) {
            return res
                  .status(400)
                  .json({ status: false, message: "Some thing wrong" });
      }
      if (!result.status) {
            return res
                  .status(400)
                  .json({ status: false, message: result.message });
      }
      return res.status(200).json({
            numOfUser: result.numberOfUser,
            numOfOwner: result.numberOfOwner,
            status: true,
      });
};

// Get number of parking
exports.getNumOfParking = async (req, res) => {
      let result = await parkingServices.getAllVerifiedParkingInfo();
      if (!result) {
            return res
                  .status(400)
                  .json({ status: false, message: "Some thing wrong" });
      }
      if (!result.status) {
            return res
                  .status(400)
                  .json({ status: false, message: result.message });
      }
      return res.status(200).json({
            numOfParking: result.result.length,
            status: true,
      });
};

// Get number of evaluate
exports.getNumOfEvaluate = async (req, res) => {
      let result = await feedbackService.getNumberOfFeedback();
      if (!result) {
            return res
                  .status(400)
                  .json({ status: false, message: "Some thing wrong" });
      }
      if (!result.status) {
            return res
                  .status(400)
                  .json({ status: false, message: result.message });
      }
      return res.status(200).json({
            numOfEvaluate: result.result,
            status: true,
      });
};

exports.declineParkingByAdmin = async (req, res) => {
      let parkingId = req.params.parkingId;
      let result = await parkingServices.declineParkingByAdmin(parkingId);
      if (!result) {
            return res
                  .status(400)
                  .json({ status: false, message: "Some thing wrong" });
      }
      if (!result.status) {
            return res
                  .status(400)
                  .json({ status: false, message: result.message });
      }
      return res.status(200).json({
            result: result.result,
            status: true,
      });
};
