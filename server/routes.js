const express = require("express");
const router = express.Router();

const { authJwt } = require("./middlewares");

router.use("/auth", require("./routes/auth.routes"));

router.use("/user", [authJwt.verifyToken], require("./routes/user.routes"));

router.use("/image", require("./routes/image.routes"));

router.use("/feedback", require("./routes/feedback.routes"));

router.use("/vehicle",[authJwt.verifyToken], require("./routes/vehicle.routes"));

router.use(
      "/parking",
      [authJwt.verifyToken, authJwt.isOwner],
      require("./routes/parking.routes")
);

router.use("/parkings", require("./routes/parkings.routes"));

router.use("/notifications", require("./routes/notification"));

// router.use("/avatar", require("./routes/image"));

module.exports = router;
