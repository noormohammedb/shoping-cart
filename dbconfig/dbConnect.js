const MongoClient = require('mongodb').MongoClient;
// require('dotenv').config({ path: `${__dirname}/../` });
const dburl = "mongodb://127.0.0.1:27017";
const dbname = "ecom";

let state = {
   database: null
}

let dbConnection = (callback) => {
   MongoClient.connect(dburl, { useUnifiedTopology: true }, (error, connetcion) => {
      if (error) {
         console.log("error in database connection");
         return callback(error)
      } else {
         state.database = connetcion.db(dbname)
      }
      callback();
   });
}

let getDB = () => {
   return state
}

module.exports = { dbConnection, getDB }