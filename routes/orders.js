const express = require("express");
const router = express.Router();
const dbOpeOrder = require("../dbconfig/dbOperationOrders")
const dbOpeUsers = require("../dbconfig/dbOperationAccount")

/* Orders Router */
router.get('/', ToLoginIfNotVerified, (req, res) => {
   // let userId = '5f9e451e7bf1b71194d071ae';
   let hbsObject = {
      title: "Orders | shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   }
   dbOpeOrder.getOrderProducts(req.session.userData._id).then(dbRes => {
      hbsObject.products = dbRes;
      dbOpeUsers.getCartProductsCount(req.session.userData._id)
         .then((count) => {
            hbsObject.cartTagCount = count;
            res.render("users/orders", hbsObject);
         })
      // res.render('users/orders', hbsObject);
   });
});

router.post('/checkout', AuthForAPI, async (req, res) => {
   console.log(req.body);
   console.log(req.session.userData);

   /* Getting Products From Cart For Order */
   let userCartList = await dbOpeOrder.getCartProductsList(req.session.userData._id);

   console.log('user Cart List =>');
   console.log(userCartList);

   /* Getting Total Amount For Checkout */
   let totalAmount = await dbOpeUsers.getTotalAmount(req.session.userData._id)

   console.log('total amount =>');
   console.log(totalAmount);

   let dbRes = await dbOpeOrder.placeOrder(req.body, userCartList, totalAmount, req.session.userData._id)
   if (dbRes[0]._id) {
      dbOpeOrder.removeFromCart(req.session.userData._id)
      res.json({
         success: true,
         loginStatus: true,
         status: "order placed"
      })
   } else {
      res.send(req.body)
   }
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