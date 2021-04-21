

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'parking_app_hcmut';
const path = require('path')
// The path to your file to upload


// The new ID for your GCS file


// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
// const GOOGLE_CLOUD_PROJECT_ID = 'parking-user-app'; // Replace with your project ID
// const GOOGLE_CLOUD_KEYFILE = 'D:/LuanVan/ParkingAppForOwner/parking-user-app-d07cfd63b920.json'; // Replace with the path to the downloaded private key

// Creates a client
exports.storage = new Storage({
  projectId: 'parking-user-app',
  keyFilename: path.join(__dirname, '../../parking-user-app-d07cfd63b920.json'),
});


exports.getPublicUrl = (fileName) => `https://storage.googleapis.com/parking_app_hcmut/${fileName}`;

	
exports.copyFileToGCS = (localFilePath,  options) => {
  options = options || {};

  const bucket = storage.bucket('parking_app_hcmut');
  const fileName = path.basename(localFilePath);
  const file = bucket.file(fileName);
  const destFileName =  `${new Date().getTime()}_${fileName}`
  return bucket.upload(localFilePath, {
    destination: destFileName,
  })
    .then(() => file.makePublic())
    .then(() => exports.getPublicUrl(gcsName));
};

