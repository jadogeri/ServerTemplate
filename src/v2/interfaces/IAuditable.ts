import { Date } from "mongoose"
export interface IAuditable{
    createdAt : Date,
    updatedAt : Date
}