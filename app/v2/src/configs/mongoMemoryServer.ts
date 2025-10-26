    import { MongoMemoryServer } from 'mongodb-memory-server';

    
    const mongoServerInstance = async ()=> await MongoMemoryServer.create({
      instance: {
        port: 50000, // by default choose any free port
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

    export default mongoServerInstance;