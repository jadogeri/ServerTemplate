import { twilioClient, twilioPhoneNumber } from "../../configs/twilio";


export const sendSms = (recipientPhoneNumber : string)=>{

    twilioClient.messages
    .create({
      from: twilioPhoneNumber,
      to: recipientPhoneNumber,
      body: "Hello from Twilio and TypeScript!",
    })
    .then((message) => console.log(`Message SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error}`));

}