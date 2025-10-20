import { Request } from "express";

export interface UserDeactivateRequestDTO extends Request{
    email: string;
    password : string,
    confirm : boolean
}
