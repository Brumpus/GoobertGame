"use strict";
import "../styles/shop.css";
import React from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import useGooberts from "../GoobertContext";


export default function Shop() {
    let { doorRefs } = useGooberts();

    return(
        <main id="main" className="shop">
            {/* EXIT TO HUB */}
            <div className="exit-controls" ref={doorRefs.shopHub}>
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
            
            {/* <!-- SHOP TITLE --> */}
            <div className="row">
                <div className="col text-center">

                    <h1 className="shop-title">Goobert SHOP</h1>

                    {/* SHOP DESCRIPTION */}
                    <p className="shop-description">
                        Customize your Goobert!
                    </p>
                    
                </div>
            </div>

            {/* SHOP CATEGORY BUTTONS */}
            {/* NOTE: HATS, GLASSES, AND ACCESSORIES ARE PLACEHOLDER
                CATEGORY NAMES UNTIL THE TEAM DECIDES WHAT THE SHOP WILL SELL. */}
            <div className="shop-buttons">
                
                {/* HATS BUTTON */}
                <button
                    className="shop-button hats-button"
                    onClick={() => openShop("HATS")}
                >
                    HATS
                </button>

                {/* GLASSES BUTTON */}
                <button
                    className="shop-button glasses-button"
                    onClick={() => openShop("GLASSES")} 
                >
                    GLASSES
                </button>

                {/* ACCESSORIES BUTTON */}
                <button
                    className="shop-button accessories-button"
                    onClick={() => openShop("ACCESSORIES")}
                >
                    ACCESSORIES
                </button>
            </div>

            {/* SHOP POPUP */}
            <div className="accessories-popup" id="accessoriesPopup">

                {/* POPUP TITLE */}
                <h2 id="shopPopupTitle">HATS</h2>

                {/* POPUP CONTENT */}
                <p>Shop items will go here!</p>

                {/* CLOSE BUTTON */}
                <button
                    className="close-button"
                    onClick={closeShop}
                >
                    CLOSE
                </button>

            </div>
        </main>
    );
}

// OPENS SHOP POPUP
function openShop(category: string) {
    document.getElementById("shopPopupTitle")!.textContent = category;
    document.getElementById("accessoriesPopup")!.style.display = "block";
}

// CLOSES ACCESSORIES POPUP
function closeShop() {
	document.getElementById("accessoriesPopup")!.style.display = "none";
}