import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: ['http://localhost:4000','https://e-commerce-payment-gate-way-razor-pay-u1l4.onrender.com'],
    methods:['GET,PATCH,POST,DELETE,PUT'],
    credentials: true,
  }
  ));

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())

//routes import

import userRoutes from './routes/user.routes.js'
import friendRoutes from './routes/friend.routes.js'

//routes declaration
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/friend", friendRoutes)

export {app}