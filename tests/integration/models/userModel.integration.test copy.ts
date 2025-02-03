import mockingoose from "mockingoose";
import User from "../../../src/models/userModel";
import { MongoDBMemoryServer } from "../../../src/entities/MongoMemoryServer";
import mongoose, { mongo } from "mongoose";
const users = require("../../__mocks__/users")
import {log} from "console"
import { validateNotEmpty, validateStringEquality } from "../../tools/validators";
import { IUser } from "../../../src/interfaces/IUser";

describe('User Model', () => {  

  describe('create User', () => {  
    test('should create a new user', async () => {
      //Arrange
      let mockUser0 : IUser =  users[0]; 
       MongoDBMemoryServer.getInstance().connect()
       let db = MongoDBMemoryServer.getInstance().getDatabase() as mongoose.mongo.Db
       log("total connections == ",mongoose.connections.length)
       log("total connections == ",mongoose.Connection.name)
       log("names ===", mongoose.modelNames())

      //Act
      mockingoose(User).toReturn(mockUser0, 'save');  
      const user = new User(mockUser0);
      log("v===============================================",db)

      
      log("user created new User ===", user)
      const {email, username, phone, password} = await user.save();
      let savedUser : IUser = {email,username,phone,password}
      log("saved user ==", savedUser)

      //Assert
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("password");
      expect(user).toHaveProperty("phone");
      expect(savedUser).toMatchObject(mockUser0)
      validateNotEmpty(savedUser);
      validateStringEquality(savedUser.email, mockUser0.email);
      validateStringEquality(savedUser.username, mockUser0.username)
      validateStringEquality(savedUser.password, mockUser0.password)
      validateStringEquality(savedUser.phone, mockUser0.phone)  
  
    });

    test('should prevent duplicate user', async () => {
      //Arrange
      let mockUser0 : IUser =  users[0];   

      //Act
   
        
      const user = new User(mockUser0);
      log("user created new User ===", user)
      const {email, username, phone, password} = await user.save();
      let savedUser : IUser = {email,username,phone,password}
      log("saved user ==", savedUser)

      //Assert
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("password");
      expect(user).toHaveProperty("phone");
      expect(savedUser).toMatchObject(mockUser0)
      validateNotEmpty(savedUser);
      validateStringEquality(savedUser.email, mockUser0.email);
      validateStringEquality(savedUser.username, mockUser0.username)
      validateStringEquality(savedUser.password, mockUser0.password)
      validateStringEquality(savedUser.phone, mockUser0.phone)  
  
    });


  })

  beforeAll(async ()=>{
    
    let i = MongoDBMemoryServer.getInstance()
    await i.connect();

  
    
    // log("total connections == ",mongoose.connections.length)
    // log("total connections == ",mongoose.Connection.name)
    // log("names ===", mongoose.modelNames())


  })
  // beforeEach(()=>{
  //   log("before each ............................................ ")
  //   //MongoDBMemoryServer.getDatabase().clearDatabase()
  // })

  afterAll(()=>{
    log("afterall ............................................ ")

    MongoDBMemoryServer.getInstance().closeDatabase()
    .then(()=> log("closed db"))
    .catch(()=> log("unable to close  error"))
      
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