import express from "express";
import connectDB from './config/db';
import userRoutes from './routers/user';
import productRoutes from './routers/product';

const app = express();

app.use(express.json());

connectDB();

app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.listen(process.env.PORT, ()=> {
    console.log("Server is running")
});