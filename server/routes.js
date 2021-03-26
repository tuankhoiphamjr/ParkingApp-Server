const express = require("express");
const router = express.Router();

router.use("/auth", require("./routes/auth.routes"));

router.use("/api/test", require("./routes/user.routes"));

router.use("/avatar", require("./routes/avatar.routes"));

// router.use("/avatar", require("./routes/image"));

module.exports = router;
