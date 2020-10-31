var express = require("express");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperation")


/* GET home page. */
router.get("/", function (req, res, next) {
  let hbsObject = {
    title: "shopping cart",
    admin: false,
  };
  dbOperation.getProduct().then((data) => {
    console.log(data);
    hbsObject.products = data
    res.render("index", hbsObject);
  })
});

router.get('/login', (req, res, next) => {
  res.render("users/login-form", {});
})

router.get('/signup', (req, res) => {
  res.render("users/signup-form", {})
})
module.exports = router;
