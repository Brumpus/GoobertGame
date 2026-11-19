import express, { Express, NextFunction, Request, Response } from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { createGoobert, deleteGoobert, getSaveState, updateGoobert } from "./data/dataProvider";
import Database from "better-sqlite3";

const PORT = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server});
const db = new Database("./dist/gooberts.db");

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
})
app.get("/gooberts", async (request: Request, response: Response) =>{
    const pidString = request.query.pid;
    const pid = pidString as string;
    const slotString = request.query.slot;
    let slot: number = slotString as unknown as number;

    const data = await getSaveState({pid: pid, saveSlot: slot, data: {}});

    console.log("Sending data from slot " + slot + ":", data);
    response.status(201).json(data);});
app.post("/gooberts", async (request: Request, response: Response) =>{
    console.log("\nCreating a goobert...");
    const req = await JSON.parse(request.body.body);
    const data = await createGoobert(req);

    response.status(201).json(data);
});
app.put("/gooberts", async (request: Request, response: Response) =>{
    const req = await JSON.parse(request.body.body);
    const data = await updateGoobert(req);

    response.status(201).json(data);
});
app.delete("/gooberts", async (request: Request, response: Response) =>{
    const req = await JSON.parse(request.body.body);
    const data = await deleteGoobert(req);

    response.status(201).json(data);
});


wss.on("connection", (observer: WebSocket) => {
    console.log("User connected!");
    
    const pid = "pid" + new Date().getTime();

    observer.send(encodeMessage("connect", pid));
    observer.on("message", (message) => {
        const data = message;
        
    })
    
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

function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  // 1. Stop accepting new HTTP connections
  server.close(() => {
    console.log('HTTP server closed.');

    // 2. Close the database once active requests finish
    try {
      db.close();
      console.log('Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    }
  });
}
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));