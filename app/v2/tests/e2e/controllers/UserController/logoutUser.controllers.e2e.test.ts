
import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
import request from "supertest";
import app  from "../../../../index";
import {log } from "console"
import { UserLoginRequestDTO } from '../../../../src/dtos/request/UserLoginRequestDTO';

  import * as db from "../../../MongoTestServer"
import { UserRegisterRequestDTO } from '../../../../src/dtos/request/UserRegisterRequestDTO';

      let mockObj : UserRegisterRequestDTO= {
        username: "josephadogeridev",
        password: "jo53phAd0@1",
        email: "josephadogeridev@gmail.com",
        phone : "15041234567"
      }
describe('UserController.loginUser() login a user', () => {
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  afterEach(async () => await db.clearDatabase()); // Clear data after each test
  afterAll(async () => await db.closeDatabase());
  

  describe('Happy Paths',  () => {


      test('should login user successfully', async () => {

    try{

       await request(app).post('/api/v2/users/register')    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(mockObj)))

      const authUser : UserLoginRequestDTO = {
        password : mockObj.password,
        email: mockObj.email
      } 
      const res = await request(app).post('/api/v2/users/login')    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(authUser)))
      const {accessToken} = res.body;
      console.log("token:::::::::::::::::::::::::::::::::::::::::::: ", accessToken);

      //retriece token and use to logout
      const logoutRes = await request(app).post('/api/v2/users/logout')    
      .set({"content-type":"application/json"})
      .set('Authorization', `Bearer ${accessToken}`)
      expect(logoutRes.body).toBeDefined();
      expect(logoutRes.body).toHaveProperty("message")
      expect(logoutRes.body.message).toBe("Successfully logged out user josephadogeridev");      
      expect(logoutRes.statusCode).toEqual(200);
    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message)
                console.log("name: ", e.name)
                        console.log("stack: ", e.stack)


      }
    }    
 
  }, 10000)



})
  describe('Edge cases',  () => {

      test('should reject undefined token', async () => {

    try{

       await request(app).post('/api/v2/users/register')    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(mockObj)))

      const authUser : UserLoginRequestDTO = {
        password : mockObj.password,
        email: mockObj.email
      } 
       await request(app).post('/api/v2/users/login')    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(authUser)))

      const accessToken = undefined;

            console.log("token:::::::::::::::::::::::::::::::::::::::::::: ", accessToken);


      //retriece token and use to logout
      const logoutRes = await request(app).post('/api/v2/users/logout')    
      .set({"content-type":"application/json"})
      .set('Authorization', `Bearer ${accessToken}`);

      console.log("logoutRes::::::::::::::::::::::::::::::::::::: ", logoutRes.body, logoutRes.error)
      expect(logoutRes).toBeUndefined();
      expect(logoutRes.statusCode).toEqual(200);
    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message)
                console.log("name: ", e.name)
                        console.log("stack: ", e.stack)


      }
    }    
 
  }, 10000)


    });

});










