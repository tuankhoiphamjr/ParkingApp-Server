const tokenServices = require("../services/notifyToken.service");

const serviceAccount = require("../../firebase.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Notify to Topic (all, user, owner)
exports.notifyToTopicController = async (req, res) => {
  let role = req.params.role;
  let topic = role;
  try {
    const { title, body, imageUrl, sendUserId } = req.body;
    await admin.messaging().send({
      topic: topic,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
    res
      .status(200)
      .json({ message: `Successfully sent notifications! to topic ${topic}` });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
  }
};

exports.addNewNotificationToken = async (req, res) => {
  let { deviceId, token, userId, role } = req.body;

  // Check if device has been registered
  let isDeviceRegister = await tokenServices.getTokenByUserIdAndDeviceId(
    userId,
    deviceId
  );
  if (isDeviceRegister.status) {
    return res
      .status(400)
      .send({ status: false, message: "Device has been registered" });
  }

  let { result, status } = await tokenServices.createToken(
    deviceId,
    token,
    userId,
    role
  );

  if (!status) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).json({ status: true, result: result });
};

exports.notifyToUsersController = async (req, res) => {
  try {
    const { receivedUsersId, title, body, imageUrl } = req.body;
    let tokens = await tokenServices.getTokensByUsersIdArray(receivedUsersId);
    // await admin.messaging().sendMulticast({
    //   tokens,
    //   notification: {
    //     title,
    //     body,
    //     imageUrl,
    //   },
    // });
    res.status(200).json({
      message: `Successfully sent notifications to user has id: ${receivedUsersId}`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
  }
};

exports.checkDeviceController = async (req, res) => {
  const { userId, deviceId } = req.body;
  let result = await tokenServices.getTokenByUserIdAndDeviceId(
    userId,
    deviceId
  );
  if (!result.status) {
    return res
      .status(500)
      .json({ message:"Device has not been registered yet", status: false });
  }
  return res.status(200).json({
    message: `Device has been registered`,
    status: true,
  });
};