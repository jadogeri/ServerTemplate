import mongoose, { Connection } from 'mongoose';
import { connectMongoDB } from '../configs/mongoDB';
import { MongoDBContainer, StartedMongoDBContainer } from "@testcontainers/mongodb";
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.test.env' : '.env' });

let mongoContainer: StartedMongoDBContainer;

export class MongoDatabase {
   private _database: MongoDatabase | null = null;
   private _connection : any ;
   public constructor() {
        const dbUrl = process.env.MONGODB_URI
        if(dbUrl) {
            // this._connection = connectMongoDB(dbUrl);
            this.connectDB()
        }
    }
/**
     * Retrieves the singleton instance of the MongoDatabase.
     * If the instance does not exist, it creates a new one.
     * 
     * @returns {MongoDatabase} The singleton instance of MongoDatabase.
     * @throws {Error} Throws an error if the database connection fails during instantiation.
     */
   public getInstance() : MongoDatabase {
        if (this._database != null) {
            return this._database
        }
        else{
            this._database = new MongoDatabase();
            return this._database
        }
   }

   async connectDB() {
  if (process.env.NODE_ENV === 'test') {
    // For E2E tests, start a new MongoDB container
    mongoContainer = await new MongoDBContainer('mongo:latest').start();
    const uri = mongoContainer.getConnectionString();
    await mongoose.connect(uri, {
        connectTimeoutMS: 60000, // Increase connection timeout to 60 seconds
        serverSelectionTimeoutMS: 60000, // Increase server selection timeout to 60 seconds
      });
    console.log('Connected to Testcontainers MongoDB');
  } else {
    // For production/development, connect using the .env file
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  }
}

async disconnectDB() {
  await mongoose.disconnect();
  if (mongoContainer) {
    await mongoContainer.stop();
  }
}

async dropCollections() {
  if (process.env.NODE_ENV === 'test') {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}

}

