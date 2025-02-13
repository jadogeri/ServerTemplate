/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 27-JAN-2025
 *
 */

const asyncHandler = require("express-async-handler");
import {hash} from "bcrypt";
import { Response, Request } from 'express';
import { IUser } from '../../interfaces/IUser';
import * as userService from "../../services/userService"
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import { isValidEmail, isValidPassword, isValidUsername, isValidatePhoneNumber } from "../../utils/inputValidation";
import { loadTemplate } from  '../../tools/mail/utils/loadTemplate';
import  transportMail  from "../../tools/mail/utils/transportMail";
import { Recipient } from "../../types/Recipient";
//const sendSms = require("../../tools/phone/sendSms")
/**
*@desc Register a user
*@route POST /api/users/register
*@access public
*/
let company = 'DeauxBoisSweets'


export const registerUser = asyncHandler(async (req: Request, res : Response) => {  
    
  const { username, email, password, phone } : IUser = req.body;
  
  if (!username || !email || !password) {
    errorBroadcaster(res,400,"All fields are mandatory!")
  }
  if(!isValidEmail(email as string)){
    errorBroadcaster(res,553,"not a  valid email")

  }
  if(!isValidUsername(username as string)){
    errorBroadcaster(res,400,"not a valid username")

  }
  if(!isValidPassword(password as string)){
    errorBroadcaster(res,400,"not a valid password")
  }  
//if phone number is provided check if string is a valid phone number
  if(phone){
    if(!isValidatePhoneNumber(phone as string)){
        errorBroadcaster(res,400,"not a valid phone number")
    }  
  }
  
  const userByEmailAvailable  = await userService.getByEmail(email as string);
  if (userByEmailAvailable) {
    errorBroadcaster(res,409,"User already registered!");
  }
  const userByUsernameAvailable  = await userService.getByUsername(username as string);
  if (userByUsernameAvailable) {
    errorBroadcaster(res,409,"Username already taken!");
  }

  
  console.log("1 ************************************")
  //Hash password
  const hashedPassword : string = await hash(password as string, parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
  console.log("Hashed Password: ", hashedPassword);
  const unregisteredUser : IUser = req.body 
  unregisteredUser.password = hashedPassword;
  //const user = await userService.create(unregisteredUser)
  await userService.create(unregisteredUser)  
  .then((user: IUser)=>{
    console.log("2 ************************************")

    let company = "Server Template KING"

     let recipient : Recipient= {username : user.username, email: user.email, company : company,test : "this is a test"}
    let recipients : Recipient[] = [];
    recipients.push(recipient)

     

     console.log("3 ************************************")

try{
    loadTemplate('register-account', recipients)
    .then((results: any) => {
      results.map((result: { context: { email: any; }; email: { subject: any; html: any; text: any; }; }) => {
                  transportMail({
              to: result.context.email,
              from: company,
              subject: result.email.subject,
              html: result.email.html,
              text: result.email.text,
              
          }).then(()=>{console.log("sent!!")})
          console.log("printing results.....................",JSON.stringify(result,null,4))
  
      })

      })
      
    


  console.log(`User created ${user}`);
  if (user) {
    //send response 
    res.status(201).json(user);
  }else{
    res.status(400).json({ message: "something went wrong" });
  }

}catch(e){
  console.log(e)
}
  
  /*


  if (user) {
    //send response 
    res.status(201).json(user);
  }else{
    res.status(400).json({ message: "something went wrong" });
  }


*/













   })  
  
  /*
  console.log(`User created ${user}`);
  
  if (user) {
    //send response 
    res.status(201).json(user);
  }else{
    res.status(400).json({ message: "something went wrong" });
  }
    */
});