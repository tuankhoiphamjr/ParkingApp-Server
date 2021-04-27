const express = require("express");
const router = express.Router();

const controller = require("../controllers/monitorParking.controller");

// router.get("/:parkingId", controller.showFeedbackController);
router.post("/", controller.addmonitorParking);

module.exports = router;
