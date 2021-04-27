const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Maximum file size is 10MB
    fieldSize: 25 * 1024 * 1024
  },
});

const controller = require("../controllers/image.controller");
const { authJwt, uploadimgGCS } = require("../middlewares");

// Route for AVATAR

router.get("/file/:id", controller.getImageInfoController);

router.post(
  '/uploadimg',
  multer.single('image'),
  uploadimgGCS.sendUploadToGCS,
  (req, res, next) => {
    console.log("sss", req.file);
    if (req.file && req.file.gcsUrl) {
      return res.send(req.file.gcsUrl);
    }
    return res.status(500).send('Unable to upload');
  },
);
router.post('/uploadmultiimgs', multer.array('images', 15), uploadimgGCS.sendMultiUploadToGCS, (req, res, next)=>{
  if(req.files && req.files[0].gcsUrl){
    return res.status(200).send(req.files.map(item =>  item.gcsUrl))
  }
  else{
    return res.status(500).send('Unable to upload');
  }
})

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
