import { Request } from "express";

export interface UserResetRequestDTO extends Request{
    email: string;
    oldPassword : string,
    newPassword : string
    confirmNewPassword : string
}
