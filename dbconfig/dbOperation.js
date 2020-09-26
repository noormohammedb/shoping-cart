var db = require("./dbConnect")

ProductCollection = 'product'

let addProduct = (data, callback) => {
   db.getDB().database.collection(ProductCollection).insertOne(data).then((dbRes) => {
      callback(dbRes)
   });
}


module.exports = { addProduct };