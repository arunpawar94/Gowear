import express, {Request, Response} from "express"

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hi from server side again");
});

app.listen(5000, ()=> {
    console.log("Server is running")
});