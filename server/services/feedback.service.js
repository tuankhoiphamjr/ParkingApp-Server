const mongoose = require("mongoose");
const db = require("../models");
const Feedback = db.feedback;
const BookingHistory = db.bookingHistory;

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

getNumberOfFeedbackByDate = async (day, month, year) => {
      day = parseInt(day);
      month = parseInt(month) - 1;
      year = parseInt(year);
      let fromDate = new Date(Date.UTC(year, month, day));
      let toDate = new Date(Date.UTC(year, month, day + 1));
      console.log(fromDate, toDate);
      const filter = {
            createAt: {
                  $gte: fromDate,
                  $lt: toDate,
            },
      };
      let result = await Feedback.find(filter);
      if (result.length === 0) {
            return { result: 0, status: true };
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

const feedbackService = {
      getFeedbackByParkingId,
      createFeedback,
      getNumberOfFeedback,
      getNumberOfFeedbackByDate,
};
module.exports = feedbackService;
