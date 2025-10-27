

import express,{ Application, Request, Response } from 'express';
import MongoDatabase from './src/entities/MongoDatabase';

const dotenv = require("dotenv")
dotenv.config();
const { errorHandler } = require("./src/middlewares/errorHandler");
const {corsOptions} = require("./src/configs/cors")
const cors = require("cors");
import * as bodyParser from "body-parser"

const app = express();

const port = process.env.PORT || 6000;

app.use(express.json());

app.use("/api/v2/users", require("./src/routes/userRoutes"));

app.use(bodyParser.json())
app.use(errorHandler);
app.use(cors(corsOptions)) 



app.get('/', (req: Request, res : Response) => {
  res.send({message:"home"});
});

logRoutes(app)

MongoDatabase.getInstance()

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, ()=> {
    console.log(`Backend is running on http://localhost:${port}`)
  })
}

// Function to log all registered routes
function logRoutes(application: Application) {
  const routes: { path: string; method: string }[] = [];

  application._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Routes registered directly on the app
      for (const method in middleware.route.methods) {
        if (middleware.route.methods[method]) {
          routes.push({ path: middleware.route.path, method: method.toUpperCase() });
        }
      }
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Routes registered through a router
      const routerPrefix = middleware.regexp.source.replace(/\\|\^|\$|\?/g, '').replace(/\/\(\?:\(\.\*\)\)\/\i/, ''); // Extract path prefix
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          for (const method in handler.route.methods) {
            if (handler.route.methods[method]) {
              routes.push({ path: routerPrefix + handler.route.path, method: method.toUpperCase() });
            }
          }
        }
      });
    }
  });

  console.log('Registered Routes:');
  routes.forEach((route) => {
    console.log(`- ${route.method}: ${route.path}`);
  });
}

export default app