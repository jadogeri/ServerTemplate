import { Request } from "express";

export interface UserLoginRequestDTO extends Request{
    username: string;
    email: string;
    password : string,
}
