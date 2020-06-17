// 1ST, Bring JWT
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //1st, get the token from the header fromt the request object

  const token = req.header("x-auth-token");

  //2ND, check if there is no token found
  if (!token) {
    return res.status(401).json({
      msg: "No token found, authorization denied! (middleware)",
    });
  }

  //3RD, Verify the token if there is a token
  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({
          msg: "Token is not valid",
        });
      } else {
        //Now get the request and assign it to the user
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("Internal server error, jwt token failed");
    res.status(500).json({ msg: "Server Error" });
  }
};
