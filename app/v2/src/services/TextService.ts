
import { Recipient } from "../types/Recipient"
//import { twilioClient, twilioPhoneNumber } from "../configs/twilio";
//import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

// import { sendSms } from "../../tools/phone/sendSms";
 
class TextService {

  constructor(){
  }        

sendSms = (recipientPhoneNumber : string, recipient : Recipient)=>{

  // twilioClient
  // .messages
  //   .create({
  //     from: twilioPhoneNumber,
  //     to: recipientPhoneNumber,
  //     body: "Hello from Twilio and TypeScript!",
  //   })
  //   .then((message : unknown) =>{ 
  //     console.log(`Message SID: ${message}`);
  //    })
  //   .catch((error: unknown) =>{ 
  //     console.error(`Error sending SMS: ${error}`);
  //   });

}
 
}    

export default TextService;




















/**
 * 

   .then((user: IUser)=>{
 
     let recipient : Recipient= {username : user.username, email: user.email, company : company}  
 try{  
    sendEmail('register-account', recipient);
    //TODO ADD PHONE SENDING
   //  sendSms("YOUR TWILIO PHONE NUMBER",recipient)
   console.log(`User created ${JSON.stringify(user)}`);
   if (user) {
     //send response 
     res.status(201).json(user);
   }else{
     res.status(400).json({ message: "something went wrong" });
   }
 
 }catch(e){
   console.log(e)
 */