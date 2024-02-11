const express = require("express");
const cookieParser = require("cookie-parser");
const _connection = require("./config/db");
const UserRouter = require("./routers/UserRouter");
const router = require("./routers/index");
const app = express();

app.listen(3000, () => {
  console.log("Server running");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(router);
app.use("/api/user", UserRouter);

app.all("*", (req, res) => {
  res.status(400).json({
    error: "InvalidURI",
    description: `The URI ${req.url} is not valid.`,
  });
});
