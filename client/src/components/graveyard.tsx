import React from "react"

import "../styles/graveyard.css";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";

export default function Graveyard() {
    return(
        <main className="graveyard">
            {/* EXIT TO HUB */}
                <div className="exit-controls">
                    <button 
                        className="exit-button" 
                        // Play the door click sound before returning to the Hub.
                        onClick={() => {
                            doorOpenSound.play();
                            load(rooms.hub);
                        }}>

                        <span>BACK TO HUB</span>
                    </button>
                </div>
            <div>Oooooh so spooky</div>
        </main>
    )
}