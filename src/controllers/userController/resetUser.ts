/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 18-JAN-2025
 *
 */

const asyncHandler = require("express-async-handler");
import { Response, Request } from 'express';
import { IUserReset } from "../../interfaces/IUserReset";
import * as userService from "../../services/userService"
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import * as bcrypt from "bcrypt"
import { isValidEmail, isValidPassword } from '../../utils/inputValidation';
import { IUser } from '../../interfaces/IUser';
import { sendEmail } from '../../tools/mail/utils/sendEmail';
import { Recipient } from '../../types/Recipient';

/**
*@desc Reset a user
*@route PUT /api/users/reset
*@access public
*/

export const resetUser = asyncHandler(async (req: Request, res : Response) => {

  const { email, new_password, old_password } : IUserReset = req.body;
    console.log(email,new_password,old_password)
    if (!email || !new_password ||!old_password) {
      res.status(400);
      throw new Error("All fields are mandatory!");

    }
    if(!isValidEmail(email as string)){
      errorBroadcaster(res,400,"not a  valid email")
  
    }
    if(!isValidPassword(new_password as string)){
      errorBroadcaster(res,400,"not a valid new password")
    }  

        const user  = await userService.getByEmail(email as string);
  if (!user) {
    errorBroadcaster(res,400,`Invalid Email ${email}`);
  }else{
    if(!(await bcrypt.compare(old_password,user.password as string))){
      errorBroadcaster(res,400,`Invalid password`);
    }else{
      const hashedPassword : string = await bcrypt.hash(new_password , parseInt(process.env.BCRYPT_SALT_ROUNDS as string));
      console.log("Hashed Password: ", hashedPassword);
      const updatedUser : IUser = {
        password : hashedPassword,

      }
      await userService.update(user._id, updatedUser)
      const recipient : Recipient = {
        username : user.username,
        email : user.email,
        company : process.env.COMPANY
      }
      sendEmail("reset-password",recipient)
      res.status(200).json({ message: "updated user password" });
    }

  }
  res.json({ message: "something went wrong" });
});




