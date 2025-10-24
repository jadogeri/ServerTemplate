// import { LocalStorage } from "node-localstorage";
// import * as db from "../../MongoMemoryServer"
// import { registerUserTest } from "./registerUserTest";
// import { loginUserTest } from "./loginUserTest";
// import { currentUserTest } from "./currentUserTest";
// import { logoutUserTest } from "./logoutUserTest";
// import { forgotUserTest } from "./forgotUserTest";
// import { resetUserTest } from "./resetUserTest";
// import {deactivateUserTest } from "./deactivateUserTest";
const request = require('supertest'); 
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { MongoClient } from "mongodb";

const app = require("../../../../index")

const { ObjectId } = require('mongodb');


class UserController {
  usersCollection: any;
  constructor(db: { collection: (arg0: string) => any; }) {
    this.usersCollection = db.collection('users');
  }

  async createUser(userData: any) {
    const result = await this.usersCollection.insertOne(userData);
    return result.insertedId;
  }

  async getUserById(id: any) {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user;
  }
}


let mongoContainer: StartedTestContainer;
let mongoClient: MongoClient;
let db: any;

describe('testing user e2e requests', () => {
  let userController: UserController;
    
  beforeAll(async () => {
    mongoContainer = await new GenericContainer("mongo:latest")
        .withExposedPorts(27017)
        .start();

    const mongoUri = `mongodb://localhost:${mongoContainer.getMappedPort(27017)}/testdb`;
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db();
    });


  beforeEach(async () => {
    // Clear the collection before each test
    await db.collection('users').deleteMany({});
    userController = new UserController(db); // Initialize controller with the test DB
  });

  it('should create a new user and retrieve it', async () => {
    const userData = { name: 'John Doe', email: 'john.doe@example.com' };

    // Simulate API call to create user
    const createResponse = await request(app)
      .post('/users')
      .send(userData)
      .expect(201); // Assuming 201 Created on success

    const userId = createResponse.body.id; // Get the ID from the response

    // Verify user in the database directly (optional, but good for E2E)
    const storedUser = await userController.getUserById(userId);
    expect(storedUser).toMatchObject(userData);

    // Simulate API call to get user
    const getResponse = await request(app)
      .get(`/users/${userId}`)
      .expect(200);

    expect(getResponse.body).toMatchObject(userData);
  });
        
    //await db.connect()


  // beforeEach(async () => {
    
  //   await db.connect()
  // });
//   afterEach(async () => {
//     await db.clearDatabase()
//   });
  afterAll(async () => {
    // await db.clearDatabase()
    // await db.closeDatabase()
      await mongoClient.close();
        await mongoContainer.stop();
    
  });

    // global.localStorage = new LocalStorage('./tests/storage');
    // registerUserTest();
    // loginUserTest();
    // currentUserTest()
    // forgotUserTest()
    // resetUserTest()
    // logoutUserTest()
    // deactivateUserTest()    




  
});


/**
 * 
 * 
 


import * as userService from '../../../src/services/userService';
import * as db from "../../MongoMemoryServer"
import User from '../../../src/models/userModel'; // Your User model
import { IUser } from '../../../src/interfaces/IUser';
import { validateStringEquality, validateNotEmpty } from '../../validators';
import { log } from 'console';
import mongoose from 'mongoose';
const users = require("../../__mocks__/users")


describe('userService', () => {

  beforeAll(async () => {
    
    await db.connect()
  });

  // beforeEach(async () => {
    
  //   await db.connect()
  // });
  afterEach(async () => {
    await db.clearDatabase()
  });
  afterAll(async () => {
    await db.closeDatabase()
  });




 */