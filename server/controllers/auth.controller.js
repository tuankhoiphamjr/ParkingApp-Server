const config = require("../config/auth.config");
const db = require("../models");
const userServices = require("../services/user.service");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user, mongoose } = require("../models");

exports.signup = async (req, res) => {
  let { phoneNumber, password, role } = req.body;
  let { result, status } = await userServices.createUser(
    phoneNumber,
    bcrypt.hashSync(password, 8),
    role
  );

  if (!status) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).json(result);
};

exports.signin = async (req, res) => {
  let phoneNumber = req.body.phoneNumber;
  let tempResult = await userServices.getUserByPhoneNumber(phoneNumber);

  if (!tempResult.status) {
    res.status(404).send({message: tempResult.message})
  }

  let {result, status} = tempResult;

  let passwordCompareCheck = await userServices.comparePassword(req.body.password, result.password)

  if(!passwordCompareCheck.status) {
    return res.status(401).send({
      message : passwordCompareCheck.message
    });
  }

  await userServices.setUserStatus(
    mongoose.Types.ObjectId(result._id),
    true
  );

  let token = await jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, // 24 hours
  });

  // Pass token to response
  res.status(200).send({
    result,
    accessToken: token
  });

};

// Sign Out - Change the active status
exports.signout = async (req, res) => {
  let userId = req.body.id;
  let { message, status } = await userServices.setUserStatus(
    mongoose.Types.ObjectId(userId),
    false
  );
  res.status(200).json({ message });
};
