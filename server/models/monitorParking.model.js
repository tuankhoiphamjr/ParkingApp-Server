const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const MonitorParkingSchema = new mongoose.Schema({
      ownerId: {
            type: ObjectId,
            required: true,
            ref: "User",
      },
      parkingId: {
            type: ObjectId,
            required: true,
            ref: "Parking",
      },
      isComing: {
            type: Array,
            userId: {
                  type: ObjectId,
                  ref: "User",
            },
            vehicleId: {
                  type: ObjectId,
                  ref: "Vehicle",
            },
            comingTime: {
                  type: String,
            }
      },
      hasCome: {
            type: Array,
            userId: {
                  type: ObjectId,
                  ref: "User",
            },
            vehicleId: {
                  type: ObjectId,
                  ref: "Vehicle",
            },
            isOut:{
                  type:Boolean,
            },
            comingTime: {
                  type: String,
            },
            outTime: {
                  type: String,
            },
            price:{
                  type:Number,
            }
      },
});
module.exports = mongoose.model("MonitorParking", MonitorParkingSchema);