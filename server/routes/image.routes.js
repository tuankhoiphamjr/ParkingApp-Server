const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const controller = require("../controllers/image.controller");
const { authJwt } = require("../middlewares");

// Route for AVATAR

router.get("/file/:id", controller.getImageInfoController);

router.get("/avatar/:id", controller.showAvatarImage);

router.post("/avatar/upload", [authJwt.verifyToken], controller.uploadAvatar);

router.post(
  "/avatar/del/:id",
  [authJwt.verifyToken],
  controller.deleteAvatarFile
);

// Route for Parking Image

router.get("/parking/:id", controller.showParkingImage);

router.post(
  "/parking/upload/:parkingId",
  [authJwt.verifyToken, authJwt.isOwner],
  controller.uploadParkingImg
);

module.exports = router;
