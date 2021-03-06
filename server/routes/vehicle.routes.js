const express = require("express");
const router = express.Router();

const controller = require("../controllers/vehicle.controller");

router.get("/", controller.getVehicleInfoController);

router.post("/", controller.addVehicleController);

router.post("/edit", controller.updateVehicleInfo);

router.post("/delete", controller.deleteVehicleInfo);

module.exports = router;
