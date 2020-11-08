const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
   res.send('orders');
});

router.get('/checkout', (req, res) => {
   res.send('checkout')
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

module.exports = router;