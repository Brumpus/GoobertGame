import express, { Express, NextFunction, Request, Response } from "express";
import { getSaveState, setSaveState } from "./data/dataProvider";

const app: Express = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
})

app.get("/gooberts", async (request: Request, response: Response) =>{
    console.log("Request Received!");

    const slotString = request.query.slot;
    let slot: number = slotString as unknown as number;

    const data = await getSaveState(slot);

    console.log("Sending data from slot " + slot);
    response.status(201).json(data);
});
app.post("/gooberts", async (request: Request, response: Response) =>{
    setSaveState(request.body);
});


console.log("Listening on port 3000!");

app.listen(3000);