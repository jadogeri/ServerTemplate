const mockingoose = require('mockingoose');
const UserModel = require("../../../src/models/userModel");
import {getByEmail, 
        getByUsername, 
        create, 
        remove ,
        update } from "../../../src/services/userService"
const users = require("../../__mocks__/users")



describe('Users service', () => {
  describe('createUser', () => {
    it ('should create a user list', async () => {
      mockingoose(UserModel).toReturn([
        {
          title: 'Book 1',
          author: {
            firstname: 'John',
            lastname: 'Doe'
          },
          year: 2021,
        },
        {
          title: 'Book 2',
          author: {
            firstname: 'Jane',
            lastname: 'Doe'
          },
          year: 2022,
        }
      ], 'find');
      for( let i = 0; i < users.length; i++){
        const user = users[i]
        const {username, email, password, phone} = user
        const registeredUser = await create(username,email,password,phone)
        expect(registeredUser.username).toBe(user.username)
      }
    });
  });
});
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