const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const dbConfig = require("../config/db.config");

const PImgSchema = new mongoose.Schema({ id: ObjectId }, { _id: false });

const ParkingSchema = new mongoose.Schema({
  ownerId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },

  parkingName: {
    type: String,
    required: true,
  },

  parkingAddress: {
    type: String,
    required: true,
  },

  initialSlots: {
    type: Number,
    required: true,
    default: 0,
  },

  currentSlots: {
    type: Number,
    required: true,
    default: 0,
  },

  superficies: {
    type: Number,
    required: true,
    default: 0,
  },

  parkingImgId: [PImgSchema],

  openTime: {
    type: String,
    default: "00:00",
  },

  closeTime: {
    type: String,
    default: "00:00",
  },

  registerDate: {
    type: Date,
    default: Date.now(),
  },

  ratingStar: {
    type: Number,
    default: 0.1,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  advertisingPoint: {
    type: Number,
    default: 0,
  },

  averageRating: {
    type: Number,
    default: 0,
  },

  pricePerHour: {
    type: Number,
    default: 0,
  },

  coordinate: {
    latitude: {
      type: Number,
      default: 1.1,
    },
    longitude: {
      type: Number,
      default: 1.1,
    },
  },

  vechileType: {
    type: Array,
    default: [
      {
        key : "0",
        value: "car"
      }
    ]
  },

  description: {
    type: String,
    default: "",
  },

  distance: {
    type: Number,
    default: 0.1,
  },
  images: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Parking", ParkingSchema);
