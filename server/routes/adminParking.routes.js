const express = require("express");
const router = express.Router();

const controller = require("../controllers/adminParking.controller");

router.get("/listNeedVerified", controller.getParkingsNeedVerified);

router.post("/verify/:parkingId", controller.verifyParkingController);

router.get("/decline/:parkingId", controller.declineParkingByAdmin);

router.get("/getNumOfUserAndOwner", controller.getNumOfUserAndOwner);

router.get("/getNumOfParking", controller.getNumOfParking);

router.get("/getNumOfEvaluate", controller.getNumOfEvaluate);

router.get("/getUserStatistical/:month&:year", controller.getNumberUserStatisticalByMonth);

router.get("/getNumberBookingStatisticalByDate/:day&:month&:year", controller.getNumberBookingStatisticalByDate);

router.get("/getNumberEvaluateStatisticalByDate/:day&:month&:year", controller.getNumberEvaluateStatisticalByDate);

module.exports = router;
