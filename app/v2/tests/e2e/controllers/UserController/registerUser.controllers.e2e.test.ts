//import { registerUserTest } from "./registerUserTest";
// import { loginUserTest } from "./loginUserTest";
// import { currentUserTest } from "./currentUserTest";
// import { logoutUserTest } from "./logoutUserTest";
// import { forgotUserTest } from "./forgotUserTest";
// import { resetUserTest } from "./resetUserTest";
// import {deactivateUserTest } from "./deactivateUserTest";
import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
import request from "supertest";
//const {BASE_URL}  = require("../../constants")
import app  from "../../../../index";
import {log } from "console"
import { UserRegisterRequestDTO } from "../../../../src/dtos/request/UserRegisterRequestDTO";

  import * as db from "../../../MongoTestServer"
import User from '../../../../src/models/UserModel';

describe('UserController.registerUser()  register a user', () => {
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  afterEach(async () => await db.clearDatabase()); // Clear data after each test
  afterAll(async () => await db.closeDatabase());
  
  describe('Happy Paths',  () => {

      test('registers user Tesing in isolation', async () => {

    try{

      const datares = await User.find();
      console.log("data in mongo db*********************************8 ", datares)


      let mockObj : UserRegisterRequestDTO= {
        username: "josephadogeridev",
        password: "jo53phAd0@1",
        email: "josephadogeridev@gmail.com",
        phone : "15041234567"
      }
      const res = await request(app).post('/api/v2/users/register')
    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(mockObj)))

      log("data retrieved from test == ",JSON.stringify(res))
      const data = res.body;
      console.log("data*********************************8 ", data)

      expect(res.body.username).toBe("josephadogeridev")
      expect(res.statusCode).toEqual(201);
    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message)
                console.log("name: ", e.name)
                        console.log("stack: ", e.stack)


      }
    }    
 
  }, 10000)


  
    test('Should register user with missing optional fields', async () => {

    try{

      const datares = await User.find();
      console.log("data in mongo db*********************************8 ", datares)


      let mockObj : UserRegisterRequestDTO= {
        username: "josephadogeridev",
        password: "jo53phAd0@1",
        email: "josephadogeridev@gmail.com",
      }
      const res = await request(app).post('/api/v2/users/register')
    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(mockObj)))

      log("data retrieved from test == ",JSON.stringify(res))
      const data = res.body;
      console.log("data*********************************8 ", data)

      expect(res.body.username).toBe("josephadogeridev")
      expect(res.statusCode).toEqual(201);
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

    test('should reject duplicate username user accounts grafecully', async () => {
      const newUser = users[0]
      newUser.email = "start" + newUser.email
            // console.log("newUser: in username test ", newUser)

      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})
      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      // console.log("error parsed ", e)
      expect(e.title).toEqual('Conflict');
      expect(e.message).toBe('Username already taken!');
      expect(e.stackTrace).toContain('Error: Username already taken!');
      expect(e).toBeDefined();
      expect(res.status).toBe(409);
    },6000);

     test('should reject duplicate email user accounts grafecully', async () => {
      const newUser = users[0]
      newUser.username = "start" + newUser.username
      console.log("newUser: in email test ", newUser)
      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      console.log("error parsed ", e)
      expect(e.title).toEqual('Conflict');
      expect(e.message).toBe('Email already taken!');
      expect(e.stackTrace).toContain('Error: Email already taken!');
      expect(e).toBeDefined();
      expect(res.status).toBe(409);
    },6000);



    test('should reject invalid email format grafecully', async () => {
      const newUser = users[0]
      newUser.email = "@email@mail.com"
      console.log("newUser: in email test ", newUser)
      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      console.log("error parsed ", e)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('not a valid email');
      expect(e.stackTrace).toContain('Error: not a valid email');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);


    });

});
