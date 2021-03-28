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
      bucketName: "avatar",
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    };
  },
});

var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);

const uploadImage = {
  uploadFilesMiddleware,
}
module.exports = uploadImage;
