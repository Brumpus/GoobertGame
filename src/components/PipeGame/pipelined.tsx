import React from "react";
import { doorOpenSound } from "../audio";
import { load, rooms } from "../../App";
import PipeRow from "./PipeRow";

import "../../games/pipe-game.css"

export default function Pipelined(){
    return(
        <main className="pipelined">
            <button type="button" className="frogoobert-exit" onClick={() => {
                doorOpenSound.play();
                load(rooms.gameRoom);
            }}>BACK TO GAME ROOM</button>
            
            <div className="">
                <PipeRow />
            </div>
        </main>
    )
};