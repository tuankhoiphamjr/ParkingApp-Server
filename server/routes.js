const express = require("express");
const router = express.Router();

router.use("/auth", require("./routes/auth.routes"));

router.use("/api/test", require("./routes/user.routes"));

module.exports = router;
