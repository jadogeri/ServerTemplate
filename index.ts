
const dotenv = require("dotenv")
dotenv.config();

import express,{ Request, Response } from 'express';
import MongoDatabase from './src/entities/MongoDatabase';
const errorHandler = require("./src/middlewares/errorHandler");
const {corsOptions} = require("./src/configs/cors")
const cors = require("cors");


const app = express();

const port = process.env.PORT || 6000;


app.use(express.json());
//app.use("/api/contacts", require("./src/routes/contactRoutes"))

app.use("/api/users", require("./src/routes/userRoutes"));

app.use(errorHandler);
app.use(cors(corsOptions)) 

app.get('/', (req: Request, res : Response) => {
  res.send({message:"home"});
});

MongoDatabase.getInstance()



if (process.env.NODE_ENV !== 'test') {
  app.listen(port, ()=> {
    console.log(`Backend is running on http://localhost:${port}`)
  })
}



