const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const VehicleSchema = new mongoose.Schema({
      ownerId: {
            type: ObjectId,
            required: true,
            ref: "User",
      },
      type: {
            type: String,
            required: true,
      },
      licensePlates: {
            type: String,
            required: true,
      },
      color: {
            type: String,
      },
      modelName: {
            type: String,
      },
});
module.exports = mongoose.model("Vehicle", VehicleSchema);