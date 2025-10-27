import {  test } from '@jest/globals';
import { users } from '../../../__mocks__/users';
const request = require('supertest');
//const {BASE_URL}  = require("../../constants")
import  app  from "../../../../index";



export const registerUserTest = () => {

  test('registers user Tesing in isolation', async () => {

    try{

    //   console.log(__dirname)
    //   let path  : string = __dirname + "/../__mocks__/user.json"
         


      let mockObj = users[0];
      const res = await request("http://localhost:6000/api/v2/users").post('/register').send(mockObj)    

      console.log("data retrieved from test == ",JSON.stringify(res.body))
      if(res.statusCode ===201){
        let updatedCreds = {...mockObj,... res.body,password : mockObj.password}   
        localStorage.setItem("user",JSON.stringify(updatedCreds, null, 2))

      }

      expect(res.statusCode).toEqual(201);
    }catch(e: unknown){
      if(e instanceof Error){
        console.log("message: ", e.message)
                console.log("name: ", e.name)
                        console.log("stack: ", e.stack)


      }
    }    
 
  },3000)


  
}


/**
 * 
     const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri(); // e.g., 'mongodb://127.0.0.1:51690/test'
    const port = mongod.getPort(); // e.g., 51690


    { useNewUrlParser: true, useUnifiedTopology: true }

 */