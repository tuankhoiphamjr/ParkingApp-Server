const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const DeclineParkingSchema = new mongoose.Schema({
      parkingId: {
            type: ObjectId,
            required: true,
            ref: "Parking",
      },
      declineAt: {
            type: Date,
            default: Date.now(),
      },
});
module.exports = mongoose.model("DeclineParking", DeclineParkingSchema);