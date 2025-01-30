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
        MONGODB_URI: string;
        JSON_WEB_TOKEN_SECRET: string;
        BCRYPT_SALT_ROUNDS : string;
        BASE_URL : string;
        NANOID_SIZE : string;
        PORT: number;
        NODEMAILER_USERNAME : string;
        NODEMAILER_PASSWORD : string;
        TWILIO_ACCOUNT_SID : string;
        TWILIO_AUTH_TOKEN : string;
        TWILIO_PHONE_NUMBER : string;
      }
    }
  }

  export {}