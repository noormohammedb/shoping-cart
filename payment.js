const Razorpay = require('razorpay');
require('dotenv').config();

var razorInstance = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function razorCreateOrder(options) {
   return new Promise((resolve, reject) => {
      razorInstance.orders.create(options, (err, order) => {
         if (err) {
            console.log('razorpay instance error ');
            console.error(err);
            throw err;
            reject(err);
         }
         order.key_id = process.env.RAZORPAY_KEY_ID;
         resolve(order);
      })
   })
}

module.exports = { razorCreateOrder };