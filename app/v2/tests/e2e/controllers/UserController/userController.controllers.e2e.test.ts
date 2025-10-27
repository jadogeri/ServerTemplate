// import { LocalStorage } from "node-localstorage";
// import * as db from "../../MongoMemoryServer"
// import { registerUserTest } from "./registerUserTest";
// import { loginUserTest } from "./loginUserTest";
// import { currentUserTest } from "./currentUserTest";
// import { logoutUserTest } from "./logoutUserTest";
// import { forgotUserTest } from "./forgotUserTest";
// import { resetUserTest } from "./resetUserTest";
// import {deactivateUserTest } from "./deactivateUserTest";

//import { registerUserTests } from "./registerUserTest";
import * as db from '../,./../../../MongoTestServer'; // Import your database setup file
import {  test, describe,  expect } from '@jest/globals';
import request from 'supertest';
import { users } from '../../../__mocks__/users';
import { IUser } from '../../../../src/interfaces/IUser';
//import app from "../../../../index"
const app = require("../../../../index")


describe('testing user and contact api requests', () => {
  
  beforeAll(async () => await db.connect());
  beforeEach(async () => await db.seedDatabase());
  //afterEach(async () => await db.clearDatabase()); // Clear data after each test
  //afterAll(async () => await db.closeDatabase());

    // beforeAll(() =>console.log("beforea all.........................."));
    // beforeEach(() =>console.log("before each.........................."));
    // afterEach(() =>console.log("after each..........................")); // Clear data after each test
    // afterAll(() =>console.log("after all.........................."));

    test('should create a new user', async () => {
      const newUser = users[0]
      const res = await request(app).post('/api/v2/users/register').send(newUser as IUser)   
      console.log("the value of res is ", res)
      //add new json file to __mocks__ directory
      console.log("response object === ", res.body)
      //expect(res.body).toHaveProperty('id');
      expect(res.body.failedLogins).toBe(undefined);
      expect(res.body.email).toBe(undefined);


      // Verify data in the database
      // const createdUser = await getRepository(User).findOne({ where: { email: newUser.email } });
      //expect(createdUser).toBeDefined();
      //expect(createdUser?.name).toBe(newUser.name);
    },10000);

    //global.localStorage = new LocalStorage('./tests/storage');
    //registerUserTests();
    // loginUserTest();
    // currentUserTest()
    // forgotUserTest()
    // resetUserTest()
    // logoutUserTest()
    // deactivateUserTest()    

  
});
