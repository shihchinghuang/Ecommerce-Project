require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (id, username, isAdmin) => {
  const token = jwt.sign(
    { id, username, isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

module.exports = generateToken;
