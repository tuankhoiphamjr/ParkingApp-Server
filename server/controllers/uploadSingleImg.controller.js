const { uploadImage } = require("../middlewares");
const db = require("../models");
const Avatar = db.avatar;

exports.uploadFile = async (req, res) => {
  try {
    await uploadImage.uploadFilesMiddleware(req, res);

    // if (req.file == undefined) {
    //   return res.send(`You must select a file.`);
    // }
    // console.log(req.file);

    let newAvatar = new Avatar({
      filename: req.file.filename,
      fileId: req.file.id,
    });

    newAvatar
      .save()
      .then((avatar) => {
        res.status(200).json({
          success: true,
          avatar,
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

// module.exports = {
//   uploadFile: uploadFile
// };
