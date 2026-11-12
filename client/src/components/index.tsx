"use strict";
import "../styles/index.css";
import React, { useState } from "react";
import { indexClickSound, indexHoverSound } from "./audio";
import Credits from "./credits";
import { load, rooms } from "../App";
import useGooberts from "../GoobertContext";

/*
 * Gooberts Main Menu
 * React switches between Menu and Credits without reloading.
 * All audio is handled by components/audio.js using Howler.js.
 */

export default function MainMenu(): React.JSX.Element {
    let [screen, setScreen] = useState("menu");
    let { doorRefs, loadSlot, newGame } = useGooberts();

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
    let { gooberts } = useGooberts();

    return (
        <main className="main-menu">
            {screen.includes("menu") ? (
                <>
                    {/* Animated Gooberts logo */}
                    <div className="row">
                        <div className="col text-center">
                            <img
                                src="images/index/Gooberts_Logo_text.gif"
                                alt="Gooberts"
                                id="game-title"
                                className="img-fluid"
                            />
                        </div>
                    </div>

                    {/* Save system will be connected later. */}
                    <div className="row justify-content-center my-3">
                        <div className="col-10 col-md-6 col-lg-3" ref={doorRefs.menuHub}>
                            <button 
                                className="btn btn-continue menu-button w-100"
                                onMouseEnter={() => indexHoverSound.play()}
                                onClick={() => {
                                    indexClickSound.play();
                                    setScreen("menu-load")
                                }}
                            >
                                Continue Game
                                {gooberts.filter((goobert) => goobert.room == rooms.menu).length > 0 && 
                                    <div className="hint"><br />Drag gooberts here to bring them back to the game!</div>
                                }
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
                                    
                                    newGame();
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
                    {screen.includes("load") &&
                        <div id="save-selector">
                            <div id="close-selector" onClick={() => setScreen("menu")}>x</div>
                            <div className="selector-option" onClick={() => {
                                loadSlot(1);
                                load(rooms.hub);
                            }}>
                                <hr />
                                Save Slot 1
                            </div>
                            <div className="selector-option" onClick={() => {
                                loadSlot(2);
                                load(rooms.hub);
                            }}>
                                <hr />
                                Save Slot 2
                                <hr />
                            </div>
                            <div className="selector-option" onClick={() => {
                                loadSlot(3);
                                load(rooms.hub);
                            }}>
                                Save Slot 3
                                <hr />
                            </div>
                        </div>
                    }
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