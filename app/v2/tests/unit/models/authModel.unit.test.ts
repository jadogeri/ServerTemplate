
import mockingoose from 'mockingoose';
import Auth from '../../../src/models/AuthModel'; // Your Auth model
import { IAuth } from '../../../src/interfaces/IAuth';
import { validateStringEquality, validateNotEmpty } from '../../validators';
import { ObjectId } from 'mongodb';

import { auths} from "../../__mocks__/auths"

describe('Auth Model', () => {
    // Create
  describe("create Auth", ()=>{
    test('should create a new Auth', async () => {

      //Arrange
      let mockAuth0 : IAuth =  auths[0];
      const auth = new Auth(mockAuth0);
        
      //Act  
      mockingoose(Auth).toReturn(Auth, 'save');      
      const {_id, token, id} = await auth.save()
      let savedAuth : IAuth = { token, id}

      //Assert
      expect(savedAuth.id).toBe(mockAuth0.id)
      expect(savedAuth.token).toBe(mockAuth0.token)
   
    });

    test('should have property', async () => {

      //Arrange
      let mockAuth1 : IAuth =  auths[1];
      const auth = new Auth(mockAuth1);
        
      //Act  
      mockingoose(Auth).toReturn(Auth, 'save');      
      const savedAuth = await auth.save();

      //Assert
      expect(savedAuth).toHaveProperty("_id");
      expect(savedAuth).toHaveProperty("token");
      expect(savedAuth).toHaveProperty("id");      
    });

    test('created Auth fields should be equal to mock Auth', async () => {

      //Arrange
      let mockAuth3 : IAuth =  auths[3];
      const auth = new Auth(mockAuth3);
        
      //Act  
      mockingoose(Auth).toReturn(Auth, 'save');      
      const savedAuth = await auth.save();

      //Assert
      validateStringEquality(savedAuth?.id,auth.id);
      validateStringEquality(savedAuth?._id,auth._id);
      validateStringEquality(savedAuth?.token,auth.token);
        
    });

  })

  // Read
  describe("Read Auth", ()=>{
    test('should find all auths', async () => {
      
      //Arrange
      let mockAuths =  auths 
      
      //Act
      mockingoose(Auth).toReturn(mockAuths, 'find');
      const foundAuths  = await Auth.find();

      //Assert
      expect(foundAuths.length).toBe(4)
      expect(foundAuths).toBeDefined()      
  
    });

    test('should find a Auth by id', async () => {
      
      //Arrange
      let mockAuth0 : IAuth =  auths[0];        
      const auth0 = new Auth(mockAuth0);

      //Act
      mockingoose(Auth).toReturn(auth0, 'findOne');
      const foundAuth  = await Auth.findById(auth0._id);
      
      //Assert
      expect(foundAuth).toHaveProperty("_id");
      expect(foundAuth).toHaveProperty("id");
      expect(foundAuth).toHaveProperty("token");
   
      validateStringEquality(foundAuth?._id,auth0._id);
      validateStringEquality(foundAuth?.token,auth0.token);
      validateStringEquality(foundAuth?.id,auth0.id);
  
    });
  });

  // Update
  describe("Update Auth", ()=>{

    test('should update a Auth', async () => {

      //Arrange
      const auth : IAuth =  auths[0];   
      const mockAuth0 = await new Auth(auth).save();
      mockAuth0.token = "TOKEN";

      //Act
      mockingoose(Auth).toReturn(mockAuth0, 'findOneAndUpdate');
      const updatedAuth = await Auth.findOneAndUpdate(
        { _id: mockAuth0._id },
        { token: 'TOKEN' },
        { new: true }
      );

      //Assert
      expect(updatedAuth?._id).toEqual(mockAuth0._id);
      validateStringEquality(updatedAuth?.token,"TOKEN")

    });

    test('should have all properties', async () => {

      //Arrange
      const auth : IAuth =  auths[0];   
      const mockAuth0 = await new Auth(auth).save();

      //Act
      mockingoose(Auth).toReturn(mockAuth0, 'findOneAndUpdate');
      const updatedAuth = await Auth.findOneAndUpdate(
        { _id: mockAuth0._id },
        { id: new ObjectId() },
        { new: true }
      );

      //Assert
      expect(updatedAuth).toHaveProperty("_id");
      expect(updatedAuth).toHaveProperty("token");
      expect(updatedAuth).toHaveProperty("id");

    });

  });

  // Delete
  describe("Delete Auth", ()=>{

    test('return correct mock for deleted Auth', async () => {
      
      //Arrange
      const auth = auths[0];
      let deleteUser = new Auth(auth);
      
      //Act
      mockingoose(Auth).toReturn(deleteUser, 'deleteOne');
      let result = await Auth.deleteOne({ token: deleteUser.token });  
      
      //Assert
      expect(result).toBe(deleteUser);
    });

    test('should delete an Auth by id', async () => {
      
      //Arrange
      let mockAuth0 : IAuth =  auths[0];        
      const auth0 = new Auth(mockAuth0);

      //Act
      mockingoose(Auth).toReturn(auth0, 'findOneAndDelete');
      const deletedUser  = await Auth.findOneAndDelete({_id : auth0._id});
      
      //Assert
      expect(deletedUser).toMatchObject(auth0);
  
    });


  });
 

});