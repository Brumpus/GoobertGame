import React from "react"
import "../styles/graveyard.css";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import Goobert from "../Goobert";

export default function Graveyard() {

const deceased = Goobert[];//hmmmm... how do I get the array of dead gooberts here

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