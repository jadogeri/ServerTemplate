import * as dotenv from 'dotenv'
import { connectMongoDB } from '../configs/mongoDB'
dotenv.config()

class MongoDatabase {
   private static _database: MongoDatabase | null = null;
   private constructor() {
        const dbUrl = process.env.MONGODB_URI
        console.log(dbUrl)
        if(dbUrl) {
            connectMongoDB(dbUrl);
        }
    }
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

