var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: 'product 1',
      category: 'category',
      description: 'description',
      image: "https://prepbootstrap.com/Content/blog/bootstrap4.png",
      price: 199
    },
    {
      name: 'product 2',
      category: 'category',
      description: 'description',
      image: "https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png",
      price: 299
    },
    {
      name: 'product 3',
      category: 'category',
      description: 'description',
      image: "https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/full/angular2.png",
      price: 599
    },
    {
      name: 'product 4',
      category: 'category',
      description: 'description',
      image: "https://cdn-images-1.medium.com/max/1200/1*mMiAaYO35gwMnN7-mfRdNw.png",
      price: 899
    }
  ];
  let hbsObject = {
    products,
    title: "admin ",
    admin: true,
  }
  res.render('admin/view-products', hbsObject)
});

router.get('/add-product', (req, res, next) => {
  let hbsObject = {
    title: "admin add-porducts",
    admin: true
  }
  res.render('admin/add-product', hbsObject)
});

router.post('/add-product', (req, res, next) => {
  console.log(req.files);
  console.log(req.body);
  res.render('admin/add-product', { title: "admin add-porducts", admin: true })
});

module.exports = router;