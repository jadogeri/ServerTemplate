import { twilioClient, twilioPhoneNumber } from "../../configs/twilio";
import { Recipient } from "../../types/Recipient";


export const sendSms = (recipientPhoneNumber : string, recipient : Recipient)=>{

    twilioClient.messages
    .create({
      from: twilioPhoneNumber,
      to: recipientPhoneNumber,
      body: "Hello from Twilio and TypeScript!",
    })
    .then((message) => console.log(`Message SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error}`));

}