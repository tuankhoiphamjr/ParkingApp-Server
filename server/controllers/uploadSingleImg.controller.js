const { uploadImage } = require("../middlewares");

exports.uploadFile = async (req, res) => {
  try {
    await uploadImage.uploadFilesMiddleware(req, res);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log(req.file);

    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

// module.exports = {
//   uploadFile: uploadFile
// };