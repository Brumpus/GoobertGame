import express, { Express, Request, Response } from "express";
import { getSaveState } from "./data/dataProvider";

const app: Express = express();

app.use(express.json());

app.get("/gooberts", (request: Request, response: Response) =>{
    getSaveState(request.body);
});

app.listen(433);