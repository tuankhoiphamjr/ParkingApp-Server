const express = require("express");
const router = express.Router();

const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

router.post(
  "/signup",
  [verifySignUp.checkDuplicatePhoneNumber],
  controller.signup
);

router.post("/signin", controller.signin);

router.post("/signout", controller.signout);

router.post("/checkUserExist", controller.checkUserExistController);

module.exports = router;
