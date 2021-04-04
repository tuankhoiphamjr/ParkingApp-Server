const mongoose = require("mongoose");

const ParkingImageSchema = new mongoose.Schema({
  length: {
    required: true,
    type: Number,
  },
  chunkSize: {
    required: true,
    type: Number,
  },
  uploadDate: {
    required: true,
    type: Date,
  },
  filename: {
    required: true,
    type: String,
  },
  md5: {
    require: true,
    type: String,
  },
  contentType: {
    require: true,
    type: String,
  },
});

module.exports = mongoose.model("Parking.Files", ParkingImageSchema);
