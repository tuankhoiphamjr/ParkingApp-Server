const feedbackService = require("../services/feedback.service");
const parkingServices = require("../services/parking.service");

exports.showFeedbackOfParkingController = async (req, res) => {
  let parkingId = req.params.parkingId;
  let { result, status } = await feedbackService.getFeedbackByParkingId(
    parkingId
  );

  if (!status) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).json(result);
};

exports.addFeedbackToParkingOwner = async (req, res) => {
  let { content, ratingStar } = req.body;
  let userId = req.userId;
  let parkingId = req.params.parkingId;
  let result = await feedbackService.createFeedback(
    parkingId,
    userId,
    content,
    ratingStar
  );
  if (!result) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
  if (!result.status) {
    res.status(400).json({ message: result.message });
    return;
  }
  let resu = await parkingServices.updateRatingStar(parkingId);
  if (!resu?.status) {
    res.status(400).json({
      message: "Something went wrong when update rating star",
    });
    return;
  }
  res.status(200).json(result);
};

exports.getOverviewFeedback = async (req, res) => {
  let { parkingId } = req.params;
  let data = await feedbackService.getOverviewFeedBack(parkingId);
  if (!data) {
    res.status(400).json({ message: "BAD_REQUEST" });
  } else {
    res.status(200).json({
      data: data.result,
    });
  }
};
