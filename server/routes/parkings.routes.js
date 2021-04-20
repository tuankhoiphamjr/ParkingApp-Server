const express = require("express");
const router = express.Router();

const controller = require("../controllers/parking.controller");

router.get("/all", controller.getAllVerifiedParkingInfoController);

router.get("/all/getinfo/:ownerId", controller.getParkingsOfOwnerController);

router.get("/admin/verify/:parkingId", controller.verifyParkingController);

module.exports = router;
