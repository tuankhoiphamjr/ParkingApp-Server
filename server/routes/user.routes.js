const express = require("express");
const router = express.Router();

const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

// router.get("/api/test/all", controller.allAccess);

// router.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

// router.get(
//   "/api/test/mod",
//   [authJwt.verifyToken, authJwt.isModerator],
//   controller.moderatorBoard
// );

// router.get(
//   "/api/test/admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   controller.adminBoard
// );

router.post("/changePassword", controller.changePassword);

router.post("/updateInfo", controller.updateUserInfo);

router.get("/getUserInfoById/:userId", controller.getUserInfoById);

router.get("/getUserInfoByIdForUser", controller.getUserInfoByIdForUser);

router.get("/", controller.getAllUserInfos);

router.post("/password/update", controller.updateNewPassword);

module.exports = router;
