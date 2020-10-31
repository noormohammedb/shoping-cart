var express = require("express");
var router = express.Router();
var dbOpeUsers = require("../dbconfig/dbOperationAccount")


router.get('/login', (req, res, next) => {
  res.render("users/login-form", {});
})
router.post('/login', (req, res) => {
  console.log(req.body);
  dbOpeUsers.login(req.body).then((dbRes) => {
    console.log(dbRes);
    console.log(dbRes.length);
    if (dbRes.length) {

      if (dbRes[0].password === req.body.password) {
        console.log('password matched');
        res.send('logedin')
      } else {
        console.log('password missmatch');
        res.send('password missmatch')
      }
    } else {
      console.log('no user found');
      res.send('no user found')
    }
  })
})

router.get('/signup', (req, res) => {
  res.render("users/signup-form", {})
})

router.post('/signup', (req, res) => {
  console.log(req.body);
  dbOpeUsers.signup(req.body).then(console.log)
})
module.exports = router;
