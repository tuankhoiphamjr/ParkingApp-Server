const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { uploadImage } = require("../middlewares");
const db = require("../models");
const AvatarImage = db.avatarImage;
const ParkingImage = db.parkingImage;
const User = db.user;
const Parking = db.parking;

const dbConfig = require("../config/db.config");
const url = dbConfig.URI;

const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs_avatar;
let gfs_parkingImg;

connect.once("open", async () => {
  // initialize stream
  gfs_avatar = await new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "avatar",
  });

  gfs_parkingImg = await new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "parking",
  });
});

exports.uploadAvatar = async (req, res) => {
  try {
    await uploadImage.uploadFilesMiddleware(req, res);
    let userId = req.userId;
    let avatarId = req.file.id;
    // if (req.file == undefined) {
    //   return res.send(`You must select a file.`);
    // }
    // console.log(req.file);

    // let newAvatar = new AvatarImage({
    //   filename: req.file.filename,
    //   fileId: req.file.id,
    // });

    await User.findOneAndUpdate(
      { _id: ObjectId(userId) },
      { avatar: avatarId },
      (err, data) => {
        if (err) {
          result = { message: err, status: false };
        }
        result = { message: "Success", status: true };
      }
    );

    // return res.send(`File has been uploaded.`);
    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: `Error when trying upload image: ${error}` });
  }
};

exports.getImageInfoController = async (req, res) => {
  await gfs_avatar
    .find({ _id: ObjectId(req.params.id) })
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
};

exports.showAvatarImage = async (req, res) => {
  gfs_avatar
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
        gfs_avatar.openDownloadStreamByName(files[0].filename).pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    });
};

exports.uploadParkingImg = async (req, res) => {
  try {
    await uploadImage.uploadMultiFilessMiddleware(req, res);

    let parkingId = req.params.parkingId;
    let files = req.files;
    let imageIdArray = [];

    files.forEach((image) => {
      imageIdArray.push({id: ObjectId(image.id)});
    });

    // console.log(imageIdArray)
    // console.log(req.files);

    // if (req.file == undefined) {
    //   return res.send(`You must select a file.`);
    // }
    // req.files.map((image) => {
    //   let newParkingImages = new ParkingImage({
    //     filename: image.filename,
    //     fileId: image.id,
    //   });

    //   newParkingImages.save().catch((err) => res.status(500).json(err));
    // });
    await Parking.updateOne(
      { _id: ObjectId(parkingId) },
      {
        $addToSet: { parkingImgId: { $each: imageIdArray }, },
      },
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: err, status: false });
        }
      }
    );

    return res.status(200).json({
      status: true,
    });
    // return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: `Error when trying upload image: ${error}` });
  }
};

exports.showParkingImage = async (req, res) => {
  gfs_parkingImg
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
        gfs_parkingImg.openDownloadStreamByName(files[0].filename).pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    });
};
