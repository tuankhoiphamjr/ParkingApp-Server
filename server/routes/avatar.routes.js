const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const controller = require("../controllers/uploadSingleImg.controller");
const dbConfig = require("../config/db.config");

const url = dbConfig.URI;

const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;

connect.once("open", async () => {
  // initialize stream
  gfs = await new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "photo",
  });
});

// Route for AVATAR

// Tạm thời chưa dùng được : phát triển thêm file controllers/uploadSingleImg, middlewares/uploadImg.js
// router.post("/upload", controller.uploadFile);
// Tạm thời chưa dùng được : phát triển thêm

router.get("/file/:id", (req, res, next) => {
  gfs
    .find({ _id: mongoose.Types.ObjectId(req.params.id) })
    .toArray((err, files) => {
      if (!files[0] || files.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No files available",
        });
      }

      res.status(200).json({
        success: true,
        file: files[0],
      });
    });
});

router.get("/:id", (req, res, next) => {
    gfs
      .find({ _id: mongoose.Types.ObjectId(req.params.id) })
      .toArray((err, files) => {
        if (!files[0] || files.length === 0) {
          return res.status(200).json({
            success: false,
            message: "No files available",
          });
        }
  
        if (
          files[0].contentType === "image/jpeg" ||
          files[0].contentType === "image/png" ||
          files[0].contentType === "image/svg+xml"
        ) {
          // render image to browser
          gfs.openDownloadStreamByName(files[0].filename).pipe(res);
        } else {
          res.status(404).json({
            err: "Not an image",
          });
        }
      });
  });

module.exports = router;
