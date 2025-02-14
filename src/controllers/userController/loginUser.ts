/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 18-JAN-2025
 *
 */

const asyncHandler = require("express-async-handler");
import * as bcrypt from "bcrypt";
import { Response, Request } from 'express';
import { IUser } from '../../interfaces/IUser';
import * as  jwt from "jsonwebtoken";
import { IAuth } from "../../interfaces/IAuth";
import * as userService from"../../services/userService"
import * as authService from"../../services/authService"
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import { isValidEmail} from "../../utils/inputValidation";
import { sendEmail } from "../../tools/mail/utils/sendEmail";
import { Recipient } from "../../types/Recipient";

/**
*@desc Login user
*@route POST /api/users/login
*@access public
*/

export const loginUser = asyncHandler(async (req : Request, res: Response)  => {

  const { email, password } : IUser = req.body;
  console.log(email,password)
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  if(!isValidEmail(email)){
    errorBroadcaster(res,400,"not a valid standard email address")
  }

  const user  = await userService.getByEmail(email);

  if(user){

    if(user.isEnabled === false){      
      errorBroadcaster(res,423,"Account is locked, use forget account to access acount")
    }

    //compare password with hashedpassword 
    if (user &&  await bcrypt.compare(password,user.password as string)) {

      let payload = {
        user: {
          username: user.username as string , email: user.email as string , id: user._id ,
        },
      }
      //post fix operator   knowing value cant be undefined
      let secretKey  = process.env.JSON_WEB_TOKEN_SECRET! ;
      const accessToken  =  jwt.sign( payload,secretKey as jwt.Secret,  { expiresIn: "30m" } );
      //add token and id to auth 
      const authUser : IAuth = {
        id : user._id,
        token : accessToken
      }

      const authenticatedUser = await authService.getById(user._id);
      if(!authenticatedUser){

        await authService.create(authUser);
      }else{

        await authService.update(authUser);;     
      }

      //if failed logins > 0, 
      //reset to zero if account is not locked
      if(user.failedLogins as number > 0){

        const resetUser : IUser ={
          failedLogins: 0
        }

        await userService.update(user._id, resetUser)
      }
        res.status(200).json({ accessToken }); 
    }else{ 
      user.failedLogins = user.failedLogins  as number + 1      
      if(user.failedLogins === 3){

        user.isEnabled = false;
        await userService.update(user._id, user)
              const recipient : Recipient = {
                username : user.username,
                email : user.email,
                company : process.env.COMPANY
              }
        sendEmail("locked-account",recipient )
        res.status(400).json("Account is locked beacause of too many failed login attempts. Use forget account to access acount");

      }else{
        await userService.update(user._id, user)    
      }      
      res.status(400).json({ message: "email or password is correct" });
    }
  }else{
    res.status(400).json({ message: "email does not exist" });
  }

});
  




