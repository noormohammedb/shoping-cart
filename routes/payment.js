const express = require("express");
const router = express.Router();

const razorInstance = require('../payment');

/* Razorpay Payment Integration */
router.get('/', (req, res) => {
   res.send('router for payment');
});

router.post('/', (req, res) => {
   console.log(req.body);
   res.json(req.body);
})

module.exports = router;