import mongoose from 'mongoose';
import {log } from "console"
import mongoServerInstance from "../src/configs/mongoMemoryServer"
import { MongoMemoryServer } from 'mongodb-memory-server';


const fs = require('fs');
const path = require('path');

export class MongoTestServer{

  private mongoServer: MongoMemoryServer | null = null;

  constructor(){
  }

  async connect(){

      const dbPath = './tests/database';
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }


    this.mongoServer = await mongoServerInstance();
       const uri = (this.mongoServer as MongoMemoryServer).getUri("dbName");
   log("uri: ", uri)
    // const mongoUri = this.mongoServer.getUri();
    // await mongoose.connect(mongoUri);

    const db = await mongoose.connect(uri)

    log(`MongoDB connected on "  ${uri}`);
    return db;
  }

    async clearDatabase () {
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

  
 async closeDatabase () {

   //console.log("total connections in close ===",mongoose.connections.length)
   let i = 0

   for (const connection of mongoose.connections) {
      //console.log("loop " , i)
      i++;

      try {
           await connection.dropDatabase();
           await connection.close();
           await mongoose.disconnect()
           await (this.mongoServer as any).stop() as unknown as MongoMemoryServer;

      } catch (error) {
        console.error(`Error closing connection to ${connection.name}:`, error);
      }
    }
  }

}
