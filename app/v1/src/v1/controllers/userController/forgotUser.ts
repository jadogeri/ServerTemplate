/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 09-FEB-2025
 *
 */

import { Response, Request } from 'express';
import { IUserForgot } from "../../interfaces/IUserForgot";
import * as userService from "../../services/userService"
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import * as bcrypt from "bcrypt"
import { isValidEmail } from '../../utils/inputValidation';
import { IUser } from '../../interfaces/IUser';
const asyncHandler = require("express-async-handler");
import { generateRandomUUID } from '../../utils/generateRandonUUID';
import { Recipient } from '../../types/Recipient';
import { sendEmail } from '../../tools/mail/utils/sendEmail';

/**
*@desc Forgot a user
*@route POST /api/users/forgot
*@access public
*/

export const forgotUser = asyncHandler(async (req: Request, res : Response) => {

  const { email} : IUserForgot = req.body;
  if (!email ) {
    res.status(400);
    throw new Error("Email is mandatory!");
  }
  if(!isValidEmail(email)){
    errorBroadcaster(res,400,"not a  valid email")
  }

  const user  = await userService.getByEmail(email);
  if (!user) {
    errorBroadcaster(res,400,`Invalid Email ${email}`);
  }else{
    //generate unique password
    const size : number = parseInt(process.env.NANOID_SIZE as string);
    
    // Using the alphanumeric dictionary
    const uuid = generateRandomUUID(size)  

    console.log("uuid === ", uuid);
    //hash generated password
    const hashedPassword : string = await bcrypt.hash(uuid , parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
    console.log("Hashed Password: ", hashedPassword);
    //store generated password in database and unlock account
    const updatedUser : IUser = {
      password : hashedPassword,
      failedLogins : 0,
      isEnabled : true
    }
    await userService.update(user._id, updatedUser)
    //update user password with uuid
    .then(()=>{
      let recipient : Recipient ={
        company : process.env.COMPANY as string,
        username : user.username,
        email : user.email,
        password : uuid
      }
      sendEmail("forgot-password",recipient)
    res.status(200).json({ password: uuid });

    })
  }
});


