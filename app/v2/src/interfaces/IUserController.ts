import { UserDeactivateRequestDTO } from "../dtos/request/UserDeactivateRequestDTO";
import { UserForgotRequestDTO } from "../dtos/request/UserForgotRequestDTO";
import { UserLoginRequestDTO } from "../dtos/request/UserLoginRequestDTO";
import { UserRegisterRequestDTO } from "../dtos/request/UserRegisterRequestDTO";
import { UserResetRequestDTO } from "../dtos/request/UserResetRequestDTO";
import { IJwtPayload } from "./IJWTPayload";

    import { Request, Response }  from "express"    

export interface IUserController {

    registerUser(req: Request<{}, {}, UserRegisterRequestDTO>, res: Response) : Promise<void>;
    
    loginUser(req: Request<{}, {}, UserLoginRequestDTO>, res: Response): Promise<void>;

    forgotUser(req: Request<{}, {}, UserForgotRequestDTO>, res: Response) : Promise<void>;

    currentUser (req : IJwtPayload , res: Response) : Promise<any | undefined>;

    logoutUser(req: Request<{}, {}, IJwtPayload>, res: Response) : Promise<void>;

    resetUser(req: Request<{}, {}, UserResetRequestDTO>, res: Response) : Promise<void>;

    deactivateUser(req: Request<{}, {}, UserDeactivateRequestDTO>, res: Response) : Promise<void> ;

}