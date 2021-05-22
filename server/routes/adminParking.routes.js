const express = require("express");
const router = express.Router();

const controller = require("../controllers/parking.controller");

router.get("/listNeedVerified", controller.getParkingsNeedVerified);

router.post("/verify/:parkingId", controller.verifyParkingController);

module.exports = router;
