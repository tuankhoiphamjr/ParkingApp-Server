const express = require("express");
const router = express.Router();

const controller = require("../controllers/feedback.controller");

router.get("/:parkingId", controller.showFeedbackController);
router.post("/:parkingId", controller.addFeedbackToParkingOwner);

module.exports = router;
