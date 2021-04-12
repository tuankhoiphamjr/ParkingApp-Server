const feedbackService = require("../services/feedback.service");

exports.showFeedbackController = async (req, res) => {
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
      let userId = "6067123e3e6aa227bc2f3859";
      let { content, ratingStar } = req.body;
      // let userId = req.userId;
      let parkingId = req.params.parkingId;
      let { result, status } = await feedbackService.createFeedback(
            parkingId,
            userId,
            content,
            ratingStar
      );

      if (!status) {
            res.status(400).json({ message: "Something went wrong" });
            return;
      }
      res.status(200).json(result);
};
