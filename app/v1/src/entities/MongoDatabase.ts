import * as dotenv from 'dotenv'
import { connectMongoDB } from '../configs/mongoDB'
dotenv.config()

class MongoDatabase {
   private static _database: MongoDatabase | null = null;
   private constructor() {
        const dbUrl = process.env.MONGODB_URI
        if(dbUrl) {
             connectMongoDB(dbUrl);
        }
    }
/**
     * Retrieves the singleton instance of the MongoDatabase.
     * If the instance does not exist, it creates a new one.
     * 
     * @returns {MongoDatabase} The singleton instance of MongoDatabase.
     * @throws {Error} Throws an error if the database connection fails during instantiation.
     */
   public static getInstance() : MongoDatabase {
        if (this._database != null) {
            return this._database
        }
        else{
            this._database = new MongoDatabase();
            return this._database
        }
   }
}
export default MongoDatabase

