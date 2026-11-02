import React from "react";
import { ladderClickSound } from "./audio";
import { load, rooms } from "../App";
import "../styles/dungeon.css";
import useGooberts from "../GoobertContext";


export default function Dungeon() {
    let { doorRefs } = useGooberts();
    return(
        <main className="dungeon">
            <div className="dungeonWrapper d-flex flex-column justify-content-between vh-100">
                <div className="dungeonWall">
                    <div className="col-12 text-center">
                        <img 
                            id="escape" className="img-fluid" 
                            src="images/doors/Ladder.webp" 
                            alt="Return to Hub"

                            // Play the Dungeon click sound before returning.
                            onClick={() => {
                                ladderClickSound.play();
                                load(rooms.hub);
                            }} 

                            ref={doorRefs.bedroomHub}
                        />
                    </div>
                </div>
                <div className="dungeonFloor">
                    <div className="col-12">
                    </div>
                </div>
            </div>
        </main>
    );
}