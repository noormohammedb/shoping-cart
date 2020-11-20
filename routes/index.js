var express = require("express");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperationProducts")
var dbOpeUsers = require("../dbconfig/dbOperationAccount")


/* GET home page. */
router.get("/", function (req, res, next) {
   let hbsObject = {
      title: "shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   };
   dbOperation.getProduct()
      .then((data) => {
         // console.log(data);
         hbsObject.products = data
         if (req.session.isLogedin) {
            dbOpeUsers.getCartProductsCount(req.session.userData._id)
               .then((count) => {
                  hbsObject.cartTagCount = count;
                  res.render("index", hbsObject);
               })
         } else
            res.render("index", hbsObject);
      })
      .catch(e => {
         console.log("error occurred in index getproduct");
         console.error(e);
         setTimeout(() => res.redirect("/"), 1500);
      })
});

module.exports = router;
