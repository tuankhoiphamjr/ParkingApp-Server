const express = require("express");
const router = express.Router();

const controller = require("../controllers/notification.controller");

router.post("/token/new", controller.addNewNotificationToken);

router.post("/topic/:role", controller.notifyToTopicController);

router.post("/", controller.notifyToUsersController)

router.post("/checkDevice", controller.checkDeviceController)

module.exports = router;
