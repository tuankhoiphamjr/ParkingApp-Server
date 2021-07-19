const mongoose = require("mongoose");
const db = require("../models");
const Feedback = db.feedback;

// Show feedback of an parking
getFeedbackByParkingId = async (parkingId) => {
  const filter = {
    parkingId: mongoose.Types.ObjectId(parkingId),
  };
  let result = await Feedback.find(filter).populate("userId");
  if (result === 0) {
    return { message: "Feedback not found", status: false };
  }
  return { result, status: true };
};

getNumberOfFeedback = async () => {
  let result = await Feedback.find();
  if (result.length === 0) {
    return { message: "Feedback not found", status: false };
  }
  return { result: result.length, status: true };
};

createFeedback = async (parkingId, userId, content, ratingStar) => {
  let res = await BookingHistory.find({
    userId: mongoose.Types.ObjectId(userId),
  });
  if (res.length === 0) {
    return { message: "User Booking not found", status: false };
  }
  let enableFeedback = false;
  for (const parking of res[0].parkingHistory) {
    if (parking.parkingId === parkingId) {
      enableFeedback = true;
      break;
    }
  }
  if (!enableFeedback) {
    return {
      message: "User had to book before feedback",
      status: false,
    };
  }
  let result = await Feedback.create({
    parkingId,
    userId,
    content,
    ratingStar,
  });

  return { result, status: true };
};

getOverviewFeedBack = async (parkingId) => {
  const filter = {
    parkingId: mongoose.Types.ObjectId(parkingId),
  };
  let result = await Feedback.find(filter).populate("userId");
  const votes = [
      {
        point: '1 sao',
        total: result?.filter(item => item.ratingStar === 1).length,
      },
      {
        point: '2 sao',
        total: result?.filter(item => item.ratingStar === 2).length,
      },
      {
        point: '3 sao',
        total: result?.filter(item => item.ratingStar === 3).length,
      },
      {
        point: '4 sao',
        total: result?.filter(item => item.ratingStar === 4).length,
      },
      {
        point: '5 sao',
        total: result?.filter(item => item.ratingStar === 5).length,
      },
    ];
  if (result === 0) {
    return { message: "Feedback not found", status: false };
  }
  return { result: votes, status: true };
};
const feedbackService = {
  getFeedbackByParkingId,
  createFeedback,
  getNumberOfFeedback,
  getOverviewFeedBack,
};
module.exports = feedbackService;
