import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDb.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.status(200).send({msg:'hellow my'})
})

app.use("/api/auth",authRoutes)

app.listen(port ,()=>{
    connectDB()
    console.log('server running on port ',port);
    
})