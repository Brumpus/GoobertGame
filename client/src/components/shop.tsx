"use strict";
import "../styles/shop.css";
import React, { useState } from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import useGooberts from "../GoobertContext";
import GoobertElement from "../Goobert";


export default function Shop() {
    let { doorRefs, gooberts } = useGooberts();

    // Keep track of the selected accesory category
    const [selectedCategory, setSelectedCategory] = useState("");

    // Get the Gooberts currently inside the shop.
    const shopGooberts = gooberts.filter((goobert) => {
        return goobert.room === rooms.shop;
    });

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

                    {/* SHOP STOREFRONT SIGN */}
                    <div className="shop-sign">
                        <p className="shop-welcome">
                            ✦ WELCOME TO ✦
                        </p>

                        <h1 className="shop-title">
                            The Goobertique
                        </h1>
                    </div>

                    {/* SHOP DESCRIPTION */}
                    <p className="shop-description">
                        A little style. A lot of personality.
                    </p>
                    
                </div>
            </div>

            {/* CUSTOMIZE GOOBERT BUTTON */}
            <div
                className="shop-buttons"
                style={{ display: selectedCategory === "" ? "flex" : "none" }}
            >
                <button
                    className="shop-button customize-button"
                    onClick={() => setSelectedCategory("HEADWEAR")}
                >
                    CUSTOMIZE YOUR GOOBERT
                </button>
            </div>

            {/* GOOBERT SELECTION SCREEN */}
            {selectedCategory !== "" && (
                <div className="shop-goobert-selector">
                    <p className="selector-welcome">
                        ✦ TIME FOR A MAKEOVER ✦
                    </p>

                    <h2>Choose Your Goobert!</h2>

                    <p className="selector-description">
                        Who are we styling today?
                    </p>

                    {/* MESSAGE IF NO GOOBERTS ARE IN THE SHOP */}
                    {shopGooberts.length === 0 && (
                        <p className="selector-description">
                            No Gooberts here yet! Bring one to the shop
                            to give them a makeover.
                        </p>
                    )}

                    <div className="shop-goobert-grid">
                        {shopGooberts.map((goobert) => (
                            <button
                                type="button"
                                key={goobert.id}
                                onClick={() => load(
                                    `${rooms.dressingRoom}?id=${encodeURIComponent(goobert.id)}&category=${selectedCategory}`
                                )}
                            >
                                <GoobertElement
                                    {...goobert}
                                    isUi={true}
                                    x={0}
                                    y={0}
                                />
                                <span>{goobert.name}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectedCategory("")}
                    >
                        BACK
                    </button>
                </div>
            )}

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