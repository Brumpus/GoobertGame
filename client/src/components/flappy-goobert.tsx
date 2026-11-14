
"use strict";
import React, { useEffect, useState } from "react";
import useGooberts from "../GoobertContext";
import { stopGame } from "../games/games-global";
import { initFlappyGoobert, jump, setCleanlinessReward } from "../games/flappy-goobert";
import { load, rooms } from "../App";
import "../games/flappy-goobert.css";
import type { Goobert } from "../Goobert";
import { gameGoobert } from "./game-room";


export let setPlayAgain: Function | null;
export let gameOver: boolean;
/*
 * Flappy Goobert React component.
 * Displays the game, tracks when the game ends,
 * and allows the player to restart or leave.
 */
export type FlappyProps = {
    gameGoobert: Goobert | null
}
    export default function FlappyGoobert(): React.JSX.Element {
        let [showPlayAgain, setShowPlayAgain] = useState(false); 

        // Access the latest Goobert data from React context.
        const { gooberts, updateStat } = useGooberts();

        // Find the Goobert currently playing Flappy Goobert.
        const currentGoobert = gooberts.find(
            goobert => goobert.id === gameGoobert?.id
        );

        // Connect Flappy Goobert's rewards to React context.
        useEffect(() => {
            setCleanlinessReward((amount: number) => {
                if (gameGoobert) {
                    updateStat(gameGoobert.id, "cleanliness", amount);
                }
            });

            // Disconnect when leaving the game.
            return () => setCleanlinessReward(null);
        }, [updateStat]);

        useEffect(() => {
            if (!showPlayAgain) {
                initFlappyGoobert();
            }
        }, [showPlayAgain]);


        setPlayAgain = setShowPlayAgain;
        gameOver = showPlayAgain;


    /*
     * Runs when the player leaves the Flappy Goobert screen.
     * Stops the game and clears its game-over callback.
     */
    function componentWillUnmount() {
        setPlayAgain = null;

        if (typeof stopGame === "function") {
            stopGame();
        }
    }

    /*
     * Restarts the game after Game Over.
     * Hides the Play Again button and starts a new game.
     */
    function playAgain() {
        setShowPlayAgain(false);
        if (typeof initFlappyGoobert === "function") {
            initFlappyGoobert();
        }
    }

    /*
     * Handles touch controls on mobile devices.
     * Touching the game makes Goobert jump.
     * Touching a button does not trigger a jump.
     */
    function handleTouch(event: MouseEvent) {
        // Ignore touches on buttons.
        let target = event.target as HTMLElement;
        if (target.closest("button")) {
            return;
        }

        event.preventDefault();

        // Make Goobert jump if the function exists.
        if (typeof jump === "function") {
            jump();
        }
    }

    /*
     * Displays the Flappy Goobert game screen.
     */
    return (
        <main
            className="flappy-screen"
            onTouchStart={(event: any) => handleTouch(event)}
        >

            {/* Button to return to the Game Room. */}
            <button
                type="button"
                className="btn game-return-btn"
                onClick={() => {componentWillUnmount(); load(rooms.gameRoom)}}
            >
                Back to Game Room
            </button>

            {/* Area where the Flappy Goobert game appears. */}
            <div id="main" className="flappy-board">

                {/* Jump button for mobile devices. */}
                <div id="keys" className="d-block d-md-none vw-100">
                    <i
                        className="bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup vw-100"
                        onClick={() => jump()}
                    ></i>
                </div>
            </div>
            <div id="flappy-score" className="flappy-score">Score: 0</div>

            {/* Display Cleanliness when a Goobert is selected.  */}
            {currentGoobert &&
                <div className="cleanliness-label">
                    <label
                        htmlFor="goobert-percentage"
                        key={"FlappyGoobertCleanlinessLabel"}
                    >
                        Cleanliness
                    </label>
                    <br />
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={currentGoobert.cleanliness}
                        id="goobert-percentage"
                        key={"FlappyGoobertCleanliness"}
                        readOnly
                    />
                </div>
            }

            {/* Show the Game Over screen only when the game ends. */}
            {showPlayAgain && (
                <div className="game-over-panel">
                    <h3>Game Over</h3>

                    {/* Restart the game when clicked. */}
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => playAgain()}
                    >
                        Play Again
                    </button>
                </div>
            )}
        </main>
    );
}
