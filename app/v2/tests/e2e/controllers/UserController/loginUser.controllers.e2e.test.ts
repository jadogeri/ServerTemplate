
import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
import request from "supertest";
import app  from "../../../../index";
import {log } from "console"
import { UserLoginRequestDTO } from '../../../../src/dtos/request/UserLoginRequestDTO';

  import * as db from "../../../MongoTestServer"

describe('UserController.loginUser() login a user', () => {
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  afterEach(async () => await db.clearDatabase()); // Clear data after each test
  afterAll(async () => await db.closeDatabase());
  
  describe('Happy Paths',  () => {

      test('should login user successfully', async () => {

    try{

      const authUser : UserLoginRequestDTO = {
        password : users[2].password as string,
        email: users[2].email as string
      } 
      const res = await request(app).post('/api/v2/users/login')    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(authUser)))

      log("data retrieved from test == ",JSON.stringify(res))
      const data = res.body;
      expect(res.body.accessToken).toBeDefined();
      expect(res.statusCode).toEqual(200);
    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message)
                console.log("name: ", e.name)
                        console.log("stack: ", e.stack)


      }
    }    
 
  }, 10000)

    test('should reject missing email grafecully', async () => {
      const authUser : UserLoginRequestDTO = {
        password : users[2].password as string,
        email: ""
      } 
      const res = await request(app)
      .post('/api/v2/users/login')
      .set({"content-type":"application/json"})
      .send(JSON.stringify(authUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('All fields are mandatory!');
      expect(e.stackTrace).toContain('Error: All fields are mandatory!');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);

     test('should reject missing password grafecully', async () => {
      const authUser : UserLoginRequestDTO = {
        password : "",
        email: users[2].password as string,
      } 
      const res = await request(app)
      .post('/api/v2/users/login')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(authUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('All fields are mandatory!');
      expect(e.stackTrace).toContain('Error: All fields are mandatory!');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);

})
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
      console.log("error parsed ", e)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('email does not exist');
      expect(e.stackTrace).toContain('Error: email does not exist');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);


    test('should reject invalid password format gracecully', async () => {
      const newUser = users[1]
      newUser.password = "yrtyhgg"
      console.log("newUser: in email test ", newUser)
      const res = await request(app)
      .post('/api/v2/users/login')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      console.log("error parsed ", e)
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
      console.log("error parsed ", e)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('Account is locked because of too many failed login attempts. Use /forgt route to access acount');
      expect(e.stackTrace).toContain('Account is locked');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);

    test('should http response of locked account', async () => {
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
      console.log("error parsed ", e)
      expect(e.title).toEqual('Locked account');
      expect(e.message).toBe('Account is locked, use forget account to access acount');
      expect(e.stackTrace).toContain('Account is locked');
      expect(e).toBeDefined();
      expect(res.status).toBe(423);
    },6000);


    });

});










