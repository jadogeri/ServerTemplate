import { getController } from "../../../../src/controllers/getController";
import request from 'supertest'; 
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { MongoClient, Db } from "mongodb";


import { app } from "../../../../index";
import {users } from "../../../__mocks__/users"
const { ObjectId } = require('mongodb');



let client: MongoClient;
let container: StartedTestContainer;

let getDB = ()=>{
  return client.db("testdb")
}

async function startMongoContainer() {
  // Use a GenericContainer for MongoDB
  container = await new GenericContainer("mongo:latest")
    .withExposedPorts(8080)
    .start();

  const connectionString = `mongodb://localhost:${container.getMappedPort(27017)}`;
  client = new MongoClient(connectionString);
  await client.connect();
  console.log("MongoDB container and client connected.");
}

async function stopMongoContainer() {
  if (client) {
    await client.close();
  }
  if (container) {
    await container.stop();
  }
  console.log("MongoDB container stopped and client disconnected.");
}

// Global hook for Jest
beforeAll(async () => {
  await startMongoContainer();
}, 60000); // Increase timeout for container startup

afterAll(async () => {
  await stopMongoContainer();
});


const BASE_URL= "http://localhost:8080/api/v2/users"


let mongoContainer: StartedTestContainer;
let mongoClient: MongoClient;
let db: Db;

// describe('testing user e2e requests', () => {
//   let userController =  getController();
    
//   beforeAll(async () => {
  
//     try{
//     mongoContainer = await new GenericContainer("mongo:latest")
//         .withExposedPorts(27017)
//         .start();

//     const mongoUri = `mongodb://localhost:${mongoContainer.getMappedPort(27017)}/testdb`;
//     console.log("mogo uri " , mongoUri)
//     mongoClient = new MongoClient(mongoUri);
//     let conn  = await mongoClient.connect();
//     // db = mongoClient.db();
//     db = conn.db();

//         const collections = await db.listCollections().toArray();

//     console.log(`Collections in database '${db.databaseName}':`);
//     collections.forEach(collection => {
//       console.log(`collection name ======================- ${collection.name}`);

//     })

//   }catch(error: unknown){
//     console.log("*********************************** error ************************************************* ",error)
//   }
//   });


//   beforeEach(async () => {
//     // Clear the collection before each test
//     await db.collection('User').deleteMany({});
    
//   });

//   it('should create a new user and retrieve it', async () => {
//     console.log("db instance mongo == " + JSON.stringify((await db.collections()).forEach((name)=>{
//       return name
//     }), null, 4));
//     const userData = 
//     { username: 'John1@0Doe', email: 'josephadogeridev@gmail.com',password:'J0h1n@D0e1'};

//     // Simulate API call to create user

//     let url = BASE_URL + '/register';
//     console.log("url ============== " + url)
    
//     const createResponse = await request(app)
//       .post(BASE_URL + '/register')
//       .send(userData)
//       .expect(201); // Assuming 201 Created on success

//     const userId = createResponse.body.id; // Get the ID from the response

//     // Verify user in the database directly (optional, but good for E2E)
//     const storedUser = await userController.loginUser(userId);
//     expect(storedUser).toMatchObject(userData);

//     // Simulate API call to get user
//     const getResponse = await request(app)
//       .get(BASE_URL + `/login`)
//       .send(userData)

//       .expect(200);

//     expect(getResponse.body).toMatchObject(userData);
//   },10000);
        
//     //await db.connect()


//   // beforeEach(async () => {
    
//   //   await db.connect()
//   // });
// //   afterEach(async () => {
// //     await db.clearDatabase()
// //   });
//   afterAll(async () => {
//     // await db.clearDatabase()
//     // await db.closeDatabase()
//       await mongoClient.close();
//         await mongoContainer.stop();
    
//   });

//     // global.localStorage = new LocalStorage('./tests/storage');
//     // registerUserTest();
//     // loginUserTest();
//     // currentUserTest()
//     // forgotUserTest()
//     // resetUserTest()
//     // logoutUserTest()
//     // deactivateUserTest()    




  
// });


  test('registers user Tesing in isolation', async () => {

    try{


      let initUser = users[0]
      console.log("init user ========================",initUser)

     const res = await request(app).post('/register').send(initUser)    

      console.log("data retrieved from test == ",JSON.stringify(res.body))

      expect(res.statusCode).toEqual(201);
      expect(res.body.username).toBe("initUser.use")
    }catch(e: unknown){
      console.log("eroor at line 180*******************************************************", e);
        if(e instanceof AggregateError){
  console.log("message",e.message); // "Hello"
  console.log("name",e.name); // "AggregateError"
  console.log(e.errors); // [ Error: "some error" ]
        }
    }    
 
  },30000)

describe('MyService', () => {
  it('should insert and find a document', async () => {
    const db = getDB();
    const collection = db.collection('testCollection');

const id = new ObjectId();

    const testDocument = { _id: id, value: 'hello' };

    // Insert a document
    await collection.insertOne(testDocument);

    // Find the document
    const foundDocument = await collection.findOne({ _id: id });

    expect(foundDocument).toEqual(testDocument);
  });
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