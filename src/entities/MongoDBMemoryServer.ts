import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
const mongod = MongoMemoryServer.create();



export class MongoDBMemoryServer {

    private static instance : MongoDBMemoryServer | null = null;

    private constructor(){}

    public static getInstance() : MongoDBMemoryServer{
        if(MongoDBMemoryServer.instance == null){
            console.log("new instance of database created")
            this.instance = new MongoDBMemoryServer();
            return this.instance;
       }
        else{
            console.log("same instanced")

            return this.instance as MongoDBMemoryServer;
        }
  
    }

    public connect = async () => {
        const uri = (await mongod).getUri();
        console.log(uri)
        console.log("connecting to mongo memory server...................")
        let db = mongoose.createConnection(uri, {
            dbName : 'testDB'
            // add more config if you need
        });
          db.on(`error`, console.error.bind(console, `connection error:`));
          db.once(`open`, function () {
            // we`re connected!;
        })
    }

    public closeDatabase = async () => {

        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await (await mongod).stop();
        console.log("2 close connection to mongo memory server...................")

    }
    public clearDatabase = async () => {
        const collections = mongoose.connection.collections;
        console.log("close connection to mongo memory server...................")

        for (const key in collections) {
           const collection = collections[key];
           await collection.deleteMany({});
        }
    }

}


/**
 * 
 * 
 import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = await MongoMemoryServer.create();

(async () => {
  await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });

  // your code here
  
  await mongoose.disconnect();
})();
 */