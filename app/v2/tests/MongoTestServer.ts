// test-db-setup.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { users } from './__mocks__/users';
import UserModel from '../src/models/UserModel';
import {log} from "console"

// let mongoServer: MongoMemoryServer;

// export const connect = async () => {
//   log("callling connect to services: ......................................")
//   mongoServer = await MongoMemoryServer.create({
//       instance: {
//         port: 50000, // by default choose any free port
//         // ip: string, // by default '127.0.0.1', for binding to all IP addresses set it to `::,0.0.0.0`,
//         dbName: 'dbName', // by default '' (empty string)
//         dbPath: './tests/__database__', // by default create in temp directory
//         // storageEngine?: string, // by default `ephemeralForTest`, available engines: [ 'ephemeralForTest', 'wiredTiger' ]
//         // replSet?: string, // by default no replica set, replica set name
//         // auth?: boolean, // by default `mongod` is started with '--noauth', start `mongod` with '--auth'
//         // args?: string[], // by default no additional arguments, any additional command line arguments for `mongod` `mongod` (ex. ['--notablescan'])
//       },
//       binary: {
//         // version: string, // by default '5.0.8'
//         downloadDir: './', // by default node_modules/.cache/mongodb-memory-server/mongodb-binaries
//         // platform: string, // by default os.platform()
//         // arch: string, // by default os.arch()
//         // checkMD5: boolean, // by default false OR process.env.MONGOMS_MD5_CHECK
//         // systemBinary: string, // by default undefined or process.env.MONGOMS_SYSTEM_BINARY
//       },
//     });
//   const uri = mongoServer.getUri("dbName");
// const db = mongoose.createConnection(uri, {

//     //reconnectInterval: 5000,
//     //reconnectTries: 60
//     // add more config if you need
//   });
//   db.on(`error`, console.error.bind(console, `connection error:`));
//   db.once(`open`, function () {
//     // we`re connected!
//     log(`MongoDB connected on "  ${uri}`);
//   });

//   return db;
// };

const mongoServer = MongoMemoryServer.create();
    
export const connect = async () => {

   const uri = (await mongoServer).getUri();
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
   log("callling close services: ......................................")

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoose.disconnect()
  await (await mongoServer).stop();
};

export const clearDatabase = async () => {
    log("callling clear data and services: ......................................")

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

export const seedDatabase = async () => {
    log("callling add data to mongo memory server: ......................................")

  // Implement your seeding logic here
  // For example, create some users:
  await UserModel.create(users);
};