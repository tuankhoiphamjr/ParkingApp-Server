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

  curentSlots: {
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
    hour: {
      type: Number,
      default: 0,
    },
    minute: {
      type: Number,
      default: 0,
    },
  },

  closeTime: {
    hour: {
      type: Number,
      default: 0,
    },
    minute: {
      type: Number,
      default: 0,
    },
  },

  registerDate: {
    type: Date,
    default: Date.now(),
  },

  ratingStar: {
    type: Number,
    default: 0,
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
});

module.exports = mongoose.model("Parking", ParkingSchema);
