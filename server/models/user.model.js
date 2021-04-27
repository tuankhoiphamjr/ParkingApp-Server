const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const dbConfig = require("../config/db.config")

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    ref: "Role"
  },

  firstName: {
    type: String,
    default: ""
  },

  lastName: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    default: "",
  },
  
  accummulatePoint: {
    type: Number,
    default: 0,
  },

  avatar: {
    type: String,
    default: "",
  },

  isActive: {
    type: Boolean,
    default: false,

  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);