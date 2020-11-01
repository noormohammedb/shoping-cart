var db = require("./dbConnect")
const { ObjectId } = require('mongodb')

ProductCollection = 'product'

let addProduct = (data) => {
   return new Promise(async (resolve, reject) => {
      let dbRes = db.getDB().database.collection(ProductCollection).insertOne(data)
      resolve(dbRes)
   });
}

let getProduct = () => {
   return new Promise(async (resolve, reject) => {
      let data = await db.getDB().database.collection(ProductCollection).find({ deleted: { $ne: true } }).toArray();
      resolve(data)
   });
}

let deleteProduct = (ProductID) => {
   return new Promise((resolve, reject) => {
      db.getDB().database.collection(ProductCollection).update({ _id: ObjectId(ProductID) }, { $set: { deleted: true } })
         .then(resolve)
   })
}

module.exports = { addProduct, getProduct, deleteProduct };