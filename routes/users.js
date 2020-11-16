var express = require("express");
var router = express.Router();
var dbOpeUsers = require("../dbconfig/dbOperationAccount")
const bcrypt = require('bcrypt');


router.get('/login', (req, res, next) => {
  if (req.session.userData) {
    console.log('login redirect to home');
    res.redirect('/')
  } else {
    res.render("users/login-form", {});
  }
})
router.post('/login', async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.password);
  let dbRes = await dbOpeUsers.login(req.body);
  // console.log(dbRes);
  // console.log(dbRes.length);
  if (dbRes.length) {
    bcrypt.compare(req.body.password, dbRes[0].password).then((compareResult) => {
      if (compareResult) {
        console.log('password matched');
        req.session.isLogedin = true;
        req.session.userData = dbRes[0];
        console.log(dbRes[0]);
        if (dbRes[0].isAdmin) {
          req.session.isAdmin = true;
        }
        console.log(req.session);
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
  if (req.session.userData) {
    console.log('signup redirect to home');
    res.redirect('/')
  } else {
    res.render("users/signup-form", {})
  }
})

router.post('/signup', async (req, res) => {
  // console.log(req.body);
  req.body.password = await bcrypt.hash(req.body.password, 10)
  dbOpeUsers.signup(req.body).then((dbRes) => {
    req.session.isLogedin = true;
    req.session.userData = JSON.parse(JSON.stringify(dbRes.ops[0]));
    res.redirect('/account/login')
  })
})

router.get('/logout', (req, res) => {
  delete req.session.isLogedin;
  delete req.session.userData;
  res.redirect('/')

})
module.exports = router;
