import express, {Request, Response} from "express";
import connectDB from './config/db';

const app = express();

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hi from server side again");
});

app.listen(process.env.PORT, ()=> {
    console.log("Server is running")
});