const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
//To use the auth middleware, bring it to the route you want to protect and add as a 2nd prameter to the route
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route    POST api/auth
// @desc     Register new user
// @access   Public

//            auth is a function that inside the route/api
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

//====================================
/*******************LOGIN Page**************************/
//====================================

// @route    POST api/auth
// @desc     Authenticate user and also get token
// @access   Public
//1. validate user's name, email and password before inserting to the database
router.post(
  "/",
  [
    check("email", "A valid email is required!").isEmail(),
    check("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    //console.log(req.body);
    //2. set error 2nd
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Display error using array() method
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request instead of saying req.name.body etc
    const { email, password } = req.body;
    try {
      // Check if th user exists in the database
      let user = await User.findOne({
        email,
      });

      //If there is not user
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials!" }] });
      }

      //Now, check user's password and see if it matches the password stored in the database, but first bring in bcrypt lib

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials!" }] });
      }

      /*
          ========================
            Start of jwt
          ========================
  */
      // Finally, Return jsonwebtoken

      //res.send("Users registered");
      const payload = {
        user: {
          id: user.id,
        },
      };
      //Then use sign (pram1 , pram2) function which expects 2 params

      // Bring the config that holds the jwt secret value
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 3800,
        },
        (error, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      /*
========================
  End of jwt
========================
*/
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
