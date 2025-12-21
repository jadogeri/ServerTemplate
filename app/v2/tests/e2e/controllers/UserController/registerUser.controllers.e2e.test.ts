
import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
import request from "supertest";
//const {BASE_URL}  = require("../../constants")
import app  from "../../../../index";
import { UserRegisterRequestDTO } from "../../../../src/dtos/request/UserRegisterRequestDTO";

  import * as db from "../../../MongoTestServer"
import User from '../../../../src/models/UserModel';
import { IUser } from '../../../../src/interfaces/IUser';

describe('UserController.registerUser()  register a user', () => {
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  afterEach(async () => await db.clearDatabase()); // Clear data after each test
  afterAll(async () => await db.closeDatabase());
  
  describe('Happy Paths',  () => {

      test('registers user Tesing in isolation', async () => {

    try{

      let mockObj : UserRegisterRequestDTO= {
        username: "josephadogeridev",
        password: "jo53phAd0@1",
        email: "josephadogeridev@gmail.com",
        phone : "15041234567"
      }
      const res = await request(app).post('/api/v2/users/register')
    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(mockObj)))

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
      let mockObj : UserRegisterRequestDTO= {
        username: "josephadogeridev",
        password: "jo53phAd0@1",
        email: "josephadogeridev@gmail.com",
      }
      const res = await request(app).post('/api/v2/users/register')
    
      .set({"content-type":"application/json"})
      .send( (JSON.stringify(mockObj)))

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
      const newUser : IUser = {
        username: users[0].username,
          password: users[0].password,
          email: "start" + users[0].email,
          phone : "15041234567"
        
      } 

      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})
      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Conflict');
      expect(e.message).toBe('Username already taken!');
      expect(e.stackTrace).toContain('Error: Username already taken!');
      expect(e).toBeDefined();
      expect(res.status).toBe(409);
    },6000);

     test('should reject duplicate email user accounts grafecully', async () => {
        const newUser : IUser = {
        username: "start" + users[0].username,
          password: users[0].password,
          email: users[0].email,
          phone : users[0].phone
        
      } 
      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Conflict');
      expect(e.message).toBe('Email already taken!');
      expect(e.stackTrace).toContain('Error: Email already taken!');
      expect(e).toBeDefined();
      expect(res.status).toBe(409);
    },6000);

    test('should reject invalid email format gracecully', async () => {
        const newUser : IUser = {
        username: users[0].username,
          password: users[0].password,
          email: "@email@mail.com",
          phone : users[0].phone
        
      } 
      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})

      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('not a valid email');
      expect(e.stackTrace).toContain('Error: not a valid email');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);


    test('should reject invalid password format gracecully', async () => {
        const newUser : IUser = {
        username: users[0].username,
          password: "yrtyhgg",
          email: users[0].email,
          phone : users[0].phone
        
      } 
      newUser.password = "yrtyhgg"
      const res = await request(app)
      .post('/api/v2/users/register')
      .set({"content-type":"application/json"})
      .send(JSON.stringify(newUser) )
      const e = await JSON.parse(res.text)
      expect(e.title).toEqual('Validation Failed');
      expect(e.message).toBe('not a valid password');
      expect(e.stackTrace).toContain('Error: not a valid password');
      expect(e).toBeDefined();
      expect(res.status).toBe(400);
    },6000);


    });

});
