var db = require("./dbConnect")
const { ObjectId } = require('mongodb')

const ProductCollection = 'product';

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
   });
}

let getProductForEdit = (ProductID) => {
   return new Promise((resolve, reject) => {
      db.getDB().database.collection(ProductCollection).findOne({ _id: ObjectId(ProductID) })
         .then(resolve)
         .catch(reject)
   });
}

let updateProduct = (ProductID, UpdationData) => {
   return new Promise((resolve, reject) => {
      db.getDB().database.collection(ProductCollection).updateOne({ _id: ObjectId(ProductID) }, { $set: UpdationData })
         .then(resolve)
         .catch(reject)
   })
}

module.exports = { addProduct, getProduct, deleteProduct, getProductForEdit, updateProduct };