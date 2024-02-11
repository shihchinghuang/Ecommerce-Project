require("dotenv").config();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const auth = (req, res, next) => {
  // get token from header
  const token = req.cookies.token;
  if (!token || validator.isEmpty(token)) {
    return res.render("unauthorized", { isLoggedIn: false });
  }

  // decode token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded.id || !validator.isMongoId(decoded.id)) {
    return res.render("unauthorized", { isLoggedIn: false });
  }

  // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions
  req.user = decoded;

  next();
};

// check if there is a token stored in the cookies of the request
const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token || validator.isEmpty(token)) {
    req.isLoggedIn = false;
  } else {
    try {
      // decode the JWT token
      // token: the token to be decoded
      // process.env.ACCESS_TOKEN_SECRET: the secret key used during the token's creation.
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // if decoded.id exists and is a valid MongoDB ObjectId, it means the token contains valid user information
      // decoded.id is the user's ID that is stored in the JWT (JSON Web Token)
      if (decoded.id && validator.isMongoId(decoded.id)) {
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin;
        req.isLoggedIn = true;
      } else {
        req.isLoggedIn = false;
      }
    } catch (error) {
      req.isLoggedIn = false;
    }
  }
  next();
};

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.role !== "admin") {
    res.render("unauthorized", { isLoggedIn: true });
  } else {
    next();
  }
};

module.exports = { auth, isLoggedIn, isAdmin };
