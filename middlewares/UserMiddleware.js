const validator = require("validator");

const createUserValidation = (req, res, next) => {
  const { username, email, password, passwordConfirm, role } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !passwordConfirm ||
    !role ||
    validator.isEmpty(username) ||
    validator.isEmpty(email) ||
    validator.isEmpty(password) ||
    validator.isEmpty(passwordConfirm) ||
    validator.isEmpty(role)
  ) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  if (
    !validator.isAlphanumeric(username) ||
    !validator.isLength(username, { min: 4, max: 32 })
  ) {
    return res.status(400).json({
      message:
        "Username must be alphanumeric and the length should be between 4 to 32!",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Email invalid." });
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 4,
      maxLength: 100,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message:
        "Password should include lowercase, uppercase, number, special characters, and the length should be between 4 to 100!",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Password inconsistency." });
  }

  if (role !== "user" && role !== "admin") {
    return res.status(400).json({ message: "Role must be user or admin." });
  }
  next();
};

const loginUserValidation = (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    (!username && !email) ||
    !password ||
    (validator.isEmpty(username) && validator.isEmpty(email)) ||
    validator.isEmpty(password)
  ) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  if (
    username &&
    (!validator.isAlphanumeric(username) ||
      !validator.isLength(username, { min: 4, max: 32 }))
  ) {
    return res.status(400).json({
      message:
        "Username must be alphanumeric and the length should be between 4 to 100!",
    });
  }

  next();
};

module.exports = {
  createUserValidation,
  loginUserValidation,
};
