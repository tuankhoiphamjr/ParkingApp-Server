const express = require("express");
const router = express.Router();

const controller = require("../controllers/adminParking.controller");

router.get("/listNeedVerified", controller.getParkingsNeedVerified);

router.post("/verify/:parkingId", controller.verifyParkingController);

router.get("/getNumOfUserAndOwner", controller.getNumOfUserAndOwner);

router.get("/getNumOfParking", controller.getNumOfParking);

router.get("/getNumOfEvaluate", controller.getNumOfEvaluate);

module.exports = router;
