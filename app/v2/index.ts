

import express,{ Request, Response } from 'express';
import {MongoDatabase } from './src/entities/MongoDatabase';

const dotenv = require("dotenv")
dotenv.config();
const { errorHandler } = require("./src/middlewares/errorHandler");
const {corsOptions} = require("./src/configs/cors")
const cors = require("cors");

export const app = express();

const port = process.env.PORT || 6000;

app.use(express.json());

app.use("/api/v2/users", require("./src/routes/userRoutes"));

app.use(errorHandler);
app.use(cors(corsOptions)) 


app.get('/', (req: Request, res : Response) => {
  res.send({message:"home"});
});
const mongoDatabase = new MongoDatabase();
//mongoDatabase.getInstance()

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, ()=> {
    console.log(`Backend is running on http://localhost:${port}`)
  })
}

module.exports = app;