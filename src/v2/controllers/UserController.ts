/**
 * @author Joseph Adogeri
 * @version 1.0
 * @since 09-FEB-2025
 *
 */
import asyncHandler from '../../v1/utils/asyncHandler';
import { response, Response } from 'express';
import { IJwtPayload } from '../interfaces/IJWTPayload';
import UserService from '../services/UserService';

/**
*@desc Current user info
*@route POST /api/users/current
*@access private
*/

class UserController{

  private userService : UserService;

  constructor(userService: UserService){

    this.userService = userService;
  }


  currentUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.currentUser();

    res.status(200).json({message: "create user"});
  });

  registerUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.registerUser();

    res.status(200).json({message: "register user"});
  });

  loginUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.loginUser();

    res.status(200).json({message: "login user"});
  });

  logoutUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.logoutUser();

    res.status(200).json({message: "logout user"});
  });

  forgotUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.forgotUser();

    res.status(200).json({message: "forgot user"});
  });

  resetUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.resetUser();

    res.status(200).json({message: "reset user"});
  });

  deactivateUser = asyncHandler(async (req : any, res: Response) => {

    this.userService.deactivateUser();

    res.status(200).json({message: "deactivate user"});
  });

}

export default UserController;