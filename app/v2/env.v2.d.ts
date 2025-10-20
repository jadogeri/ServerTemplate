import { IJwtPayload } from "./src/v2/interfaces/IJWTPayload";
import { UserRegisterRequestDTO } from "./src/v2/dtos/request/UserRegisterRequestDTO";
import { UserRegisterResponseDTO } from "./src/v2/dtos/response/UserRegisterResponseDTO";
import { ErrorResponse } from "./src/v2/entities/ErrorResponse";

declare global {
  var localStorage: LocalStorage;
    namespace Express {
      interface Request {
        token?: string,
        user?: {
            username:string;
            email:string
            id:mongoose.Types.ObjectId
        },
        body: IUser | IUserReset | IUserDeactivated | IUserForgot | IUserAuthorized |
            UserRegisterRequestDTO

      }
      interface Response {
      responseBody?: UserRegisterResponseDTO | ErrorResponse;
      json(body: UserRegisterResponseDTO): Response; // Type for the response body
      body: UserRegisterResponseDTO

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
        COMPANY : string;
        LOGO_URL : string;

      }
    }
  }

  export {}

  declare global {
    var localStorage: LocalStorage;
  }