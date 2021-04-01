const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const controller = require("../controllers/image.controller");

// Route for AVATAR

router.get("/file/:id", controller.getImageInfoController);

router.get("/:id", controller.showImage);

router.post("/avatar/upload", controller.uploadAvatar);

// router.post("/parking/:parkingId/upload",)

module.exports = router;
