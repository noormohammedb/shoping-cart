var db = require("./dbConnect")

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

module.exports = { signup, login }