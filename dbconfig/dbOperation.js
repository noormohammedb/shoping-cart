var db = require("./dbConnect")

ProductCollection = 'product'

let addProduct = (data) => {
   return new Promise(async (resolve, reject) => {
      let dbRes = db.getDB().database.collection(ProductCollection).insertOne(data)
      resolve(dbRes)
   });
}

let getProduct = () => {
   return new Promise(async (resolve, reject) => {
      let data = await db.getDB().database.collection(ProductCollection).find().toArray();
      resolve(data)
   });
}

module.exports = { addProduct, getProduct };