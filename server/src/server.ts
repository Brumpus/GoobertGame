import express, { Express, NextFunction, Request, Response } from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { getSaveState, setSaveState } from "./data/dataProvider";

const PORT = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
})
app.get("/gooberts", async (request: Request, response: Response) =>{
    const slotString = request.query.slot;
    let slot: number = slotString as unknown as number;

    const data = await getSaveState(slot);

    console.log("Sending data from slot " + slot);
    response.status(201).json(data);
});
app.post("/gooberts", async (request: Request, response: Response) =>{
    setSaveState(request.body);
});


wss.on("connection", (observer: WebSocket) => {
    console.log("User connected!");
    
    const pid = "pid" + new Date().getTime();

    observer.send(encodeMessage("connect", pid));
    
    
});
const encodeMessage = (type: string, data: any) => {
    return JSON.stringify({type: type, content: data});
}

const parseMessage = (messageType: string, data: any) => {
    switch (messageType) {
        case "":

        break;

        default:
            break;
    }
}

server.listen(PORT, () => {
    console.log(`HTTP & WS server running on http://localhost:${PORT}`);
});