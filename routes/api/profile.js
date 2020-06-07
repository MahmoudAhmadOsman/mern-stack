const express = require("express");
const router = express.Router();

// @route    POST api/profile
// @desc     Profile route
// @access   Public
router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;
