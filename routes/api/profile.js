const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route    POST api/profile/me -> all profiles route
// @desc     Get the logged in user profile info
// @access   Private

//Bring auth middleware to protect this private route
router.get("/me", auth, async (req, res) => {
  try {
    //res.send("Profile Route");
    //Create a variable that hold all the info of the profile from the database

    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populate("user", ["name", "avatar"]); // populate with user name and image

    // Now, if there is no profile
    if (!profile) {
      return res.status(400).json({ msg: "No Profile Found!" });
    }
    //But, if there is a profile, send the profile with info
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
