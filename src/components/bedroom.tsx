import React from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import "../styles/bedroom.css";

export default class Bedroom extends React.Component {
    render() {
        return(
            <main className="bedroom">
                {/* BEDROOM WALL */}
                <div id="wall">

                    {/* BEDROOM LOGO */}
                     <button 
                        className="bedroom-logo"
                        onClick={() => alert('You found my secret easter egg!')}
                    >
                        <img className="img-fluid" 
                            src="../images/bedroom/BedroomLogo.webp" 
                            alt="BedRoom" 
                        />
                    </button>

                    {/* EXIT TO HUB */}
                    <div className="bedroom-controls">
                        <button 
                            className="bedroom-exit-button" 
                            // Play the door click sound before returning to the Hub.
                            onClick={() => {
                                doorOpenSound.play();
                                load(rooms.hub);
                            }}>

                            <img 
                                className="bedroom-exit-icon" 
                                src="images/pixelarticons/arrow-left.svg"
                                aria-hidden="true" />
                            <span>BACK TO HUB</span>
                        </button>
                    </div>
                </div>

                {/* BEDROOM FLOOR */}
                <div id="floor-wrapper">
                    <div className="bedroom-beds">
                        <button 
                            //TODO: Add mechanism for sleeping gooberts
                            /*onClick={() => david.sleep()}*/ 
                            className="bedroom-bed-button"
                            title="Click Here to sleep!"
                        >
                            <img 
                                src="images/bedroom/GoobBedWeb.png" 
                                alt="" 
                            />
                        </button>

                        <button 
                            /*onClick={() => david.sleep()}*/ 
                            className="bedroom-bed-button"
                            title="Click Here to sleep!"
                        >
                            <img 
                                src="images/bedroom/GoobBedWeb.png" 
                                alt="" 
                            />
                        </button>

                        <button 
                            /*onClick={() => david.sleep()}*/ 
                            className="bedroom-bed-button"
                            title="Click Here to sleep!"
                        >
                            <img 
                                src="images/bedroom/GoobBedWeb.png" 
                                alt="" 
                            />
                        </button>

                        <button 
                            /*onClick={() => david.sleep()}*/ 
                            className="bedroom-bed-button"
                            title="Click Here to sleep!"
                        >
                            <img 
                                src="images/bedroom/GoobBedWeb.png" 
                                alt="" 
                            />
                        </button>
                    </div>
                </div>                       
            </main>
        );
    }
}