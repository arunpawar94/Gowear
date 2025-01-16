import express from "express";
import connectDB from './config/db';
import userRoutes from './routers/user';

const app = express();

app.use(express.json());

connectDB();

app.use('/users', userRoutes);

app.listen(process.env.PORT, ()=> {
    console.log("Server is running")
});