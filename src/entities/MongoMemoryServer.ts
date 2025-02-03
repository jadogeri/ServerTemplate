import { log } from 'console';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
const mongod = MongoMemoryServer.create();

export class MongoDBMemoryServer {

    private static instance : MongoDBMemoryServer | null = null;
 
    private constructor(){
        this.connect();

    }

    public static getInstance() : MongoDBMemoryServer{
        try{
        if(MongoDBMemoryServer.instance == null){
            log("new instance of database created")
            this.instance = new MongoDBMemoryServer();
            return this.instance;
       }
        else{
            log("same instanced")
            return this.instance as MongoDBMemoryServer;
        }
    }catch(e){
        log(e)
        return this.instance as MongoDBMemoryServer;

    }
    }
    public connect = async () => {
        const uri = (await mongod).getUri();
        mongoose.createConnection(uri, {
            dbName : 'testDB'
            // add more config if you need
        })  as mongoose.Connection;
        
    
  
    }
    public closeDatabase = async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await (await mongod).stop();
    }
    public clearDatabase = async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }

    public getDatabase(){

        return mongoose.connections[0].db
    }

    public getConnection(){
        return mongoose.connections[0];
    }


    
}


