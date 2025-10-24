import { getController } from "../../../../src/controllers/getController";
import request from 'supertest'; 
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { MongoClient } from "mongodb";

const app = require("../../../../index")

const { ObjectId } = require('mongodb');

const BASE_URL= "http://localhost:6000/api/v2"


// class UserController {
//   usersCollection: any;
//   constructor(db: { collection: (arg0: string) => any; }) {
//     this.usersCollection = db.collection('users');
//   }

//   async createUser(userData: any) {
//     const result = await this.usersCollection.insertOne(userData);
//     return result.insertedId;
//   }

//   async getUserById(id: any) {
//     const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
//     return user;
//   }
// }


let mongoContainer: StartedTestContainer;
let mongoClient: MongoClient;
let db: any;

describe('testing user e2e requests', () => {
  let userController =  getController();
    
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
    
  });

  it('should create a new user and retrieve it', async () => {
    const userData = 
    { username: 'John1@0Doe', email: 'josephadogeridev@gmail.com',password:'J0h1n@D0e1'};

    // Simulate API call to create user
    const createResponse = await request(app)
      .post(BASE_URL + '/register')
      .send(userData)
      .expect(201); // Assuming 201 Created on success

    const userId = createResponse.body.id; // Get the ID from the response

    // Verify user in the database directly (optional, but good for E2E)
    const storedUser = await userController.loginUser(userId);
    expect(storedUser).toMatchObject(userData);

    // Simulate API call to get user
    const getResponse = await request(app)
      .get(BASE_URL + `/login`)
      .send(userData)

      .expect(200);

    expect(getResponse.body).toMatchObject(userData);
  },10000);
        
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