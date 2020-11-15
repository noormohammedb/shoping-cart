const express = require("express");
const router = express.Router();
const dbOpeOrder = require("../dbconfig/dbOperationOrders")
const dbOpeUsers = require("../dbconfig/dbOperationAccount")
const { razorCreateOrder } = require('../payment');

/* Orders Router */
router.get('/', ToLoginIfNotVerified, (req, res) => {
   let hbsObject = {
      title: "Orders | shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   }
   dbOpeOrder.getOrders(req.session.userData._id).then(dbRes => {
      if (dbRes.length) {
         hbsObject.orders = dbRes;
         hbsObject.showOrders = true
      }
      dbOpeUsers.getCartProductsCount(req.session.userData._id)
         .then((count) => {
            hbsObject.cartTagCount = count;
            res.render("users/orders", hbsObject);
         });
   });
});

router.get('/view/:id', ToLoginIfNotVerified, (req, res) => {
   let hbsObject = {
      title: "view order | shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   }
   if (req.params.id.length != 24) { res.redirect('/orders/'); return }
   dbOpeOrder.getOrderProducts(req.params.id).then(dbRes => {
      hbsObject.products = dbRes;
      if (!dbRes.length) { res.redirect('/orders/') }
      else {
         dbOpeUsers.getCartProductsCount(req.session.userData._id)
            .then(count => {
               hbsObject.cartTagCount = count;
               res.render('users/order-products', hbsObject);
            });
      }
   });
});

router.post('/checkout', AuthForAPI, async (req, res) => {

   /* Getting Products From Cart For Order */
   let userCartList = await dbOpeOrder.getCartProductsList(req.session.userData._id);


   /* Getting Total Amount For Checkout */
   let totalAmount = await dbOpeUsers.getTotalAmount(req.session.userData._id)


   let dbRes = await dbOpeOrder.placeOrder(req.body, userCartList, totalAmount, req.session.userData._id)
   if (dbRes[0]._id) {
      dbOpeOrder.removeFromCart(req.session.userData._id)
      if (req.body.payment == 'cod') {
         res.json({
            success: true,
            loginStatus: true,
            redirect: true,
            status: "order placed with cod"
         });
      } else if (req.body.payment == 'online-payment') {

         console.log(dbRes[0]);
         console.log(dbRes[0]._id);

         var options = {
            amount: parseInt(dbRes[0].totalAmount) * 100,
            currency: "INR",
            receipt: dbRes[0]._id.toString()
         };

         console.log('options for razor instance');
         console.log(options);

         razorCreateOrder(options).then(order => {

            console.log('razorpay order object');
            console.log(order);
            req.session.payOrder = order;

            res.json({
               success: true,
               loginStatus: true,
               redirect: false,
               callGateWay: true,
               razorObj: order,
               status: "order placed with online payment"
            });
         });
      } else res.status(501).json({ status: 'Form validation error' });
   } else {
      res.status(501).json({ status: "order not created" });
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