const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  displayAdminPage,
} = require("../controllers/UserController");
const {
  createUserValidation,
  loginUserValidation,
} = require("../middlewares/UserMiddleware");
const { isLoggedIn, isAdmin, auth } = require("../middlewares/AuthMiddleware");

router
  .get("/signup", isLoggedIn, (req, res) => {
    if (req.isLoggedIn) {
      res.redirect("/");
      return;
    }
    res.render("signup", { isLoggedIn: false });
  })
  .post("/signup", createUserValidation, signup)
  .get("/login", isLoggedIn, (req, res) => {
    if (req.isLoggedIn) {
      res.redirect("/");
      return;
    }
    res.render("login", { isLoggedIn: false });
  })
  .post("/login", loginUserValidation, login)
  .get("/logout", logout)
  .get("/admin", auth, isAdmin, displayAdminPage);

module.exports = router;
