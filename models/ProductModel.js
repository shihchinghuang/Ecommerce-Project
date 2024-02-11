const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: {
    type: String,
  },
  brand: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Product = model("Product", ProductSchema, "Product");
module.exports = Product;
