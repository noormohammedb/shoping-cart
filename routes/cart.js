const express = require("express");
const router = express.Router();
var dbOpeUsers = require("../dbconfig/dbOperationAccount")

/* Cart Router */
router.get('/', ToLoginIfNotVerified, (req, res) => {
   let hbsObject = {
      title: "Cart | shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   };
   dbOpeUsers.getProductsFromCart(req.session.userData._id)
      .then((productsArray) => {
         if (productsArray) {
            hbsObject.items = productsArray;
            dbOpeUsers.getCartProductsCount(req.session.userData._id)
               .then((count) => {
                  hbsObject.cartTagCount = count;
                  res.render("users/user-cart", hbsObject);
               })
         } else res.render("users/user-cart", hbsObject);
      })
});

router.get('/delete-product/:id', ToLoginIfNotVerified, (req, res, next) => {
   dbOpeUsers.deleteProductFromCart(req.params.id, req.session.userData._id)
      .then(dbRes => res.redirect('/cart'))
      .catch(e => {
         console.log(e);
         res.send('product remove error')
      })
});

router.get('/place-order', ToLoginIfNotVerified, (req, res) => {
   let hbsObject = {
      title: "Place-Order | shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   };
   dbOpeUsers.getCartProductsCount(req.session.userData._id)
      .then((count) => {
         hbsObject.cartTagCount = count;
         res.render('users/place-order', hbsObject);
      })
});

/* APIs for AJAX */

/* add products to user cart */
router.get('/add-to-cart/:id', AuthForAPI, (req, res) => {
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
});

/* edit product quantity in cart */
router.post('/edit-product-quantity', AuthForAPI, (req, res) => {
   req.body.oper = parseInt(req.body.oper);
   dbOpeUsers.editCartProductQuantity(req.body)
      .then(dbRes => {
         let updatedQuantity =
            dbRes.value.products.find(iteration => req.body.productId == iteration.itemId)
         if (updatedQuantity.quantity < 1) {
            if (updatedQuantity.quantity != 0)
               req.body.oper = 0 - updatedQuantity.quantity;
            else
               req.body.oper = 1
            dbOpeUsers.editCartProductQuantity(req.body);
         }
         res.send({
            updatedQuantity: updatedQuantity.quantity,
            success: true,
            loginStatus: true,
            status: "Data Base updated"
         });
      })
      .catch(e => res.status(403).send("update error"));
});

router.get('/get-totla-price', AuthForAPI, (req, res) => {
   dbOpeUsers.getCartProductsCount(req.session.userData._id).then(count => {
      let resData = { loginStatus: true };
      if (count) {
         dbOpeUsers.getTotalAmount(req.session.userData._id)
            .then((dbRes) => {
               resData.payloadTotal = dbRes;
               resData.success = true;
               resData.status = "current price";
               res.json(resData);
            })
            .catch((e) => {
               res.send({ ...e });
            })
      }
      else {
         resData.success = false;
         resData.status = "No Item in Cart";
         res.json(resData);
      }
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