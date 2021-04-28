const express = require("express");
const router = express.Router();

const controller = require("../controllers/monitorParking.controller");

// router.get("/:parkingId", controller.showFeedbackController);
router.post("/", controller.addmonitorParking);

router.get("/:parkingId", controller.getIsComingVehicle);

router.post("/addComingVehicle", controller.addComingVehicleToMonitor);

module.exports = router;
