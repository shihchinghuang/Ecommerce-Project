const { Schema, model } = require("mongoose");
const refType = Schema.Types.ObjectId;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  likedProducts: [{ type: refType, ref: "Product" }],
});

const User = model("User", UserSchema, "User");
module.exports = User;
