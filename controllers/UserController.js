const User = require("../models/UserModel.js");
const argon2 = require("argon2");
const generateToken = require("../utils/generateToken.js");
const { isLoggedIn } = require("../middlewares/AuthMiddleware.js");

const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // check if username or email already exists
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateUsername || duplicateEmail) {
      return res
        .status(409)
        .json({ message: "Username or email already exists." });
    }

    // hash password
    const hashedPassword = await argon2.hash(password);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // generate JWT token
    const token = generateToken(user._id, username);

    // send token in cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // send token in response
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // check if username or email exists
    const userByUsername = await User.findOne({ username })
      .select("password role")
      .lean()
      .exec();
    const userByEmail = await User.findOne({ email })
      .select("password role")
      .lean()
      .exec();

    if (!userByUsername && !userByEmail) {
      return res
        .status(401)
        .json({ message: "This username or email is not found." });
    }

    // check if password is correct if the user login by username
    const isPasswordCorrectByUsername =
      userByUsername &&
      (await argon2.verify(userByUsername.password, password));

    // check if password is correct if the user login by email
    const isPasswordCorrectByEmail =
      userByEmail && (await argon2.verify(userByEmail.password, password));

    // not logging successfully by username or email
    if (
      (userByUsername && !isPasswordCorrectByUsername) ||
      (userByEmail && !isPasswordCorrectByEmail)
    ) {
      return res.status(401).json({ message: "Password incorrect." });
    }

    // generate JWT token
    const token =
      (userByUsername &&
        generateToken(
          userByUsername._id,
          username,
          userByUsername.role === "admin"
        )) ||
      (userByEmail &&
        generateToken(userByEmail._id, email, userByEmail.role === "admin"));

    // send token in cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // send token in response
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const logout = (_req, res) => {
  try {
    // clear cookie in browser;
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const displayAdminPage = async (_req, res) => {
  const users = await User.find({ role: "user" })
    .select("-password")
    .populate("likedProducts");
  res.render("admin", { users, isLoggedIn });
};

module.exports = { signup, login, logout, displayAdminPage };
