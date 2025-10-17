import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {log } from "console"
const mongod = MongoMemoryServer.create();
export const connect = async () => {
   const uri = (await mongod).getUri();
 
   let connection = mongoose.connect(uri, {
       dbName: 'testDB'
       // add more config if you need
   });

   //console.log("total connections ===",mongoose.connections.length)
   

    return connection;
}
export const closeDatabase = async () => {

   //console.log("total connections in close ===",mongoose.connections.length)
   let i = 0

   for (const connection of mongoose.connections) {
      //console.log("loop " , i)
      i++;

      try {
        await connection.dropDatabase();
        await connection.close();
        await mongoose.disconnect()
        await (await mongod).stop();

      } catch (error) {
        //console.error(`Error closing connection to ${connection.name}:`, error);
      }
    }
  

   // await mongoose.connection.dropDatabase();
   // await mongoose.connection.close();

}
export const clearDatabase = async () => {
   try{
   const collections = mongoose.connection.collections;
   //console.log("total collections ===",collections)

   for (const key in collections) {
      //log("key===============")
      //log(key)
      const collection = collections[key];
      await collection.deleteMany({});
   }
}catch(e){
   log(e);
   
}
}

const db = { connect, closeDatabase, clearDatabase}

export { db }

