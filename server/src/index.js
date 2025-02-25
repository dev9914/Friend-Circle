import { app } from './app.js';
import connectDb from './db/DbConnect.js';
import dotenv from 'dotenv';
dotenv.config({
  path:'./.env'
})

const port = process.env.PORT || 5000

connectDb()
.then(()=>{
  app.listen(port ,()=>{
    console.log(`listening at port ${port}`);
  })
})
.catch((err)=>{
  console.log("Db connection failed",err)
})
