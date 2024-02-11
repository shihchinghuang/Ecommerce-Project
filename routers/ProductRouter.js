const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {
  displayAll,
  displayDetail,
  likeProduct,
  unlikeProduct,
} = require("../controllers/ProductController");
const { isLoggedIn, auth } = require("../middlewares/AuthMiddleware");

router
  .use(bodyParser.urlencoded({ extended: true }))
  .get("/products", isLoggedIn, displayAll)
  .get("/products/details/:productId", isLoggedIn, displayDetail)
  .post("/likeProduct", auth, likeProduct)
  .post("/unlikeProduct", auth, unlikeProduct);

module.exports = router;
