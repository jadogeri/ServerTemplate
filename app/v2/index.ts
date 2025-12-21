

import express,{ Application, Request, Response } from 'express';
// Use require for the JSON file as ES modules may have issues with static imports of JSON
import router from './src/routes/userRoutes';




import dotenv from "dotenv";
dotenv.config();
import { errorHandler } from "./src/middlewares/errorHandler";
import cors from "cors";
import * as bodyParser from "body-parser"
import { corsOptions } from './src/configs/cors';

const app = express();

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors(corsOptions)) 


app.get('/', (req: Request, res : Response) => {
  res.send({message:"home"});
});

app.use("/api/v2/users", router);

app.use(errorHandler); //add error handler middleware as last middleware

// Log all registered routes

logRoutes(app)

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

  // console.log('Registered Routes:');
  routes.forEach((route) => {
    //console.log(`- ${route.method}: ${route.path}`);
  });
}

export default app


