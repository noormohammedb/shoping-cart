var express = require("express");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperationProducts")
const dbOpeOrder = require("../dbconfig/dbOperationOrders")
var cloudinary = require('cloudinary').v2;
const fs = require('fs');

require('dotenv').config({ path: `${__dirname}/../.env` });

cloudinary.config({
  cloud_name: "gameovermarinehubby",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

/* GET Products . */
router.get("/", authAdmin, function (req, res, next) {

  let hbsObject = {
    title: "admin ",
    admin: true,
  };
  dbOperation.getProduct().then((data) => {
    hbsObject.products = data
    res.render("admin/view-products", hbsObject);
  })
});

router.get("/add-product", authAdmin, (req, res, next) => {
  let hbsObject = {
    title: "admin add-porducts",
    admin: true,
  };
  res.render("admin/add-product", hbsObject);
});

router.post("/add-product", authAdmin, (req, res, next) => {
  req.body.price = parseInt(req.body.price);
  if (req.files) {
    save = req.files.image;
    cloudinary.uploader.upload(save.tempFilePath)
      .then(result => {
        req.body.imageUrl = result.url;
        console.log(result);
        pushToDb();
      })
      .catch(e => {
        console.log('file upload to cloudinary error');
        console.error(e);
      });
  } else {
    console.log("no file in this request");
    pushToDb();
  }

  function pushToDb() {
    dbOperation.addProduct(req.body).then((dbRes) => {
      let hbsObject = {
        title: "admin add-porducts",
        admin: true
      };
      res.render("admin/add-product", hbsObject);
    });
  }
});

router.get('/edit-product/:id', authAdmin, (req, res) => {
  dbOperation.getProductForEdit(req.params.id)
    .then((dbRes) => {
      let hbsObject = {
        title: "admin edit product",
        admin: true,
        ...dbRes
      };
      res.render("admin/edit-product", hbsObject)
    })
    .catch((error) => {
      console.error(error);
      res.send(error)
      throw error
    })
});

router.post('/edit-product/:id', authAdmin, (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  if (req.files) {
    save = req.files.image;
    cloudinary.uploader.upload(save.tempFilePath)
      .then(result => {
        req.body.imageUrl = result.url;
        console.log(result);
        dbOperation.updateProduct(req.params.id, req.body).then((dbRes) => {
          console.log("Product Updated With image");
          res.redirect(`/admin/edit-product/${req.params.id}`)
        });
      })
      .catch(e => {
        console.log('file upload to cloudinary error');
        console.error(e);
      });
  } else {
    dbOperation.updateProduct(req.params.id, req.body).then((dbRes) => {
      console.log("Product details Updated");
      res.redirect(`/admin/edit-product/${req.params.id}`)
    })
  }
});

router.get('/delete-product/:id', authAdmin, (req, res) => {
  console.log(req.params);
  dbOperation.deleteProduct(req.params.id)
    .then((data) => {
      res.redirect('/admin')
    })
    .catch(console.error)
});

router.get('/orders', authAdmin, (req, res) => {
  hbsObject = {
    title: "admin | Orders",
    admin: true,
  }
  dbOpeOrder.getAllOrdersAdmin()
    .then(dbRes => {
      console.log(dbRes);
      hbsObject.orders = dbRes;
      res.render('admin/view-orders', hbsObject);
    })
});

router.get('/orders/:id', authAdmin, (req, res) => {
  console.log(req.params.id);
  hbsObject = {
    title: "admin | Orders",
    admin: true,
  }
  dbOpeOrder.getOrderDetailsAdmin(req.params.id)
    .then(dbRes => {
      console.log(dbRes);
      hbsObject.orderProducts = dbRes;
      hbsObject.orderDetails = dbRes[0];
      res.render('admin/order-details', hbsObject);
    })
    .catch(e => {
      console.log(e);
    })
});

/* Api routes */
// router.post('/orders', authAdmin, (req, res) => {
router.post('/order-status', (req, res) => {
  dbOpeOrder.changeOrderStatusAdmin(req.body.orderId, req.body.status)
    .then(dbRes => {
      res.json({
        status: true,
        message: "updated"
      })
    })
    .catch(e => {
      res.json({
        status: false,
        message: 'data base updation failed'
      })
    })
});

/* Middlewares */
function authAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(401).render('401', {});
  }
}


module.exports = router;
