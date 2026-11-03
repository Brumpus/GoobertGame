
"use strict";
import React, { useState, type MouseEvent, type MouseEventHandler } from "react";
import { arcadeClickSound, arcadeHoverSound, doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import "../styles/game-room.css";
import type { Goobert } from "../Goobert";
import GoobertElement from "../Goobert";
import useGooberts from "../GoobertContext";

/*
 * Game Room
 * Displays five arcade machines.
 *
 * Snake and Flappy Goobert are playable.
 * The other three machines only play sound effects.
 */

// The first Goobert receives rewards from arcade games.
export let gameGoobert: Goobert | null = null;

export default function GameRoom() {
    let { doorRefs, gooberts } = useGooberts();
    let [goobertSelector, setGoobertSelector] = useState("");
    let [gameSelector, setGameSelector] = useState("");
    const closeGoobertSelector = (mouse: MouseEvent) => setGoobertSelector("");
    


    return (
        <main id="main" className="game-room">

            {/* EXIT TO HUB */}
            <div className="exit-controls" ref={doorRefs.gameRoomHub}>
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

            {/* Game Room Logo */}
            <div className="game-room-logo-wrap">
                <img
                    src="images/game-room/game-room-logo.png"
                    alt="Game Room"
                    className="game-room-logo"
                />
            </div>

            {/* Arcade Machines */}
            <div className="game-room-machines">

                {/* Snake */}
                <button
                    type="button"
                    className="machine-button"
                    onMouseEnter={() => arcadeHoverSound.play()}
                    onClick={() => {
                        arcadeClickSound.play();

                        // Load snake if no gooberts are available for selection
                        let validGooberts = gooberts.filter((goobert) => goobert.room == rooms.gameRoom);
                        if(validGooberts.length < 2) {
                            if(validGooberts.length == 1 && validGooberts[0] != undefined) gameGoobert = validGooberts[0];
                            load(rooms.snakeGame);
                        } else {
                            // Select the Goobert for rewards.
                            setGameSelector("Snake");
                            setGoobertSelector(rooms.snakeGame);
                        }


                    }}
                >
                    <img
                        src="images/game-room/snake-machine.png"
                        alt="Play Snake"
                    />
                </button>

                {/* Flappy Goobert */}
                <button
                    type="button"
                    className="machine-button"
                    onMouseEnter={() => arcadeHoverSound.play()}
                    onClick={() => {
                        arcadeClickSound.play();

                        // Load flappy goobert if no gooberts are available for selection
                        let validGooberts = gooberts.filter((goobert) => goobert.room == rooms.gameRoom);
                        if(validGooberts.length < 2) {
                            if(validGooberts.length == 1 && validGooberts[0] != undefined) gameGoobert = validGooberts[0];
                            load(rooms.flappyGoobert);
                        } else {
                            // Select the Goobert for rewards.
                            setGameSelector("Flappy Bird");
                            setGoobertSelector(rooms.flappyGoobert);
                        }

                    }}
                >
                    <img
                        src="images/game-room/flappy-goobert-machine.png"
                        alt="Play Flappy Goobert"
                    />
                </button>

                {/* Frogoobert */}
                <button
                    type="button"
                    className="machine-button"
                    onMouseEnter={() => arcadeHoverSound.play()}
                    onClick={() => {
                        arcadeClickSound.play();

                       // Load flappy goobert if no gooberts are available for selection
                        let validGooberts = gooberts.filter((goobert) => goobert.room == rooms.gameRoom);
                        if(validGooberts.length < 2) {
                            if(validGooberts.length == 1 && validGooberts[0] != undefined) gameGoobert = validGooberts[0];
                            load(rooms.frogoobert);
                        } else {
                            // Select the Goobert for rewards.
                            setGameSelector("Frogoobert");
                            setGoobertSelector(rooms.frogoobert);
                        }
                    }}
                >
                    <img
                        src="images/game-room/frogoobert-machine.png"
                        alt="Play Frogoobert"
                    />
                </button>

                {/* Pipelined - Coming Soon */}
                <button
                    type="button"
                    className="machine-button"
                    onMouseEnter={() => arcadeHoverSound.play()}
                    onClick={() => arcadeClickSound.play()}
                >
                    <img
                        src="images/game-room/pipelined-machine.png"
                        alt="Pipelined - Coming Soon"
                    />
                </button>

                {/* Feast Fest - Falling Food Minigame */}
                <button
                    type="button"
                    className="machine-button"
                        onMouseEnter={() => arcadeHoverSound.play()}
                        onClick={() => {
                            // Play the arcade sound and open Feast Fest.
                            arcadeClickSound.play();
                            load(rooms.feastFest);
                        }}
                >
                    <img
                        src="images/game-room/feast-fest-machine.png"
                        alt="Play Feast Fest"
                    />
                </button>

            </div>

            {/* Display goobert selector when game is clicked */}
            { goobertSelector != "" && gooberts.length > 0 &&
                <GoobertList room={goobertSelector} game={gameSelector} close={closeGoobertSelector} />
            }

        </main>
    );
}
type ListProps = {
    room: string;
    game: string;
    close: MouseEventHandler<HTMLDivElement>;
}
function GoobertList(props: ListProps) {
    let { gooberts } = useGooberts();
    // Only render at most 5 gooberts at once
    let list =  gooberts.filter((goobert, i) => {
        return goobert.room === rooms.gameRoom
    })
    list.length = Math.min(list.length, 5);
    return (
        <div id="goobert-list">
            <div className="list-element header">
                Select {props.game} Goobert
                <div className="close" onClick={props.close}>x</div>
            </div>
            {
                // Filter gooberts to only display the ones on the current room
                list.map((goobert, i) => {
                    // Create a goobert for each object stored in this room
                    return (
                        <div className="list-element" 
                            onClick={() => {
                                gameGoobert = goobert;
                                load(props.room);
                            }}
                            key={"game-" + goobert.id}
                        >
                            <GoobertElement
                                {...goobert}
                                isUi={true}
                                x={0}
                                y={0}
                            />
                            {goobert.name}
                        </div>
                    );
                })
            }
        </div>
    );
}