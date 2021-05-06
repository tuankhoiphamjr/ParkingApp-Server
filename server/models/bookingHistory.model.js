const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const BookingHistorySchema = new mongoose.Schema({
      vehicleId: {
            type: ObjectId,
            required: true,
            ref: "Vehicle",
      },
      userId: {
            type: ObjectId,
            required: true,
            ref: "User",
      },
      parkingBookingId: {
            type: ObjectId,
            ref: "Parking",
      },
      parkingId: {
            type: ObjectId,
            ref: "Parking",
      },
      parkingHistory: {
            type: Array,
            parkingId: {
                  type: ObjectId,
                  ref: "Parking",
            },
      },
});
module.exports = mongoose.model("BookingHistory", BookingHistorySchema);