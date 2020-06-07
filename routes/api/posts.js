const express = require("express");
const router = express.Router();

// @route    POST api/posts
// @desc     posts route
// @access   Public
router.get("/", (req, res) => {
  res.send("Posts Route");
});

module.exports = router;
