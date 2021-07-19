const express = require("express");
const router = express.Router();

const { authJwt } = require("../middlewares");
const controller = require("../controllers/likedParkings.controller");


router.post("/", controller.addNewLikedParking);
router.get('/checkLiked', controller.checkIfParkingIsLiked);
router.get('/listParkingsLiked/:userId', controller.getListParkingLikedByUserId)


module.exports = router;
