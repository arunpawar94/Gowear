import express from "express"

const app = express();

app.get("/", (req, res) => {
    req.send("Hi from server side");
});

app.listen(5000);