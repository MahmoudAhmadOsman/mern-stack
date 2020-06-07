const express = require("express");
const router = express.Router();

// @route    POST api/users
// @desc     users route
// @access   Public
router.get("/", (req, res) => {
  res.send("Users Route");
});

module.exports = router;
