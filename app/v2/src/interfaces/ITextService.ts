import { Recipient } from "../types/Recipient";

export interface ITextService {

    sendSms(recipientPhoneNumber : string, recipient : Recipient): void;

}