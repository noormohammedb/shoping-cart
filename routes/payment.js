const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const dbOpeOrder = require("../dbconfig/dbOperationOrders")

const razorInstance = require('../payment');
require('dotenv').config();

/* Razorpay Payment Integration */
router.get('/', (req, res) => {
   res.send('router for payment');
});

router.post('/', (req, res) => {

   console.log(req.session.payOrder.id);
   console.log(process.env.RAZORPAY_KEY_SECRET);

   console.log(req.body["paymentResponse[razorpay_order_id]"]);
   console.log(req.body["paymentResponse[razorpay_payment_id]"]);
   console.log(req.body["paymentResponse[razorpay_signature]"]);

   let signString = req.session.payOrder.id + "|" + req.body["paymentResponse[razorpay_payment_id]"];

   generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signString).digest('hex');

   console.log(generated_signature + "  <== signed");

   if (generated_signature == req.body["paymentResponse[razorpay_signature]"]) {
      console.log(' payment is successful ');
      dbOpeOrder.paymentUpdate(req.body.orderId)
         .then(dbRes => {
            console.log(dbRes.toArry());
            res.json({
               success: true,
               status: 'Payment Successful'
            });
         })
         .catch(e => {
            res.json({
               success: false,
               status: 'Payment Update UnSuccessful'
            })
         })
   } else {
      res.json({
         success: false,
         status: 'Payment Verification Failed'
      });
   }
})

module.exports = router;