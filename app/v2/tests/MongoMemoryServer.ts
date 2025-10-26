import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {log } from "console"


const fs = require('fs');
const path = require('path');

const mongoServer = MongoMemoryServer.create({
      instance: {
        // port: number, // by default choose any free port
        // ip: string, // by default '127.0.0.1', for binding to all IP addresses set it to `::,0.0.0.0`,
        dbName: 'dbName', // by default '' (empty string)
        dbPath: './tests/database', // by default create in temp directory
        // storageEngine?: string, // by default `ephemeralForTest`, available engines: [ 'ephemeralForTest', 'wiredTiger' ]
        // replSet?: string, // by default no replica set, replica set name
        // auth?: boolean, // by default `mongod` is started with '--noauth', start `mongod` with '--auth'
        // args?: string[], // by default no additional arguments, any additional command line arguments for `mongod` `mongod` (ex. ['--notablescan'])
      },
      binary: {
        // version: string, // by default '5.0.8'
        downloadDir: './', // by default node_modules/.cache/mongodb-memory-server/mongodb-binaries
        // platform: string, // by default os.platform()
        // arch: string, // by default os.arch()
        // checkMD5: boolean, // by default false OR process.env.MONGOMS_MD5_CHECK
        // systemBinary: string, // by default undefined or process.env.MONGOMS_SYSTEM_BINARY
      },
    });
    
export const connect = async () => {
    const dbPath = './tests/database';
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }

   const uri = (await mongoServer).getUri("dbName");
   log("uri: ", uri)
 
  //  let connection = mongoose.connect(uri, {
  //   //    dbName: 'testDB',
  //      // by default create in temp directory
  //      // add more config if you need
  //  }); 

  //  return connection;
  const db = await mongoose.createConnection(uri, {

    //reconnectInterval: 5000,
    //reconnectTries: 60
    // add more config if you need
  });
  db.on(`error`, console.error.bind(console, `connection error:`));
  db.once(`open`, function () {
    // we`re connected!
    log(`MongoDB connected on "  ${uri}`);
  });

  return db;

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
        await (await mongoServer).stop();

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

/**
 * 
 4

In order to use multiple MongoDB connections use mongoose.createConnection function instead of mongoose.connect.

mongoose.createConnection Will give you a connection object which you can further use in your model file, Cause models are always bound to a single connection

let config = require('../config');
let mongoose = require('mongoose');

exports.connect = function () {
  const db = mongoose.createConnection(config.mongoUrl, {
    reconnectInterval: 5000,
    reconnectTries: 60
    // add more config if you need
  });
  db.on(`error`, console.error.bind(console, `connection error:`));
  db.once(`open`, function () {
    // we`re connected!
    console.log(`MongoDB connected on "  ${config.mongoUrl}`);
  });
};
 */