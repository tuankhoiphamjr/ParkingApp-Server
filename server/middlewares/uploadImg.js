const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const dbConfig = require("../config/db.config");

var storageAvatar = new GridFsStorage({
  url: dbConfig.URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "avatar",
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

var storageParkingImg = new GridFsStorage({
  url: dbConfig.URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "parking",
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

var uploadFile = multer({ storage: storageAvatar }).single("file");
var uploadMutilFile = multer({ storage: storageParkingImg }).array("files", 10);

var uploadFilesMiddleware = util.promisify(uploadFile);
var uploadMultiFilessMiddleware = util.promisify(uploadMutilFile);


const uploadImage = {
  uploadFilesMiddleware,
  uploadMultiFilessMiddleware,
}
module.exports = uploadImage;
