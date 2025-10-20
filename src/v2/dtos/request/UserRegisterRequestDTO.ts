import { Request } from "express";

export interface UserRegisterRequestDTO extends Request{
    username: string;
    email: string;
    password : string,
    phone : string
}
