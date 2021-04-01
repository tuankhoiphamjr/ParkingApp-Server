const mongoose = require("mongoose");

const { uploadImage } = require("../middlewares");
const db = require("../models");
const Image = db.image;

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
    bucketName: "image",
  });
});

exports.uploadFile = async (req, res) => {
  try {
    await uploadImage.uploadFilesMiddleware(req, res);

    // if (req.file == undefined) {
    //   return res.send(`You must select a file.`);
    // }
    // console.log(req.file);

    let newImage = new Image({
      filename: req.file.filename,
      fileId: req.file.id,
      type: req.body.type,
    });

    newImage
      .save()
      .then((image) => {
        res.status(200).json({
          success: true,
          image,
        });
      })
      .catch((err) => res.status(500).json(err));

    // return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: `Error when trying upload image: ${error}` });
  }
};

exports.getImageInfoController = async (req, res) => {
  await gfs
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
};

exports.showImage = async (req, res) => {
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
};
