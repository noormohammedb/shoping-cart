const express = require("express");
const router = express.Router();
var dbOpeUsers = require("../dbconfig/dbOperationAccount")

/* Cart Router */
router.get('/', ToLoginIfNotVerified, (req, res) => {
   dbOpeUsers.getProductsFromCart(req.session.userData._id)
      .then((productsArray) => {
         let hbsObject = {
            title: "Cart | shopping cart",
            admin: false,
            loggedinUser: req.session.userData,
            items: productsArray
         };
         res.render("users/user-cart", hbsObject);
      })
});

/* add products to user cart */
router.get('/add-to-cart/:id', (req, res) => {
   if (!req.session.isLogedin) {
      res.send({
         success: false,
         loginStatus: false,
         status: "User Not LoggedIn"
      });
   } else {

      let resObj = {
         productId: req.params.id,
         userId: req.session.userData._id
      }
      dbOpeUsers.addToCart(resObj)
         .then((dbRes) => {
            res.send({
               success: true,
               loginStatus: true,
               status: "Add To Cart Done",
            });
         })
         .catch((e) => {
            res.send({
               success: false,
               loginStatus: true,
               status: "Data Base Error"
            });
         });
   }
});

/* MiddleWare for login verification */
function ToLoginIfNotVerified(req, res, next) {
   if (req.session.isLogedin) {
      next()
   } else {
      res.redirect('/account/login')
   }
}

module.exports = router;