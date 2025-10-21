
const dotenv = require("dotenv")
dotenv.config();

import express,{ Request, Response } from 'express';
import MongoDatabase from './src/v2/entities/MongoDatabase';
const errorHandler = require("./src/v1/middlewares/errorHandler");
const {corsOptions} = require("./src/v1/configs/cors")
const cors = require("cors");


const app = express();

const port = process.env.PORT || 6000;


app.use(express.json());
//app.use("/api/contacts", require("./src/routes/contactRoutes"))

//app.use("/api/v1/users", require("./src/v1/routes/userRoutes"));
app.use("/api/v2/users", require("./src/v2/routes/userRoutes"));


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

