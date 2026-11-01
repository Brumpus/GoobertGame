"use strict";
import "../styles/shop.css";
import React from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";


export default class Shop extends React.Component {

    render() {
        return(
            <main id="main" className="shop">
                
                {/* <!-- SHOP TITLE --> */}
                <div className="row">
                    <div className="col text-center">

                        <h1 className="shop-title">GOOBIE SHOP</h1>

                        {/* SHOP DESCRIPTION */}
                        <p className="shop-description">
                            Customize your Goobie!
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

                {/* <!-- MAIN HUB LINK --> */}
                <div className="bg-warning text-white">
                    <a href="#" onClick={(e) => {
                        // Prevent the link from refreshing the page.
                        e.preventDefault();
                        // Play the door click sound.
                        doorOpenSound.play();
                        // Return to the Hub.
                        load(rooms.hub);
                    }}>
                        Click here to go to the main hub!
                    </a>
                </div>
            </main>
        );
    }
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