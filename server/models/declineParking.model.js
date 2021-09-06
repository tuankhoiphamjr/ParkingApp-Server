const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const DeclineParkingSchema = new mongoose.Schema({
      ownerId: {
            type: ObjectId,
            required: true,
            ref: "User",
      },
      declineAt: {
            type: Date,
            default: Date.now(),
      },
});
module.exports = mongoose.model("DeclineParking", DeclineParkingSchema);