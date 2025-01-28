declare global {
  var localStorage: LocalStorage;
    namespace Express {
      interface Request {

      }
    }
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            MONGO_URI: string;
            ACCESS_TOKEN_SECRET: string;
            SALT_ROUNDS : string;
            CONNECTION_STRING : string;
            BASE_URL : string;
            NANOID_SIZE : string;
            PORT: number
        }
    }
  }

  export {}