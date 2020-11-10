const db = require('./dbConnect');
const { ObjectId } = require('mongodb')

async function getCartProductsList(userId) {
   try {
      let userCartList = await db.getDB().database.collection('cart')
         .findOne({ userId: ObjectId(userId) })
      return userCartList.products;
   }
   catch (e) {
      console.log(e);
      console.log('db error, get cart products list');
      throw e;
   }
}

async function placeOrder(orderdata, products, totalAmount, userId) {
   try {
      let status = orderdata.payment == 'cod' ? 'placed' : 'pending';
      dataForDb = {
         userId: ObjectId(userId),
         address: orderdata,
         paymentMethod: orderdata.payment,
         products,
         totalAmount,
         paymentStatus: status,
         date: new Date().toLocaleDateString("en-US"),
         time: new Date().toLocaleTimeString("en-US")
      }
      let dbRes = await db.getDB().database.collection('orders').insertOne(dataForDb);
      return dbRes.ops;
   }
   catch (e) {
      console.log(e);
      console.log('db error, place order');
      throw e;
   }
}

async function removeFromCart(userId) {
   try {
      let dbRes = await db.getDB().database.collection('cart').removeOne({ userId: ObjectId(userId) })
      return dbRes;
   }
   catch (e) {
      console.log(e);
      console.log('db error, remove from cart');
      throw e;
   }
}

module.exports = {
   placeOrder,
   getCartProductsList,
   removeFromCart
}