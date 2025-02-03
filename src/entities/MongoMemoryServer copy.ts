import { log } from 'console';


export class MongoDBMemoryServer {

    private static instance : MongoDBMemoryServer | null = null;
    private database : MongoMemoryDatabase;

    private constructor(){

        this.database = new MongoMemoryDatabase();        
    }

    public static getInstance() : MongoDBMemoryServer{
        if(MongoDBMemoryServer.instance == null){
            log("new instance of database created")
            this.instance = new MongoDBMemoryServer();
            return this.instance;
       }
        else{
            log("same instanced")
            return this.instance as MongoDBMemoryServer;
        }
  
    }
    public getDatabase() {

        return this.database;
    }
    
}

