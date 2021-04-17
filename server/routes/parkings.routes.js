const express = require("express");
const router = express.Router();

const controller = require("../controllers/parking.controller");

router.get("/all", controller.getAllVerifiedParkingInfoController);

module.exports = router;
