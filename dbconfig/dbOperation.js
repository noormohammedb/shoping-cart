var db = require("./dbConnect")

ProductCollection = 'product'

let addProduct = (data, callback) => {
   db.getDB().database.collection(ProductCollection).insertOne(data).then((dbRes) => {
      callback(dbRes)
   });
}

let getProduct = async (callback) => {
   let data = await db.getDB().database.collection(ProductCollection).find().toArray();
   // console.log(data);
   callback(data)
}

module.exports = { addProduct, getProduct };