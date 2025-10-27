import { Recipient } from "../types/Recipient";

export interface IEmailService {

  sendEmail (templateName : string, recipient : Recipient ) : void;

}