const express = require("express");
const router = express.Router();

const { authJwt } = require("./middlewares");

router.use("/auth", require("./routes/auth.routes"));

router.use("/user", require("./routes/user.routes"));

router.use("/avatar", require("./routes/avatar.routes"));

router.use("/parking", [authJwt.verifyToken], require("./routes/parking.routes"));

// router.use("/avatar", require("./routes/image"));

module.exports = router;
