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
         orderStatus: "Order Placed",
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

async function getOrders(userId) {
   try {
      let dbRes = await db.getDB().database.collection('orders').find({ userId: ObjectId(userId) }).toArray();
      return dbRes;
   }
   catch (e) {
      console.log(e);
      console.log('db error, get orders');
      throw e;
   }
}

async function getOrderProducts(orderId) {
   try {
      let QueryForDb = [
         {
            $match: {
               _id: ObjectId(orderId)
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

async function getAllOrdersAdmin() {
   try {
      let dbRes = await db.getDB().database.collection('orders').find().toArray();
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , get order products (Aggregation)');
      throw e
   }
}

async function getOrderDetailsAdmin(orderId) {
   try {
      let QueryForDb = [
         {
            $match: {
               _id: ObjectId(orderId)
            }
         },
         {
            $unwind: '$products'
         },
         {
            $project: {
               address: '$address',
               totalAmount: '$totalAmount',
               paymentMethod: '$paymentMethod',
               paymentStatus: '$paymentStatus',
               Date: '$date',
               Time: '$time',
               item: '$products.itemId',
               userId: '$userId',
               orderStatus: '$orderStatus',
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
               },
               address: 1,
               totalAmount: 1,
               paymentMethod: 1,
               paymentStatus: 1,
               Date: 1,
               Time: 1,
               userId: 1,
               orderStatus: 1,
               quantity: 1
            }
         }
      ];
      let dbRes = await db.getDB().database.collection('orders').aggregate(QueryForDb).toArray();
      return dbRes;
   }
   catch (e) {
      console.log(e);
      console.log('db error, get orders');
      throw e;
   }
}

async function changeOrderStatusAdmin(orderId, status) {
   try {
      let dbRes = await db.getDB().database.collection('orders')
         .update({ _id: ObjectId(orderId) }, { $set: { orderStatus: status } });
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , get order products (Aggregation)');
      throw e
   }
}


module.exports = {
   placeOrder,
   getCartProductsList,
   removeFromCart,
   getOrders,
   getOrderProducts,
   getAllOrdersAdmin,
   getOrderDetailsAdmin,
   changeOrderStatusAdmin
}