const express = require("express");
const router = express.Router();

const controller = require("../controllers/monitorParking.controller");

// router.get("/:parkingId", controller.showFeedbackController);
router.post("/", controller.addmonitorParking);

router.get("/:parkingId", controller.getIsComingVehicle);

router.get("/getVehicleInParking/:parkingId", controller.getVehicleInParking);

router.post("/addComingVehicle", controller.addComingVehicleToMonitor);

router.post("/deleteComingVehicle", controller.deleteComingVehicleInMonitor);

router.post("/addNewVehicleToMonitor", controller.addNewComingVehicleToMonitor);

module.exports = router;
