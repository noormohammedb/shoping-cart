var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");

var db = require("./dbconfig/dbConnect")
var session = require("express-session");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");
var cartRouter = require("./routes/cart");
var adminRouter = require("./routes/admin");
var ordersRouter = require("./routes/orders");
const fileUpload = require("express-fileupload");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine("hbs", hbs({
  extname: ".hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layout/",
  partialsDir: __dirname + "/views/partials/",
})
);

app.use(fileUpload({ useTempFiles: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: 'loremispum', cookie: { maxAge: 10 * 60000 } }))

db.dbConnection((error) => {
  if (error) console.log(error);
  else console.log("DataBase Connection Sucess");
});

app.use("/", indexRouter);
app.use("/account", userRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);
app.use("/orders", ordersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
