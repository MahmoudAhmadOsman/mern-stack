const express = require("express");
const router = express.Router();
//To use the auth middleware, bring it to the route you want to protect and add as a 2nd prameter to the route
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route    POST api/auth
// @desc     Register new user
// @access   Public
router.get("/", auth, async (req, res) => {
  //res.send("Auth Route");
  //Now, return some data from the database by making a call to the database
  //Bring the model first
  try {
    //(-password)option will leave the password and will not query password from the database
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    //Send bad request to the user
    res.status(500).send("Interal Server Error");
  }
});

module.exports = router;
