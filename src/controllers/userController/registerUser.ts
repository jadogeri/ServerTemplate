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
import { sendEmail } from "../../tools/mail/utils/sendEmail";
import { sendSms } from "../../tools/text/sendSms";
/**
*@desc Register a user
*@route POST /api/users/register
*@access public
*/
let company = process.env.COMPANY


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
    if(!isValidatePhoneNumber(phone )){
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

  
  //Hash password
  const hashedPassword : string = await hash(password as string, parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
  console.log("Hashed Password: ", hashedPassword);
  const unregisteredUser : IUser = req.body 
  unregisteredUser.password = hashedPassword;
  //const user = await userService.create(unregisteredUser)
  await userService.create(unregisteredUser)  
  .then((user: IUser)=>{

    let recipient : Recipient= {username : user.username, email: user.email, company : company}  
try{  
   sendEmail('register-account', recipient);
   sendSms("+15045414308")
  console.log(`User created ${JSON.stringify(user)}`);
  if (user) {
    //send response 
    res.status(201).json(user);
  }else{
    res.status(400).json({ message: "something went wrong" });
  }

}catch(e){
  console.log(e)
}
   })  
  
  })