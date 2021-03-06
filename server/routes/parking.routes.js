const express = require("express");
const router = express.Router();

const controller = require("../controllers/parking.controller");

router.post("/new", controller.addNewParkingPlaceController);

router.get("/:parkingId", controller.getParkingInfoController);

router.post("/updateCurrentSlots/:parkingId", controller.updateParkingCurrentSlotsForOwner);

router.post("/:parkingId/update_1", controller.firstUpdateParkingInfoController);

router.post("/reservation/:parkingId", controller.reservationController);

router.post("/delete/:parkingId", controller.deleteParkingController);

router.post("/change/status", controller.changeParkingStatusController)

module.exports = router;
