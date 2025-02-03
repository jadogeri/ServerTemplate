import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { log } from 'console';


const mongod = MongoMemoryServer.create();

export class MongoMemoryDatabase {

    private  connection : mongoose.Connection | null = null;
    private db : mongoose.mongo.Db | null = null;


    public constructor(){ }

    public getConnection(){
        return this.connection as mongoose.Connection
    }

    public getDb () : mongoose.mongo.Db {

        return this.db as mongoose.mongo.Db ;
    }

    public connect = async () => {
        const uri =  (await mongod).getUri();
        log(uri)
        log("connecting to mongo memory server...................")
        this.connection = mongoose.createConnection(uri, {
            dbName : 'testDB'
            // add more config if you need
        });
        log("connnection status .................................", this.connection)
        log("connnection status .................................", this.connection)
        this.db = this.connection.db as mongoose.mongo.Db

    }

    public closeDatabase = async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await (await mongod).stop();
        log("closed database...................")
    }
    public clearDatabase = async () => {
        try{
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            log("key ======",key,typeof key)
            await collection.deleteMany({})

        }
    }catch(e){
        log(e)
    }

    }

}

/**
 * 

export const connect = async () => {
   const uri = await (await mongod).getUri();
   await mongoose.connect(uri);
}
export const closeDatabase = async () => {
   await mongoose.connection.dropDatabase();
   await mongoose.connection.close();
   await (await mongod).stop();
}
export const clearDatabase = async () => {
   const collections = mongoose.connection.collections;
   for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
   }










let mongoServer

// Creates and connects to a MMS instance
module.exports.dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
}

// Disconnects from and deletes the MMS instance
module.exports.dbDisconnect = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}
 */
