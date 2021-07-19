const mongoose = require("mongoose");
const db = require("../models");
const Notification = db.notification;

// Use to create noti in DB for Notification
addNewNotification = async (title, body, userId, sendUserId, action) => {
  let result = await Notification.create({
    title,
    body,
    userId,
    sendUserId,
    action,
  });
  return { message: "Add Notification Successfully", status: true };
};

// Use to get noti in DB for Notification
getNotificationByUserId = async (userId) => {
  let result = await Notification.find({
    userId: userId,
  }).select("-__v -_id");

  if (result.length === 0) {
    return { message: "There are no notification", status: false };
  }

  return { result: result, status: true };
};

const notificationServices = {
  addNewNotification,
  getNotificationByUserId,
};

module.exports = notificationServices;
