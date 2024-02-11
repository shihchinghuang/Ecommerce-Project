const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const { ObjectId } = require("mongodb");

const displayAll = async (req, res) => {
  if (req.isAdmin) return res.redirect("/admin");

  try {
    const page = parseInt(req.query.page) || 1;

    // limit: sets the maximum 9 products to display per page.
    const limit = parseInt(req.query.limit) || 9;

    /*
    skip: calculates the number of products to skip for next page
    if the user is on page 2 and the limit is 9, the calculation would be: skip = (2 - 1) * 9 = 9
    means the query would skip the first 9 products to fetch the products for page 2.
    */
    const skip = (page - 1) * limit;
    const filter = {};

    /*
    { $in: arr }: MongoDB $in operator
    checks whether the value of the type or brand field is present in the array arr.
    */
    if (req.query.type) {
      const arr = Array.isArray(req.query.type)
        ? req.query.type
        : [req.query.type];
      filter.type = { $in: arr };
    }

    if (req.query.brand) {
      const arr = Array.isArray(req.query.brand)
        ? req.query.brand
        : [req.query.brand];
      filter.brand = { $in: arr };
    }

    const products = await Product.find(filter).skip(skip).limit(limit);

    let user;
    if (req.isLoggedIn) {
      user = await User.findById(req.userId)
        .select("likedProducts")
        .populate("likedProducts");
    }
    if (!products.length) {
      return res.render("productNotFound", {
        favorites: user?.likedProducts || [],
        isLoggedIn: req.isLoggedIn,
      });
    }

    res.render("index", {
      products,
      page,
      limit,
      isLoggedIn: req.isLoggedIn,
      favorites: user?.likedProducts || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const displayDetail = async (req, res) => {
  if (req.isAdmin) {
    return res.redirect("/admin");
  }
  const productId = req.params.productId;

  try {
    // Convert the string productId to a valid ObjectId
    const validObjectId = new ObjectId(productId);

    // Fetch product details using the valid ObjectId
    const targetProduct = await Product.findById(validObjectId);
    const allProducts = await Product.find({});
    const sameBrandProducts = allProducts.filter(
      (product) =>
        product["brand"] === targetProduct["brand"] &&
        product["name"] !== targetProduct["name"]
    );
    const user = await User.findById(req.userId)
      .select("likedProducts")
      .populate("likedProducts");
    if (!targetProduct) {
      res.render("productNotFound", {
        favorites: user?.likedProducts || [],
        isLoggedIn: req.isLoggedIn,
      });
    }
    res.render("productDetail", {
      targetProduct,
      sameBrandProducts,
      isLoggedIn: req.isLoggedIn,
      favorites: user?.likedProducts || [],
    });
  } catch (error) {
    console.log("err", error);
    res.render("productNotFound", {
      favorites: [],
      isLoggedIn: req.isLoggedIn,
    });
  }
};

const likeProduct = async (req, res) => {
  if (req.isAdmin) {
    return res.redirect("/admin");
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { likedProducts: req.body.productId },
    });
    res.redirect("back");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};

const unlikeProduct = async (req, res) => {
  if (req.isAdmin) {
    return res.redirect("/admin");
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      $pull: { likedProducts: req.body.productId },
    });
    res.redirect("back");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};

module.exports = {
  displayAll,
  displayDetail,
  likeProduct,
  unlikeProduct,
};
