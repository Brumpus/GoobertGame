import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import type { Goobert } from "./Goobert";
import { saveGoobertToDatabase } from "./saveLoadGoobert";

type ServerContextType = {
    pid: string;

    saveGoobert: (goobert: Goobert) => void;
}
const ServerContext = createContext< ServerContextType | null>(null);


export function ServerProvider({ children }: any) {
    const [pid, setPid] = useState("");
    const [ws, setWs] = useState<WebSocket>();
    const [initialized, setInitialized] = useState(false);

    // 1. Initialize the connection
    if(!initialized) {
        setWs(new WebSocket('http://localhost:3000'));
        setInitialized(true);
    }
    

    useEffect(() => {

        if(!ws) return;

        // 2. Set up event listeners
        ws.onopen = () => {
            console.log('Connected to server');
        };

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            switch (data.type) {
                case "connect":
                    if(localStorage.getItem("pid") == undefined) {
                        setPid(data.content);
                        localStorage.setItem("pid", data.content);
                    } else {
                        setPid(localStorage.getItem("pid") as string);
                    }
                break;
                default:
                    break;
            }
        };

        ws.onclose = () => {
            
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // 3. Cleanup: Close connection when component unmounts
        return () => {
            ws.close();
        };
    }, [ws]);

    const sendMessage = (type: string, data: any) => {
        if (ws && initialized) {
            ws.send(JSON.stringify({type: type, data: data}));
        }
    };

    const saveGoobert = (goobert: Goobert) => {
        const saveSlot = localStorage.getItem("currentSlot");
        if(!saveSlot) return;
        saveGoobertToDatabase(pid, parseInt(saveSlot), goobert)
    }

    return (
        <ServerContext.Provider value={{
            pid,
            saveGoobert 
        }} >
            {children}
        </ServerContext.Provider>
    );
}

export default function useServer() {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}