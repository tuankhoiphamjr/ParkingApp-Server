const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const NotifyTokenSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },

  role: {
    type: String,
    required: true,
  },

  userId: {
    type: ObjectId,
    required: true,
  }
});
module.exports = mongoose.model("NotifyToken", NotifyTokenSchema);
