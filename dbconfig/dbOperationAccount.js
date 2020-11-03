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
   try {
      let isUserHaveProductCart = await db.getDB().database.collection('cart').findOne({ userId: ObjectId(dataObj.userId) })
      // console.log(isUserHaveProductCart);
      if (!isUserHaveProductCart) {
         let dataForDb = {
            userId: ObjectId(dataObj.userId),
            products: [ObjectId(dataObj.productId)]
         }
         let dbRes = await db.getDB().database.collection('cart').insertOne(dataForDb);
         // console.log(dbRes);
         return dbRes;
      } else {
         let QueryForDb = {
            match: { userId: ObjectId(dataObj.userId) },
            UpdateData: { $push: { products: ObjectId(dataObj.productId) } }
         }
         let dbRes = await db.getDB().database.collection('cart').updateOne(QueryForDb.match, QueryForDb.UpdateData)
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
   console.log(userId);
   try {
      let QueryForDb = [
         {
            $match: {
               userId: ObjectId(userId)
            }
         },
         {
            $lookup: {
               from: 'product',
               let: {
                  listOfProducts: '$products'
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $in: ['$_id', "$$listOfProducts"]
                        }
                     }
                  }
               ],
               as: "productsInCart"
            }
         }

      ];
      let dbRes = await db.getDB().database.collection('cart').aggregate(QueryForDb).toArray();
      if (!dbRes.length)
         return null;
      else
         return dbRes[0].productsInCart;
   }
   catch (e) {
      console.error(e);
      console.log('db error , get products form cart (Aggregation)');
      throw e
   }
   return null;
}

async function getCartProductsCount(userId) {
   let dbRes = await db.getDB().database.collection('cart').findOne({ userId: ObjectId(userId) })
   if (!dbRes)
      return null;
   else
      return dbRes.products.length;
}

module.exports = { signup, login, addToCart, getProductsFromCart, getCartProductsCount }