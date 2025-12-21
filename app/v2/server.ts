import app from "./index"
import MongoDatabase from "./src/entities/MongoDatabase"

const port = process.env.PORT || 4000;


MongoDatabase.getInstance()

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, ()=> {
    console.log(`Backend is running on http://localhost:${port}`)
  })
}