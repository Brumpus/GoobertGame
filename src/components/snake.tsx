"use strict";
import React, { useState } from "react";
import { gameGoobert } from "./game-room";
import { refreshGameBody, setBodySize, stopGame, body, width, height } from "../games/games-global";
import { load, rooms } from "../App";
import { initSnakeGame, setSnakeVelocity } from "../games/snake-game";
import "../games/snake-stylesheet.css";
import "../icons-1.13.1/font/bootstrap-icons.min.css";

/*
Main React component for the Snake minigame.
Handles loading game scripts, selecting difficulty,
displaying controls, and returning to Game Room.
*/
export default function SnakeGame(): React.JSX.Element {

    let [selectedDifficulty, setSelectedDifficulty] = useState("none");

    /*
    React calls this method when the player leaves Snake.
    Stops the game so it does not continue running in another room/game.
    */
    function componentWillUnmount() {
        // Do not start if the game is not ready.
        if (typeof stopGame === "function") {
            stopGame();
        }
    }

    /*
    Starts Snake using the selected board size and difficulty.
    The game can only start after its scripts finish loading.
    */
    function startSnake(width: number, height: number, difficulty: string) {

        // Save the selected difficulty, then initialize the game board.
        setSelectedDifficulty(difficulty);
        initSnakeGame(width, height);
    }

    /*
    Displays the Snake screen, difficulty buttons, 
    Goobert's Fullness stat, and movement controls.
    */
    // Only display difficulty choices before a difficulty is selected.
    const showDifficultyPicker = selectedDifficulty === "none";

    return (
        <main className="snake-screen">

            {/* Button to return to the Game Room*/}
            <button
                type="button"
                className="btn game-return-btn"
                onClick={() => load(rooms.gameRoom)}>
                Back to Game Room
            </button>

            {/* Display Fullness only when a Goobert has been selected */}
            {gameGoobert && 
            <div className="fullness-label">
                <label htmlFor="goobert-percentage" key={"SnakeFullnessLabel"}>
                    Fullness
                </label>
                <br />
                <input type="range" min={0} max={100} value={gameGoobert.fullness} 
                id="goobert-percentage" key={"SnakeFullness"} />
            </div>
            }

            {/* Difficulty menu appears before the game starts. */}
            {showDifficultyPicker && (
                <div className="snake-difficulty-menu">
                    <h2 className="snake-difficulty-title">Select Snake Difficulty</h2>
                    <div className="snake-difficulty-buttons">

                        {/* Easy uses a 25 x 25 board */}
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => startSnake(25, 25, "Easy")}
                        >
                            Easy
                        </button>

                        {/* EMedium uses a 17 x 17 board */}
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => startSnake(17, 17, "Medium")}
                        >
                            Medium
                        </button>

                        {/* Hard uses a 10 x 10 board */}
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => startSnake(10, 10, "Hard")}
                        >
                            Hard
                        </button>
                    </div>
                </div>
            )}

            {/* Snake game board is displayed inside this container */}
            <div id="main" className="snake-board"></div>

            {/* Direction buttons for smaller screens and mobile devices */}
            <div id="keys" className="d-block d-md-none">

                {/* Move Snake upward */}
                <i
                    className="bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup"
                    onClick={() => setSnakeVelocity("up")}
                    onTouchStart={(event) => {
                        event.preventDefault();
                        setSnakeVelocity("up");
                    }}>
                </i><br />

                {/* Move Snake left */}
                <i
                    className="bi bi-arrow-left text-white bg-warning p-1 rounded-pill key keyleft"
                    onClick={() => setSnakeVelocity("left")}
                    onTouchStart={(event) => {
                        event.preventDefault();
                        setSnakeVelocity("left");
                    }}>
                </i>

                {/* Move Snake downward */}
                <i
                    className="bi bi-arrow-down text-white bg-warning p-1 rounded-pill key keydown"
                    onClick={() => setSnakeVelocity("down")}
                    onTouchStart={(event) => {
                        event.preventDefault();
                        setSnakeVelocity("down");
                    }}>
                </i>

                {/* Move Snake right */}
                <i
                    className="bi bi-arrow-right text-white bg-warning p-1 rounded-pill key keyright"
                    onClick={() => setSnakeVelocity("right")}
                    onTouchStart={(event) => {
                        event.preventDefault();
                        setSnakeVelocity("right");
                    }}>
                </i>
            </div>
        </main>
    );
}
