import mongoose from "mongoose";
import User from "../models/userModel";
import { IUser } from "../interfaces/IUser";



async function getByEmail(email : string) {
  return User.findOne({ email : email });
}

async function getByUsername(username : string) {
  return User.findOne({ username : username });
}

async function create(user : IUser) {
  return  User.create(user);
}

async function remove(_id :  mongoose.Types.ObjectId) {
  return User.findByIdAndDelete(_id);
}

async function update(_id :  mongoose.Types.ObjectId, user : IUser) {
  return User.findOneAndUpdate({ _id: _id }, {$set: user},{upsert: true});
}

export { getByEmail, getByUsername, create, remove ,update};