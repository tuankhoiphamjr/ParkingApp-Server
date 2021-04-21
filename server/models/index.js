const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.avatarImage = require("./avatarImage.model");
db.parking = require("./parking.model");
db.parkingImage = require("./parkingImage.model");
db.role = require("./role.model");
db.feedback = require("./feedback.model");
db.vehicle = require("./vehicle.model");
db.notifyToken = require("./notifyToken.model")

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;