var express = require("express");
var router = express.Router();
var dbOpeUsers = require("../dbconfig/dbOperationAccount")
const bcrypt = require('bcrypt');


router.get('/login', (req, res, next) => {
  if (req.session.userData) {
    console.log('login redirect to home');
    res.redirect('/')
  } else {
    res.render("users/login-form", { title: "shopping cart" });
  }
})
router.post('/login', async (req, res) => {
  let dbRes = await dbOpeUsers.login(req.body);
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
        res.json({
          status: true,
          message: "logged in redirect to /"
        })
      } else {
        console.log(compareResult);
        console.log('password missmatch');
        res.json({
          status: false,
          wrongPassword: true,
          message: "Password MissMatch"
        })
      }
    })
  } else {
    console.log('no user found');
    res.json({
      status: false,
      noUser: true,
      message: "User Not Registerd"
    })
  }
})

router.get('/signup', (req, res) => {
  if (req.session.userData) {
    console.log('signup redirect to home');
    res.redirect('/')
  } else {
    res.render("users/signup-form", { title: "shopping cart" })
  }
})

router.post('/signup', async (req, res) => {
  console.log(req.body);
  req.body.password = await bcrypt.hash(req.body.password, 10)
  dbOpeUsers.signup(req.body).then((dbRes) => {
    if (dbRes.ops) {
      console.log("array");
      req.session.isLogedin = true;
      req.session.userData = JSON.parse(JSON.stringify(dbRes.ops[0]));
      res.json({
        status: true,
        message: "User signedup"
      })
    } else {
      res.json({
        status: false,
        userExist: true,
        message: "User Exist"
      })
    }
  })
})

router.get('/logout', (req, res) => {
  delete req.session.isLogedin;
  delete req.session.userData;
  res.redirect('/')

})

router.get('/profile', ToLoginIfNotVerified, (req, res) => {
  hbsObject = {
    title: "Shopping Cart | Profile",
    admin: false,
    loggedinUser: req.session.userData,
    name: req.session.userData.name,
    email: req.session.userData.email
  }
  res.render("users/profile", hbsObject)
});

/* API routes */

router.post('/profile-update', AuthForAPI, (req, res) => {
  console.log(req.body);
  resObj = {
    loginStatus: true,
    message: "success",
    ...req.body
  }
  dbOpeUsers.profileUpdate(req.session.userData._id, req.body)
    .then(dbRes => {
      req.session.userData = { ...req.session.userData, ...req.body };
      res.json({
        ...resObj,
        status: true,
        message: "Updated Successfully"
      });

    })
    .catch(e => {
      res.json({
        ...resObj,
        status: false,
        message: "server error"
      })
    })

});

/* MiddleWare for login verification */
function ToLoginIfNotVerified(req, res, next) {
  if (req.session.isLogedin) {
    next()
  } else {
    console.log("Redirected to login");
    res.redirect('/account/login')
  }
}

/* MiddleWare for API to login verification */
function AuthForAPI(req, res, next) {
  if (!req.session.isLogedin) {
    res.send({
      success: false,
      loginStatus: false,
      status: "User Not LoggedIn"
    });
  } else
    next();
}

module.exports = router;