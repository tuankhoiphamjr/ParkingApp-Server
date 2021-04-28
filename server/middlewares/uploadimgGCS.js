const gcsHelpers = require("../helpers/google-cloud-storage");

const { storage } = gcsHelpers;

const DEFAULT_BUCKET_NAME = "parking_app_hcmut"; // Replace with the name of your bucket

/**
 * Middleware for uploading file to GCS.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
exports.sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const bucketName = DEFAULT_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const gcsFileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsFileName);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on("error", (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on("finish", () => {
    req.file.cloudStorageObject = gcsFileName;

    return file.makePublic().then(() => {
      req.file.gcsUrl = `https://storage.googleapis.com/parking_app_hcmut/${gcsFileName}`;
      next();
    });
  });

  stream.end(req.file.buffer);
};
exports.sendMultiUploadToGCS = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  let promises = [];
  let vals = Object.values(req.files);

  for (let f of vals) {
    const bucketName = DEFAULT_BUCKET_NAME;
    const gcsname = new Date().getTime() + f.originalname;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
      metadata: {
        contentType: f.mimetype,
      },
      resumable: false,
    });

    stream.on("error", (err) => {
      f.cloudStorageError = err;
      next(err);
    });

    stream.end(f.buffer);

    promises.push(
      new Promise((resolve, reject) => {
        stream.on("finish", () => {
          f.cloudStorageObject = gcsname;
          file.makePublic().then(() => {
            f.gcsUrl = `https://storage.googleapis.com/parking_app_hcmut/${gcsname}`;
            resolve();
          });
        });
      })
    );
  }
  Promise.all(promises).then(() => next());
};
