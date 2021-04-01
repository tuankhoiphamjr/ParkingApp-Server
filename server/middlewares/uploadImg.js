const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const dbConfig = require("../config/db.config");

var storage = new GridFsStorage({
  url: dbConfig.URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "image",
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadMutilFile = multer({ storage: storage }).array("file", 10);

var uploadFilesMiddleware = util.promisify(uploadFile);

const uploadImage = {
  uploadFilesMiddleware,
  uploadMutilFile,
}
module.exports = uploadImage;
