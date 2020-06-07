const express = require("express");
const router = express.Router();

// @route    POST api/auth
// @desc     Register new user
// @access   Public
router.get("/", (req, res) => {
  res.send("Auth Route");
});

module.exports = router;
