const express = require("express");
const router = express.Router();

const controller = require("../controllers/monitorParking.controller");

// router.get("/:parkingId", controller.showFeedbackController);
router.post("/", controller.addMonitorParking);

router.get("/getBookingInfo", controller.getBookingInfo);

router.get("/getComingVehicle/:parkingId", controller.getIsComingVehicle);

router.get("/getVehicleInParking/:parkingId", controller.getVehicleInParking);

router.post("/addComingVehicle/:parkingId", controller.addComingVehicleToMonitor);

router.post("/deleteComingVehicle", controller.deleteComingVehicleInMonitor);

router.post("/addNewComingVehicleToMonitor/:parkingId", controller.addNewComingVehicleToMonitor);

router.post("/addOutVehicle/:parkingId", controller.addVehicleHasOutOfParking);

module.exports = router;
