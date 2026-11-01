"use strict";
import "../styles/index.css";
import React, { useState } from "react";
import { indexClickSound, indexHoverSound } from "./audio";
import Credits from "./credits";
import { load, rooms } from "../App";

/*
 * Goobies Main Menu
 * React switches between Menu and Credits without reloading.
 * All audio is handled by components/audio.js using Howler.js.
 */

export default function MainMenu(): React.JSX.Element {
    let [screen, setScreen] = useState("menu");

    // let showCredits = this.showCredits.bind(this); - commented out because idk what these do
    // let showMenu = this.showMenu.bind(this);

    // Open the Credits screen.
    let showCredits = () => {
        indexClickSound.play();
        setScreen("credits");
    }

    // Return to the Main Menu.
    function showMenu() {
        indexClickSound.play();
        setScreen("menu");
    }

    return (
        <main className="main-menu">
            {screen === "menu" ? (
                <>
                    {/* Animated Goobies logo */}
                    <div className="row">
                        <div className="col text-center">
                            <img
                                src="images/index/Goobies_Logo_text.gif"
                                alt="Goobies"
                                id="game-title"
                                className="img-fluid"
                            />
                        </div>
                    </div>

                    {/* Save system will be connected later. */}
                    <div className="row justify-content-center my-3">
                        <div className="col-10 col-md-6 col-lg-3">
                            <button 
                                className="btn btn-continue menu-button w-100"
                                onMouseEnter={() => indexHoverSound.play()}
                                onClick={() => indexClickSound.play()}
                            >
                                Continue Game
                            </button>
                                
                        </div>
                    </div>

                    {/* New Game opens the Hub. */}
                    <div className="row justify-content-center my-3">
                        <div className="col-10 col-md-6 col-lg-3">
                            <button 
                                className="btn btn-new-game menu-button w-100"
                                onMouseEnter={() => indexHoverSound.play()}
                                onClick={() => {
                                    indexClickSound.play();
                                    load(rooms.hub);
                                }}
                            >
                                New Game
                            </button>
                        </div>
                    </div>

                    {/* Credits screen */}
                    <button
                        type="button"
                        className="btn btn-credits menu-button btn-lg position-fixed bottom-0 start-0 m-5"
                        onMouseEnter={() => indexHoverSound.play()}
                        onClick={showCredits}
                    >
                        Credits
                    </button>
                </>
            ) : (
                <Credits
                    onBack={showMenu}
                    onHover={() => indexHoverSound.play()}
                />
            )}
        </main>
    );
}