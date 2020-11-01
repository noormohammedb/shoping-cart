const express = require("express");
const router = express.Router();

/* Cart Router */
router.get('/', ToLoginIfNotVerified, (req, res) => {
   console.log("/cart");
   res.render("users/user-cart", {});
})

/* MiddleWare for login verification */
function ToLoginIfNotVerified(req, res, next) {
   if (req.session.isLogedin) {
      next()
   } else {
      res.redirect('/account/login')
   }
}

module.exports = router;