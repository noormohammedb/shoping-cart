var db = require("./dbConnect");
const { ObjectId } = require('mongodb');

async function signup(userData) {
   try {
      let isRegisterd = await db.getDB().database.collection('users').find({ email: userData.email }).toArray();
      if (!isRegisterd.length) {
         let dbRes = await db.getDB().database.collection('users').insertOne(userData);
         return dbRes;
      } else return "User exist";
   }
   catch (e) {
      console.error(e);
      console.log('db error , user signup error');
      throw e
   }
}

async function login(userData) {
   try {
      let dbRes = await db.getDB().database.collection('users').find({ email: userData.email }).toArray();
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , user login error');
      throw e
   }
}

async function profileUpdate(userId, userData) {
   console.log(userId);
   console.log(userData);
   try {
      let dbRes = await db.getDB().database.collection('users').updateOne(
         {
            _id: ObjectId(userId)
         },
         {
            $set: { ...userData }
         }
      )
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , profile update error');
      throw e
   }
}


async function changePassword(userId, hPasswd) {
   try {
      dbRes = await db.getDB().database.collection('users').updateOne(
         {
            _id: ObjectId(userId)
         },
         {
            $set: { password: hPasswd }
         }
      )
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , change password error');
      throw e
   }
}

async function addToCart(dataObj) {
   let productObject = {
      itemId: ObjectId(dataObj.productId),
      quantity: 1
   }
   var dbRes;
   try {
      let isUserHaveProductCart = await db.getDB().database.collection('cart')
         .findOne({ userId: ObjectId(dataObj.userId) })
      if (!isUserHaveProductCart) {
         let dataForDb = {
            userId: ObjectId(dataObj.userId),
            products: [productObject]
         }
         dbRes = await db.getDB().database.collection('cart').insertOne(dataForDb);
         return dbRes;
      } else {
         let ProductExist = isUserHaveProductCart.products
            .findIndex(product => product.itemId == dataObj.productId)
         if (ProductExist != -1) {
            await db.getDB().database.collection('cart').updateOne(
               {
                  userId: ObjectId(dataObj.userId),
                  'products.itemId': productObject.itemId
               },
               {
                  $inc: { 'products.$.quantity': 1 }
               })
            return null;
         } else {
            let QueryForDb = {
               match: { userId: ObjectId(dataObj.userId) },
               UpdateData: { $push: { products: productObject } }
            }
            dbRes = await db.getDB().database.collection('cart').updateOne(QueryForDb.match, QueryForDb.UpdateData)
         }
         return dbRes;
      }
   }
   catch (e) {
      console.error(e);
      console.log('db error , add product to cart');
      throw e
   }
}

async function getProductsFromCart(userId) {
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
      let dbRes = await db.getDB().database.collection('cart').aggregate(QueryForDb).toArray();
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , get products form cart (Aggregation)');
      throw e
   }
   return null;
}

async function getCartProductsCount(userId) {
   try {
      let dbRes = await db.getDB().database.collection('cart').findOne({ userId: ObjectId(userId) })
      if (!dbRes)
         return null;
      else
         return dbRes.products.length;
   }
   catch (e) {
      console.error(e);
      console.log('db error , get cart products Count');
      throw e
   }
}

async function editCartProductQuantity(dataObj) {
   try {
      let QueryForDb = {
         match: {
            userId: ObjectId(dataObj.userId),
            'products.itemId': ObjectId(dataObj.productId)
         },
         update: {
            $inc: { 'products.$.quantity': parseInt(dataObj.oper) }
         },
         projection: {
            returnOriginal: false
         }
      }
      let dbRes = await db.getDB().database.collection('cart')
         .findOneAndUpdate(QueryForDb.match, QueryForDb.update, QueryForDb.projection);
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error , edit cart product Quantity');
      throw e
   }
}

async function deleteProductFromCart(productId, userId) {
   try {
      let QueryForDb = {
         match: {
            userId: ObjectId(userId)
         },
         update: {
            $pull: {
               products: {
                  itemId: ObjectId(productId)
               }
            }
         }
      }
      dbRes = await db.getDB().database.collection('cart').updateOne(QueryForDb.match, QueryForDb.update);
      return dbRes;
   }
   catch (e) {
      console.error(e);
      console.log('db error, delete product from cart');
      throw e;
   }
}

async function getTotalAmount(userId) {
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
               product: {
                  $arrayElemAt: ['$product', 0]
               }
            }
         },
         {
            $group: {
               _id: null,
               total: {
                  $sum: {
                     $multiply: [{ $toInt: '$quantity' }, { $toInt: '$product.price' }]
                  }
               }
            }
         }
      ];
      let dbRes = await db.getDB().database.collection('cart').aggregate(QueryForDb).toArray();
      // console.log(dbRes);
      return dbRes[0].total;

   }
   catch (e) {
      console.log(e);
      console.log('db error, get total amount');
      throw e;
   }
}

module.exports = {
   signup,
   login,
   addToCart,
   getProductsFromCart,
   getCartProductsCount,
   editCartProductQuantity,
   deleteProductFromCart,
   profileUpdate,
   changePassword,
   getTotalAmount
}