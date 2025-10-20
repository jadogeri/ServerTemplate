import { Request } from "express";

export interface UserLoginRequestDTO extends Request{
    email: string;
    password : string,
}
