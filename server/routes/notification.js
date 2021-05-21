const express = require("express");
const router = express.Router();

const controller = require("../controllers/notification.controller");

router.post("/token/new", controller.addNewNotificationToken);

router.post("/topic/:role", controller.notifyToTopicController);

router.post("/", controller.notifyToUsersController)

router.post("/checkDevice", controller.checkDeviceController)

router.post("/updateToken", controller.updateNotifyTokenController)

module.exports = router;
