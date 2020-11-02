const { json } = require("express");
const express = require("express");
const router = express.Router();

/* Cart Router */
router.get('/', ToLoginIfNotVerified, (req, res) => {
   console.log("/cart");
   res.render("users/user-cart", {});
});

/* add products to user cart */
router.get('/add-to-cart/:id', ToLoginIfNotVerified, (req, res) => {
   let resObj = {
      productId: req.params.id,
      userId: req.session.userData._id
   }
   res.send(resObj)
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