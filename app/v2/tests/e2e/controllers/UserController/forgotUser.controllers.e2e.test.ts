
import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
import request from "supertest";
import app  from "../../../../index";
import * as db from "../../../MongoTestServer"

describe('UserController.forgotUser()forgot a user credential', () => {
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  afterEach(async () => await db.clearDatabase()); // Clear data after each test
  afterAll(async () => await db.closeDatabase());
  

describe('Happy Paths',  () => {
  test('should send user new credentials successfully', async () => {

    try{

      const res = await request(app).post(`/api/v2/users/forgot`).send({email : users[0].email}); 

      const {password} = res.body;

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeDefined();
      expect(password).toBeDefined();

    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message);
        console.log("name: ", e.name);
        console.log("stack: ", e.stack);
      }
    }    
 
  }, 10000)

})

});




