const asyncHandler = require("express-async-handler");
import { Response, Request } from 'express';
import { IUserDeactivated } from "../../interfaces/IUserDeacitivated";
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import * as userService from "../../services/userService"
import * as authService from "../../services/authService"
import * as bcrypt from "bcrypt"
import { isValidEmail } from '../../utils/inputValidation';
import { IAuth } from '../../interfaces/IAuth';
import { sendEmail } from '../../tools/mail/utils/sendEmail';
import { Recipient } from '../../types/Recipient';


/**
*@desc Deactivate a user
*@route POST /api/users/deactivate
*@access public
*/

export const deactivateUser = asyncHandler(async (req: Request, res : Response) => {

  const { email, password, confirm}: IUserDeactivated = req.body
  if (!email || !password || confirm == undefined) {
    console.log(email,password,confirm)

    errorBroadcaster(res,400,"All fields are mandatory!");
  }
  if(!isValidEmail(email )){
    errorBroadcaster(res,400,"not a  valid email");

  }

  if(confirm!== true){
    errorBroadcaster(res,400,"confirm must be true");

  }
  const registeredUser = await userService.getByEmail(email);
  if(!registeredUser){
    errorBroadcaster(res,400,"Email does not exist");
  }

  if(!(await bcrypt.compare(password,registeredUser?.password as string))) {
    errorBroadcaster(res,400,"Invalid password or email");
  }

  
  
    const deactivateAuth : IAuth = {
      id : registeredUser?._id
    }
    await authService.remove(deactivateAuth)
  
  await userService.remove(registeredUser!._id)

    const recipient : Recipient = {
      username : registeredUser?.username,
      email : registeredUser?.email,
      company : process.env.COMPANY
    }
    sendEmail("deactivate-account",recipient)

  res.json({ message: `deactivated acoount with email ${email}` });
});




