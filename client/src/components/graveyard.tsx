import React, { useState, type MouseEventHandler } from "react"
import "../styles/graveyard.css";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import GoobertElement, {type Goobert} from "../Goobert";
import useGooberts, { getDeceased } from "../GoobertContext";
import UIGoobertCard from "./ui-script";

export default function Graveyard() {
    let { doorRefs } = useGooberts();
    const deceased = getDeceased();//hmmmm... how do I get the array of dead gooberts here

    interface Props {
        goobert: Goobert;
        
    }
    const Headstone = ({goobert}:Props) => {
        const deadGoobert = goobert;

        return(
        <div className="Headstone">
            <img src="../images/graveyard/headstone.webp" />
            <div className="">
                <GoobertElement
                                {...deadGoobert}
                                isUi={false}
                                x={48}
                                y={48}
                                className="goobert-container icon etching"
                            />
            </div>
            <div className="engraving" onClick={() => {console.log(`Goobert is in:${goobert.room}`)}}>{goobert.name}</div>
        </div>
    )     
    }

    return(
        <main className="graveyard">
            {/* EXIT TO HUB */}
                <div className="exit-controls" ref={doorRefs.gameRoomHub}>
                    <button 
                        className="exit-button " 
                        // Play the door click sound before returning to the Hub.
                        onClick={() => {
                            doorOpenSound.play();
                            load(rooms.hub);
                        }}>

                        <span>BACK TO HUB</span>
                    </button>
                </div>

                <section className="graveyard-memorials" aria-label="Goobert memorials">
                <h1>Goobert Graveyard</h1>

                {deceased.length === 0 ? (
                    <div className="graveyard-empty">
                        <div className="graveyard-empty-stones" aria-hidden="true">
                            <div className="graveyard-stone" />
                            <div className="graveyard-stone" />
                            <div className="graveyard-stone" />
                        </div>
                        <p>No Gooberts have been laid to rest in this session.</p>
                    </div>
                ) : (
                    <div className="cemetary-container">
                        <div className="cemetary-row">
                            {deceased.map((goobert, i) => <Headstone goobert={goobert} key={i} />)}
                        </div>
                    </div>
                    // <div className="graveyard-grid">
                    //     {deadGooberts.map((goobert, index) => (
                    //         <article className="graveyard-memorial" key={`${goobert.id}-${index}`}>
                    //             <GoobertMemorial goobert={goobert} />
                    //             <div className="graveyard-stone">
                    //                 <span className="graveyard-rip">R.I.P.</span>
                    //                 <span className="graveyard-name">{goobert.name}</span>
                    //             </div>
                    //         </article>
                    //     ))}
                    // </div>
                )}
            </section>
        </main>
    );
}
