var express = require("express");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperationProducts")


/* GET home page. */
router.get("/", function (req, res, next) {
   let hbsObject = {
      title: "shopping cart",
      admin: false,
      loggedinUser: req.session.userData
   };
   dbOperation.getProduct().then((data) => {
      // console.log(data);
      hbsObject.products = data
      res.render("index", hbsObject);
   })
});

module.exports = router;
