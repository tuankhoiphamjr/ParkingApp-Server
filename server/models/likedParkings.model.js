const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const LikeParkings = new mongoose.Schema({
      userId: {
            type: ObjectId,
            required: true,
      },
      parkingId: {
            type: ObjectId,
            required: true,
      },
      parkingName: {
          type: String,
          required: true
      },
      userName: {
          type: String,
          required: true,
      },
      parkingAddress: {
          type: String,
          required: true
      },
      createdAt: {
          type: String,
          default: new Date(),
          required: true
      }
});
module.exports = mongoose.model("LikedParkings", LikeParkings);
