import React from "react";
import { ladderClickSound } from "./audio";
import { load, rooms } from "../App";
import "../styles/dungeon.css";
import Mutant, { MutantType } from "../Mutant";
import useGooberts from "../GoobertContext";


export default function Dungeon() {
    let { doorRefs } = useGooberts();
    console.log("Rendering dungeon...");
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
                    <div className="prisoners">
                            <Mutant type={MutantType.SLEEPLESS} x={"15%"} y={"75%"}/>
                            <Mutant type={MutantType.DIRTY} x={"35%"} y={"75%"}/>
                            <Mutant type={MutantType.BORED} x={"55%"} y={"75%"}/>
                            <Mutant type={MutantType.HUNGRY} x={"75%"} y={"75%"}/>
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