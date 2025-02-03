import mockingoose from "mockingoose";

import User from "../../../src/models/userModel";
import {getByEmail, 
        getByUsername, 
        create, 
        remove ,
        update } from "../../../src/services/userService"
import { MongoDBMemoryServer } from "../../../src/entities/MongoMemoryServer";
import mongoose from "mongoose";
const users = require("../../__mocks__/users")
import {log} from "console"

describe('createUser', () => {  

  beforeAll(()=>{
    
    MongoDBMemoryServer.getInstance()
    //MongoDBMemoryServer.getDatabase().connect();
    log("total connections == ",mongoose.connections.length)
    log("total connections == ",mongoose.Connection.name)
    log("names ===", mongoose.modelNames())


  })
  beforeEach(()=>{
    log("before each ............................................ ")
    //MongoDBMemoryServer.getDatabase().clearDatabase()
  })

  afterAll(()=>{
    log("afterall ............................................ ")

    // MongoDBMemoryServer.getDatabase().closeDatabase()
    // .then(()=> log("closed db"))
    // .catch(()=> log("unable to close  error"))
    //     log(MongoDBMemoryServer.getDatabase())
        
      
    // });  
    
    test('should create a new user', async () => {


      const mockUser =  {     "username" : "Bruce Wayne",
        "email" :  "brucewayne@gmail.com",
        "password" : "b@tMob1LeG0th",
        "phone" : "1986543210"
  
    }
    
   
      mockingoose(User).toReturn(mockUser, 'save');
  
      const user = new User(mockUser);
     const {email, username, phone, password} = await user.save();
     let savedUser = {email,username,phone,password}

     expect(savedUser).toMatchObject(mockUser)
     expect(savedUser).toMatchObject(mockUser)
     expect(savedUser).toMatchObject(mockUser)
     expect(savedUser).toMatchObject(mockUser)
     expect(savedUser).toMatchObject(mockUser)

  
  
    });

    
    
  });

});

















      // mockingoose([
      //   {
      //     title: 'Book 1',
      //     author: {
      //       firstname: 'John',
      //       lastname: 'Doe'
      //     },
      //     year: 2021,
      //   },
      //   {
      //     title: 'Book 2',
      //     author: {
      //       firstname: 'Jane',
      //       lastname: 'Doe'
      //     },
      //     year: 2022,
      //   }
      // ], 'find');
      // for( let i = 0; i < users.length; i++){
      //   const user = users[i]
      //   const {username, email, password, phone} = user
      //   const registeredUser = await create(username,email,password,phone)
      //   console.log("registeredUser === ",registeredUser)
      //   console.log("dummyuser === ",user)
      //   expect(registeredUser.username).toBe({})

      // }
  

////////////////////////////

/*
import mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import User from './user.model'; // Your User model

describe('User Model', () => {
  // Create
  it('should create a new user', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    mockingoose(User).toReturn(mockUser, 'save');

    const user = new User(mockUser);
    const savedUser = await user.save();

    expect(savedUser).toMatchObject(mockUser);
  });

  // Read
  it('should find a user by id', async () => {
    const mockUser = { _id: 'some-user-id', name: 'Jane Doe' };
    mockingoose(User).toReturn(mockUser, 'findOne');

    const user = await User.findById('some-user-id');

    expect(user).toMatchObject(mockUser);
  });

  // Update
  it('should update a user', async () => {
    const mockUser = { _id: 'some-user-id', name: 'Jane Doe' };
    mockingoose(User).toReturn(mockUser, 'findOneAndUpdate');

    const updatedUser = await User.findOneAndUpdate(
      { _id: 'some-user-id' },
      { name: 'Updated Name' },
      { new: true }
    );

    expect(updatedUser).toMatchObject({ _id: 'some-user-id', name: 'Updated Name' });
  });

  // Delete
  it('should delete a user', async () => {
    mockingoose(User).toReturn(true, 'findOneAndDelete');

    const result = await User.findOneAndDelete({ _id: 'some-user-id' });

    expect(result).toBeTruthy();
  });
});

  */