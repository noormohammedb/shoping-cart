var express = require("express");
var router = express.Router();
var dbOpeUsers = require("../dbconfig/dbOperationAccount")
const bcrypt = require('bcrypt');


router.get('/login', (req, res, next) => {
  res.render("users/login-form", {});
})
router.post('/login', async (req, res) => {
  console.log(req.body);
  console.log(req.body.password);
  let dbRes = await dbOpeUsers.login(req.body);
  // console.log(dbRes);
  console.log(dbRes.length);
  if (dbRes.length) {
    bcrypt.compare(req.body.password, dbRes[0].password).then((compareResult) => {
      if (compareResult) {
        console.log('password matched');
        req.session.isLogedin = true;
        req.session.userData = dbRes[0];
        res.redirect('/');
      } else {
        console.log(compareResult);
        console.log('password missmatch');
        res.render("users/login-form", { warning: 'Wrong Password' });
      }
    })
  } else {
    console.log('no user found');
    res.render("users/login-form", { warning: 'No User Found' });
  }
})

router.get('/signup', (req, res) => {
  res.render("users/signup-form", {})
})

router.post('/signup', async (req, res) => {
  console.log(req.body);
  req.body.password = await bcrypt.hash(req.body.password, 10)
  dbOpeUsers.signup(req.body).then((dbRes) => {
    console.log(dbRes.ops);
    res.redirect('/account/login')
  })
})

router.get('/logout', (req, res) => {
  delete req.session.isLogedin;
  delete req.session.userData;
  res.redirect('/')

})
module.exports = router;
