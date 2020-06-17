const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const c = require("config");

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

//s4-v17

// @route    POST api/profile/profile
// @desc     Create & update user profile
// @access   Private

//1st bring the auth middleware into the route
//2nd bring the validator
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required!").not().isEmpty(),
      check("skills", "Skills are required!").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Get all the request from req.body
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    //Now, Create profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    console.log(profileFields.skills);
    res.send("skills");
  }
);

module.exports = router;
