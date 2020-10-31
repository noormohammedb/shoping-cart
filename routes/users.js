var express = require("express");
const { route } = require(".");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperation")


router.get('/login', (req, res, next) => {
  res.render("users/login-form", {});
})
router.post('/login', (req, res) => {
  console.log(req.body);
})

router.get('/signup', (req, res) => {
  res.render("users/signup-form", {})
})

router.post('/signup', (req, res) => {
  console.log(req.body);
})
module.exports = router;
