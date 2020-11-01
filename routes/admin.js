var express = require("express");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperationProducts")

/* GET users listing. */
router.get("/", function (req, res, next) {

  let hbsObject = {
    title: "admin ",
    admin: true,
  };
  dbOperation.getProduct().then((data) => {
    // console.log(data);
    hbsObject.products = data
    res.render("admin/view-products", hbsObject);
  })
});

router.get("/add-product", (req, res, next) => {
  let hbsObject = {
    title: "admin add-porducts",
    admin: true,
  };
  res.render("admin/add-product", hbsObject);
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);

  if (req.files) {
    save = req.files.image;
    console.log(`file name : ${save.name} Size : ${save.size} md5 : ${save.md5}`);
    locdir = `${__dirname}/../public/uploaded/${save.name}`;
    save.mv(locdir, (error) => {
      if (error) {
        res.send("fileupload error");
        throw error;
      }
      console.log("done");
      req.body.image = save.name;
      pushToDb();
    });
  } else {
    pushToDb();
    console.log("no file in this request");
  }

  let pushToDb = () => {
    dbOperation.addProduct(req.body).then((dbRes) => {
      console.log(dbRes.ops);
    });
  }

  // console.log(req.files);
  let hbsObject = {
    title: "admin add-porducts",
    admin: true
  };
  res.render("admin/add-product", hbsObject);
});

router.get('/edit-product/:id', (req, res) => {
  // console.log(req.params);
  dbOperation.getProductForEdit(req.params.id)
    .then((dbRes) => {
      // console.log(dbRes);
      let hbsObject = {
        title: "admin edit product",
        admin: true,
        ...dbRes
      };
      // console.log(hbsObject);
      res.render("admin/edit-product", hbsObject)
    })
    .catch((error) => {
      console.error(error);
      res.send(error)
      throw error
    })
});

router.post('/edit-product/:id', (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  if (req.files) {
    save = req.files.image;
    console.log(`file name : ${save.name} Size : ${save.size} md5 : ${save.md5}`);
    locdir = `${__dirname}/../public/uploaded/${save.name}`;
    save.mv(locdir, (error) => {
      if (error) {
        res.send("fileupload error");
        throw error;
      }
      console.log("done");
      req.body.image = save.name;
      dbOperation.updateProduct(req.params.id, req.body).then((dbRes) => {
        console.log("Product Updated With image");
        res.redirect(`/admin/edit-product/${req.params.id}`)
      })
    });
  } else {
    dbOperation.updateProduct(req.params.id, req.body).then((dbRes) => {
      console.log("Product details Updated");
      res.redirect(`/admin/edit-product/${req.params.id}`)
    })
  }
  // res.send('/edit-product  POST')

});

router.get('/delete-product/:id', (req, res) => {
  console.log(req.params);
  dbOperation.deleteProduct(req.params.id)
    .then((data) => {
      res.redirect('/admin')
    })
    .catch(console.error)
  // res.redirect("/admin");
});

module.exports = router;
