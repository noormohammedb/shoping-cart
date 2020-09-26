var express = require("express");
var router = express.Router();
var dbOperation = require("../dbconfig/dbOperation")

/* GET users listing. */
router.get("/", function (req, res, next) {

  let hbsObject = {
    title: "admin ",
    admin: true,
  };
  dbOperation.getProduct((data) => {
    console.log(data);
    hbsObject.products = data
    res.render("admin/view-products", hbsObject);
  });
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
    dbOperation.addProduct(req.body, (dbRes) => {
      console.log(dbRes.ops);
    });
  }

  // console.log(req.files);

  res.render("admin/add-product", { title: "admin add-porducts", admin: true });
});

module.exports = router;
