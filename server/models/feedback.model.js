const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const FeedbackSchema = new mongoose.Schema({
      parkingId: {
            type: ObjectId,
            required: true,
            ref: "Parking",
      },
      userId: {
            type: ObjectId,
            required: true,
            ref: "User",
      },
      content: {
            type: String,
            required: true,
      },
      ratingStar: {
            type: Number,
            required: true,
      },
      createAt: {
            type: Date,
            default: Date.now(),
      },
});
module.exports = mongoose.model("Feedback", FeedbackSchema);