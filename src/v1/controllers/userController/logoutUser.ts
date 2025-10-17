/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 18-JAN-2025
 *
 */

const asyncHandler = require("express-async-handler");
import { Response, Request } from 'express';
import { IUserAuthorized } from "../../interfaces/IUserAuthorized";
import { errorBroadcaster } from "../../utils/errorBroadcaster";
import * as authService from "../../services/authService"
import { IAuth } from '../../interfaces/IAuth';
/**
*@desc Logout a user
*@route POST /api/users/logout
*@access public
*/


export const logoutUser = asyncHandler(async (req: Request, res : Response) => {
   
  const {token} :IUserAuthorized = req.body
  console.log("token==================", token)
  if(!token){ 
    errorBroadcaster(res,400,"field token is mandatory");
  } 
  const authenticatedUser = await authService.getByToken(token)
  if(!authenticatedUser){
    res.status(401).json({ message: "Already logged out" });
  }
  //remove auth from Auth Collection
  
  let logoutAuth : IAuth = {
    token : token
  }
  await authService.remove(logoutAuth)


  
  res.status(200).json({ message: "logout the user" });
});




