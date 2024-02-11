const router = require("express").Router();
const user = require("./UserRouter");
const products = require("./ProductRouter");

router.get("/", (_req, res) => {
  res.redirect("/products?page=1");
});

router.use(user);
router.use(products);

module.exports = router;
