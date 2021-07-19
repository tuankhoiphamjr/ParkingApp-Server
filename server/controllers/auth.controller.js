const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const config = require("../config/auth.config");
const userServices = require("../services/user.service");

exports.signup = async (req, res) => {
  let { phoneNumber, password, role, firstName, lastName, email, avatar } = req.body;

  let { result, status } = await userServices.createUser(
    phoneNumber,
    bcrypt.hashSync(password, 8),
    role,
    firstName,
    lastName,
    email,
    avatar
  );

  if (!status) {
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
  res.status(200).json(result);
};

exports.signin = async (req, res) => {
  let phoneNumber = req.body.phoneNumber;
  let role = req.body.role;
  let tempResult = await userServices.getUserByPhoneNumberAndRole(
    phoneNumber,
    role
  );

  if (!tempResult.status) {
    return res.status(400).send({ status: false, message: tempResult.message });
  }

  let { result, status } = tempResult;

  let passwordCompareCheck = await userServices.comparePassword(
    req.body.password,
    result.password
  );

  if (!passwordCompareCheck.status) {
    return res.status(400).send({
      status: false,
      message: passwordCompareCheck.message,
    });
  }

  await userServices.setUserStatus(mongoose.Types.ObjectId(result._id), true);

  let token = await jwt.sign({ id: result._id }, config.secret, {
    expiresIn: 10*60*60*1000, // 24 hours
  });

  // Pass token to response
  res.status(200).send({
    result,
    accessToken: token,
  });
};

// Sign Out - Change the active status
exports.signout = async (req, res) => {
  let userId = req.body.id;
  let { message, status } = await userServices.setUserStatus(
    mongoose.Types.ObjectId(userId),
    false
  );
  res.status(200).send({ message, status });
};

exports.checkUserExistController = async (req, res) => {
  let { phoneNumber, role } = req.body;
  let result = await userServices.checkUserExist(phoneNumber, role);
  return res
    .status(200)
    .send({ status: result.status, message: result.message });
};
