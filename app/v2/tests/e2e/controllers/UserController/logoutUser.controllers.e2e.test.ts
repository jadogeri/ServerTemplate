
import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
import request from "supertest";
import app  from "../../../../index";
import {log } from "console"
import { UserLoginRequestDTO } from '../../../../src/dtos/request/UserLoginRequestDTO';

  import * as db from "../../../MongoTestServer"

describe('UserController.logoutUser() logout a user', () => {
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  afterEach(async () => await db.clearDatabase()); // Clear data after each test
  afterAll(async () => await db.closeDatabase());
  
  describe('Happy Paths',  () => {

      test('should logout an authenticated user successfully', async () => {

    try{

      const authUser : UserLoginRequestDTO = {
        password : users[2].password as string,
        email: users[2].email as string
      } 
      const loginResponse = await request(app).post('/api/v2/users/login')    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(authUser)))
      //retriece token and use to logout
      const accessToken = loginResponse.body.accessToken as string;
      const res = await request(app).post('/api/v2/users/logout')    
      .set({"content-type":"application/json"})
      .set('Authorization', `Bearer ${accessToken}`)
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toBe("logged out");      
      expect(res.statusCode).toEqual(200);


    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message)
                console.log("name: ", e.name)
                        console.log("stack: ", e.stack)


      }
    }    
 
  }, 10000)



})

/*
  describe('Edge cases',  () => {

    test('should reject unregistered email gracecully', async () => {
      const authUser : UserLoginRequestDTO = {
        password : users[2].password as string,
        email: "fakeemail@mail.com"
      } 

      const res = await request(app)
      .post('/api/v2/users/login')
      .set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('email does not exist');
      expect(e.stackTrace).toContain('Error: email does not exist');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);


    test('should reject invalid password format gracecully', async () => {
      const newUser = users[1]
      newUser.password = "yrtyhgg"
      const res = await request(app)
      .post('/api/v2/users/login')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('email or password is incorrect');
      expect(e.stackTrace).toContain('Error: email or password is incorrect');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);

    test('should lock account with 3 failed login attempts', async () => {
      const authUser : UserLoginRequestDTO = {
        password : "invalid password",
        email: users[2].email as string,
      } 
      //FIRST REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //SECOND REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //THIRD REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //FOURTH REQUEST
     const res =  await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('Account is locked because of too many failed login attempts. Use /forgt route to access acount');
      expect(e.stackTrace).toContain('Account is locked');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);

    test('should return http response of locked account', async () => {
      const authUser : UserLoginRequestDTO = {
        password : "invalid password",
        email: users[2].email as string,
      } 
      //FIRST REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //SECOND REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //THIRD REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //FOURTH REQUEST
      await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      //FIFTH REQUEST
     const res =  await request(app).post('/api/v2/users/login').set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Locked account');
      expect(e.message).toBe('Account is locked, use forget account to access acount');
      expect(e.stackTrace).toContain('Account is locked');
      expect(e).toBeDefined();
      expect(res.status).toBe(423);
    },6000);


    });

    */

});










