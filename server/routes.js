const express = require("express");
const router = express.Router();

const { authJwt } = require("./middlewares");

router.use("/auth", require("./routes/auth.routes"));

router.use("/user", [authJwt.verifyToken], require("./routes/user.routes"));

router.use("/image", require("./routes/image.routes"));

router.use("/feedback", require("./routes/feedback.routes"));

router.use(
      "/vehicle",
      [authJwt.verifyToken],
      require("./routes/vehicle.routes")
);

router.use(
      "/parking",
      [authJwt.verifyToken, authJwt.isOwner],
      require("./routes/parking.routes")
);

router.use(
      "/adminParking",
      [authJwt.verifyToken, authJwt.isAdmin],
      require("./routes/adminParking.routes")
);

router.use("/parkings", [authJwt.verifyToken], require("./routes/parkings.routes"));

router.use("/notifications", require("./routes/notification"));

router.use(
      "/monitor",
      [authJwt.verifyToken],
      require("./routes/monitorParking.routes")
);

router.use(
      "/likedparking",
      [authJwt.verifyToken],
      require("./routes/likedParkings.routes")
);
// router.use("/avatar", require("./routes/image"));

module.exports = router;
