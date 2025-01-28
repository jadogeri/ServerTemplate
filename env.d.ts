declare global {
  var localStorage: LocalStorage;
    namespace Express {
      interface Request {
        user: {
            username:string;
            email:string
            id:mongoose.Types.ObjectId
        },
        body: IUser | IUserReset | IUserDeactivated | IUserForgot | IUserAuthorized
      }
    }
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            MONGO_URI: string;
            ACCESS_TOKEN_SECRET: string;
            SALT_ROUNDS : string;
            BASE_URL : string;
            NANOID_SIZE : string;
            PORT: number
        }
    }
  }

  export {}