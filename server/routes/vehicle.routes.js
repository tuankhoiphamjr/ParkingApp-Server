const express = require("express");
const router = express.Router();

const controller = require("../controllers/vehicle.controller");

router.get("/", controller.getVehicleInfoController);

router.post("/", controller.addVehicleController);

module.exports = router;
