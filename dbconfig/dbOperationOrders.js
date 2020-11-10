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

async function getOrderProducts(userId) {
   try {
      let QueryForDb = [
         {
            $match: {
               userId: ObjectId(userId)
            }
         },
         {
            $unwind: '$products'
         },
         {
            $project: {
               item: '$products.itemId',
               userId: '$userId',
               quantity: '$products.quantity'
            }
         },
         {
            $lookup: {
               from: 'product',
               localField: 'item',
               foreignField: '_id',
               as: 'product'
            }
         },
         {
            $project: {
               item: 1,
               quantity: 1,
               userId: 1,
               product: {
                  $arrayElemAt: ['$product', 0]
               }
            }
         }
      ];
      let dbRes = await db.getDB().database.collection('orders').aggregate(QueryForDb).toArray();
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , get order products (Aggregation)');
      throw e
   }
   return null;
}

module.exports = {
   placeOrder,
   getCartProductsList,
   removeFromCart,
   getOrderProducts
}