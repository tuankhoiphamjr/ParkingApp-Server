const mongoose = require("mongoose");
const db = require("../models");
const Feedback = db.feedback;

// Show feedback of an parking
getFeedbackByParkingId = async (parkingId) => {
      const filter = {
            parkingId: mongoose.Types.ObjectId(parkingId),
      };
      let result = await Feedback.find(filter).select("-__v");
      if (!result) {
            return { message: "Feedback not found", status: false };
      }
      return { result, status: true };
};

createFeedback = async (parkingId, userId, content, ratingStar) => {
      let result = await Feedback.create({
            parkingId,
            userId,
            content,
            ratingStar,
      });

      return { result, status: true };
};

const feedbackService = {
      getFeedbackByParkingId,
      createFeedback,
};
module.exports = feedbackService;
