import { Request } from "express";

export interface UserForgotRequestDTO extends Request{
    email: string;
}
