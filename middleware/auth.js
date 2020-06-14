// 1ST, Bring JWT
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //1st, get the token from the header fromt the request object
  const token = req.header("z-auth-token");

  //2ND, check if there is no token
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token found, authorization DENIED!" });
  }

  //3RD, Verify the token if there is a token
  try {
    // This will decode the token
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //Now get the request and assign it to the user
    req.user = decoded.user;
    //Now call the next function
    next();
  } catch (err) {
    console.error("Oops, middleware auth failed!");
    res.status(500).json({ msg: "Internal server error, jwt token failed" });
  }
};
