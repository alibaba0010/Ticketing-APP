import express, { json } from "express";

const app = express();
app.use(json());

app.listen(3001, () => console.log("Listen to port 3001"));
