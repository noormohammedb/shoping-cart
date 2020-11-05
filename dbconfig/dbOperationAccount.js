var db = require("./dbConnect");
const { ObjectId } = require('mongodb');

async function signup(userData) {
   try {
      let dbRes = await db.getDB().database.collection('users').insertOne(userData);
      return dbRes;
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

async function addToCart(dataObj) {
   let productObject = {
      itemId: ObjectId(dataObj.productId),
      quantity: 1
   }
   var dbRes;
   try {
      let isUserHaveProductCart = await db.getDB().database.collection('cart')
         .findOne({ userId: ObjectId(dataObj.userId) })
      // console.log(isUserHaveProductCart);
      if (!isUserHaveProductCart) {
         let dataForDb = {
            userId: ObjectId(dataObj.userId),
            products: [productObject]
         }
         dbRes = await db.getDB().database.collection('cart').insertOne(dataForDb);
         // console.log(dbRes);
         return dbRes;
      } else {
         let ProductExist = isUserHaveProductCart.products
            .findIndex(product => product.itemId == dataObj.productId)
         // console.log(ProductExist);
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
         // console.log(dbRes);
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




module.exports = { signup, login, addToCart, getProductsFromCart, getCartProductsCount }