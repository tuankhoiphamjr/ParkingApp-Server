const express = require("express");
const router = express.Router();

const controller = require("../controllers/feedback.controller");

router.get("/:parkingId", controller.showFeedbackOfParkingController);

router.post("/:parkingId", controller.addFeedbackToParkingOwner);

module.exports = router;
