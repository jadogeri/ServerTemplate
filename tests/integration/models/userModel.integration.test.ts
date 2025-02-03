
import mockingoose from 'mockingoose';
import User from '../../../src/models/userModel'; // Your User model
import { IUser } from '../../../src/interfaces/IUser';
import {log} from "console"
import { validateStringEquality, validateNotEmpty } from '../../tools/validators';
const users = require("../../__mocks__/users")


describe('User Model', () => {
    // Create
  describe("create User", ()=>{
    test('should create a new user', async () => {

      //Arrange
      let mockUser0 : IUser =  users[0];
      const user = new User(mockUser0);
        
      //Act  
      mockingoose(User).toReturn(user, 'save');
      
      const {email, username, phone, password} = await user.save();
      let savedUser : IUser = {email,username,phone,password}

      //Assert
      validateNotEmpty(savedUser)
      
    });

    test('should have property', async () => {

      //Arrange
      let mockUser1 : IUser =  users[1];
      const user = new User(mockUser1);
        
      //Act  
      mockingoose(User).toReturn(user, 'save');      
      const savedUser = await user.save();

      //Assert
      expect(savedUser).toHaveProperty("_id");
      expect(savedUser).toHaveProperty("username");
      expect(savedUser).toHaveProperty("email");
      expect(savedUser).toHaveProperty("password");
      expect(savedUser).toHaveProperty("phone");
      
    });

    test('created User fields should be equal to mock User', async () => {

      //Arrange
      let mockUser3 : IUser =  users[3];
      const user = new User(mockUser3);
        
      //Act  
      mockingoose(User).toReturn(user, 'save');      
      const savedUser = await user.save();

      //Assert
      validateStringEquality(savedUser?.email,user.email);
      validateStringEquality(savedUser?.phone,user.phone);
      validateStringEquality(savedUser?.username,user.username);
      validateStringEquality(savedUser?.username,user.username);
        
    });


  })
  
  // Read
  describe("Read User", ()=>{
    test('should find all Users', async () => {
      
      //Act
      let mockUsers =  users 
      
      mockingoose(User).toReturn(mockUsers, 'find');

      const foundUsers  = await User.find();

      //Assert
      expect(foundUsers.length).toBe(4)
      
      // expect(foundUser).toHaveProperty("_id");
      // expect(foundUser).toHaveProperty("username");
      // expect(foundUser).toHaveProperty("email");
      // expect(foundUser).toHaveProperty("password");
      // expect(foundUser).toHaveProperty("phone");

      // validateStringEquality(foundUser?.email,user.email);
      // validateStringEquality(foundUser?.phone,user.phone);
      // validateStringEquality(foundUser?.username,user.username);
      // validateStringEquality(foundUser?.username,user.username);





      //let savedUser : IUser = {email,username,phone,password}
      //log("saved user ==", savedUser)
      /*
      const mockUser = { _id: 'some-user-id', name: 'Jane Doe' };
      mockingoose(User).toReturn(mockUser, 'findOne');

      const user = await User.findById('some-user-id');

      expect(user).toMatchObject(mockUser);
      */
    });

    test('should find a user by id', async () => {

      
      let mockUser0 : IUser =  users[0];   

      //Act
  
        
      const user0 = new User(mockUser0);
      log("user created new User ===", user0)
      mockingoose(User).toReturn(user0, 'findOne');

      const foundUser  = await User.findById(user0._id);
      
      expect(foundUser).toHaveProperty("_id");
      expect(foundUser).toHaveProperty("username");
      expect(foundUser).toHaveProperty("email");
      expect(foundUser).toHaveProperty("password");
      expect(foundUser).toHaveProperty("phone");

      validateStringEquality(foundUser?.email,user0.email);
      validateStringEquality(foundUser?.phone,user0.phone);
      validateStringEquality(foundUser?.username,user0.username);
      validateStringEquality(foundUser?.username,user0.username);

  
    });
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

 