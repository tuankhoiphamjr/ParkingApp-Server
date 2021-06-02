const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: ObjectId,
  },
  sendUserId: {
    type: ObjectId,
  },
  action: {
    type: String,
  },
});
module.exports = mongoose.model("Notification", NotificationSchema);
