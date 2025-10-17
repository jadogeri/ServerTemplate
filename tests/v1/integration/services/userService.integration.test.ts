// userService.test.js
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


  describe('create()', () => {
    test('should create a new user', async () => {

      //Arrange
      let user : IUser =  users[0];
        
      //Act  
      const createdUser = await userService.create(user);
  
      log(createdUser)
          //Assert
      validateNotEmpty(createdUser)    
    });

    test('should fail to create a new user without required fields', async () => {

      //Arrange
      let user : IUser =  users[0];
      //const user = new User(mockUser0);
        
      //Act  
      try {
        const fakeUser = {...user}
        delete fakeUser.email
        delete fakeUser.username
        await userService.create(user as any)
    
      } catch (error : any) {
          expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(error.errors).toBeDefined();
      } 
    });

    test("should fail to create user with fields of wrong type", async () => {
      //Arrange
      let user : IUser =  users[0];

      try {
        await userService.create(user as IUser)

        
      } catch (error : any) {
        expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(error.errors).toBeDefined();
      }
    });
  })

  describe('getByEmail()', () => {
    test('should retrieve a user by email', async () => {

      //Arrange
      let user0 : IUser =  users[0];
        
      //Act  
      const createdUser0 = (await userService.create(user0))
      const newUser = await createdUser0.save();
      
      let foundUser = await userService.getByEmail(user0.email as string)

      //Assert
      validateNotEmpty(foundUser)    
      validateStringEquality(( newUser).email, foundUser?.email )
      validateStringEquality(( newUser).username, foundUser?.username )
      validateStringEquality(( newUser).password, foundUser?.password )

    });

    test('should fail to find a user with fields of wrong type', async () => {

      //Arrange
      let user0 : IUser =  users[0];
      let fakeEmail : any = 1234567890
      
      //Act  
      const createdUser0 = (await userService.create(user0)).save();
      
      try {
       await userService.getByEmail(fakeEmail)      
    
      } catch (error : any) {
          expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(error.errors).toBeDefined();
      } 
    });
 
  })

  describe('getByUsername()', () => {
    test('should retrieve a user by username', async () => {

      //Arrange
      let user0 : IUser =  users[0];
        
      //Act  
      const createdUser0 = (await userService.create(user0))
      const newUser = await createdUser0.save();
      
      let foundUser = await userService.getByUsername(user0.username as string)

      //Assert
      validateNotEmpty(foundUser)    
      validateStringEquality(( newUser).email, foundUser?.email )
      validateStringEquality(( newUser).username, foundUser?.username )
      validateStringEquality(( newUser).password, foundUser?.password )

    });

    test('should fail to find a user with fields of wrong type', async () => {

      //Arrange
      let user0 : IUser =  users[0];
      let fakeUsername : any = 1234567890
      
      //Act  
      const createdUser0 = (await userService.create(user0)).save();
      
      try {
       await userService.getByUsername(fakeUsername)      
    
      } catch (error : any) {
          expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
          expect(error.errors).toBeDefined();
      } 
    });
 
  })

  describe('remove()', () => {
    test('should remove a user', async () => {

      //Arrange
      let user0 : IUser =  users[0];
      let user1 : IUser =  users[1];
      let user2 : IUser =  users[2];
      let user3 = new User(users[3]);

      const mockArray = [user0, user1, user2, user3]
        
      //Act  
      await User.insertMany(mockArray)
      const removedUser = await userService.remove(user3._id);
      const AllOtherUsers = await User.find();

  
      console.log("removed user =================================== ",removedUser)
          //Assert
      validateNotEmpty(removedUser)    
      expect(AllOtherUsers.length).toBe(3)
      expect(AllOtherUsers).not.toBe(removedUser)
    });

    test('should throw error if _id is wrong type', async () => {

      //Arrange
      let user0 : IUser =  users[0];
      let user1 : IUser =  users[1];
      let user2 : IUser =  users[2];
      let user3 = new User(users[3]);

      const mockArray = [user0, user1, user2, user3]
      const faked_id : any = "fakeid"
        
      //Act  
      try {
        
        await User.insertMany(mockArray)
     
         await userService.remove(faked_id);
    
      } catch (error : any) {
      //Assert
          expect(error).toBeInstanceOf(mongoose.Error.CastError);
          expect(error).toBeDefined();
      } 
    });

    test("should fail to remove user if _id does not match any user", async () => {
      //Arrange
       
       let user0 : IUser =  users[0];
       let user1 : IUser =  users[1];
       let user2 : IUser =  users[2];
       let user3 = new User(users[3]);
 
       const mockArray = [user0, user1, user2, user3]
       const generatedID = new mongoose.Types.ObjectId();

         
       //Act  
  
         await User.insertMany(mockArray)
    
        const removedUser = await userService.remove(generatedID)
        const AllOtherUsers = await User.find();

      //Assert
      expect(removedUser).toBeNull();
      expect(AllOtherUsers.length).toBe(4)              
        
     });
  })

  describe('update()', () => {
    test('should update a user', async () => {

      //Arrange
      let user0 =  new User(users[0]);
      let user1 : IUser =  users[1];
      let user2 : IUser =  users[2];
      let user3 : IUser =  users[3];

      const mockArray = [user0, user1, user2, user3]
        
      //Act  
      
      await User.insertMany(mockArray)
      let mockUser = user0;
      mockUser.username = "The Joker";
      mockUser.email = "joker@laughs.com";
      mockUser.password ="who1sTheB@tM@n"
      
      const updatedUser = await userService.update(mockUser._id, user0);
  
      console.log("removed user =================================== ",updatedUser)
          //Assert
      validateNotEmpty(updatedUser)    
      expect(updatedUser?.email).not.toEqual(user0.email)
      expect(updatedUser?.username).not.toEqual(user0.username)
      expect(updatedUser?.password).not.toEqual(user0.password)

    });

    test('should throw error if _id is wrong type', async () => {

      //Arrange     
      let user3 : IUser = users[3];
      const faked_id : any = "fakeid"
        
      //Act  
      try {
        
        await User.create(user3)     
         await userService.update(faked_id, user3);
    
      } catch (error : any) {
      //Assert
          expect(error).toBeInstanceOf(mongoose.Error.CastError);
          expect(error).toBeDefined();
      } 
    });

    test("should fail to update user if _id does not match any user", async () => {
      //Arrange
       
       let user0 : IUser =  users[0];
       let user1 : IUser =  users[1];
       let user2 : IUser =  users[2];
       let user3 = new User(users[3]);
 
       const mockArray = [user0, user1, user2, user3]
       const generatedID = new mongoose.Types.ObjectId();
       let mockUser : IUser = {
       username : "Joker",
       email : "Joker@gmail.com",
       password : "j0k@rh1k35AllD@y"
       }
         
       //Act  
  
         await User.insertMany(mockArray)
    
        const updatedUser = await userService.update(generatedID, mockUser)
        const foundUser = await User.findOne({ _id : user3._id});

      //Assert
      expect(updatedUser).toBeNull();
      expect(foundUser?.email).not.toEqual(mockUser.email)  
      expect(foundUser?.username).not.toEqual(mockUser.username)    
      expect(foundUser?.password).not.toEqual(mockUser.password)        
          
        
     });
  })












  // Similarly, write tests for getUserById, updateUser, and deleteUser
});