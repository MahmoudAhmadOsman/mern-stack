const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");
// Bring the model
const User = require("../../models/User");

// @route    POST api/users
// @desc     User Registeration route
// @access   Public
//1. validate user's name, email and password before inserting to the database
router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("email", "A valid email is required!").isEmail(),
    check("password", "Enter password with 8 or more characters!").isLength({
      min: 8,
    }),
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
    const { name, email, password } = req.body;
    try {
      // Check if th user exists in the database
      let user = await User.findOne({
        email,
      });

      //If user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists in the database" }] });
      }

      // Get Users Gravatar from their email and setup the size of the avatar to 180 px
      const avatar = gravatar.url(email, {
        s: "180",
        r: "pg",
        d: "mm",
      });

      // Now, create instance of user or create new USER
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt password before inserting it to the database

      //1st create salt
      const salt = await bcrypt.genSalt(10);

      // Now hash the password after creating salt
      user.password = await bcrypt.hash(password, salt);

      //Now save the user into the database using save () function
      await user.save();

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
          expiresIn: 38000,
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
      res.status(500).send("Internal Server Error!!!");
    }
  }
);

module.exports = router;
