import React, { useEffect, useRef, useState } from "react";
import { createFallingItem, type FallingItem } from "../games/feast-fest";
import "../games/feast-fest.css";
import { gameGoobert } from "./game-room";
import useGooberts from "../GoobertContext";

/*
 * Feast Fest - Falling Food Minigame
 *
 * Food and trash fall from the top of the screen.
 * Move the catcher left and right using a mouse or finger.
 *
 * Catch food: +1 point
 * Catch trash: Game Over
 * Miss food: -1 point
 *
 * Goobert's animation and the team's sprites
 * will be added later.
 */
export default function FeastFest(): React.JSX.Element {

    const { updateStat } = useGooberts();

    // Game information displayed on the screen.
    const [items, setItems] = useState<FallingItem[]>([]);
    const [score, setScore] = useState(0);
    const [fullness, setFullness] = useState(gameGoobert?.fullness ?? 0);
    const [gameOver, setGameOver] = useState(false);
    const [catcherX, setCatcherX] = useState(280);

    // References used by the game timer.
    const boardRef = useRef<HTMLDivElement>(null);
    const catcherXRef = useRef(280);
    const itemsRef = useRef<FallingItem[]>([]);

    /*
     * Start the falling-food game timer.
     * It restarts when Play Again is clicked.
     */
    useEffect(() => {

        // Stop the game while Game Over is showing.
        if (gameOver) return;

        const gameTimer = window.setInterval(() => {
            const board = boardRef.current;
            if (!board) return;

            const boardHeight = board.clientHeight;
            const boardWidth = board.clientWidth;

            // The catcher stays near the bottom of the board.
            const catcherY = boardHeight - 40;
            const catcherLeft = catcherXRef.current;

            let pointsEarned = 0;
            let foodCaught = 0;
            let caughtTrash = false;
            const remainingItems: FallingItem[] = [];

            /*
             * Move each item and check for collisions.
             */
            for (const item of itemsRef.current) {

                // Move the item downward.
                const movedItem = {
                    ...item,
                    y: item.y + item.speed
                };

                // Check whether the item touches the catcher.
                const touchesCatcher =
                    movedItem.x < catcherLeft + 80 &&
                    movedItem.x + 32 > catcherLeft &&
                    movedItem.y < catcherY + 30 &&
                    movedItem.y + 32 > catcherY;

                if (touchesCatcher) {
                    if (movedItem.isTrash) {
                        // Catching trash ends the game.
                        caughtTrash = true;
                    } else {
                        // Catching foods adds one point and increases fullness.
                        pointsEarned += 1;
                        foodCaught += 1;
                    }
                    continue;
                }

                // Missing food subtracts one point.
                if (
                    !movedItem.isTrash &&
                    movedItem.y + 32 >= boardHeight
                ) {
                    pointsEarned -= 1;
                    continue;
                }

                // Remove trash that falls below the board.
                if (movedItem.y >= boardHeight) {
                    continue;
                }

                remainingItems.push(movedItem);
            }

            // Update the score.
            if (pointsEarned !== 0) {
                setScore(previousScore =>
                    previousScore + pointsEarned
                );
            }

            // Increase Goobert's Fullness when food is caught.
            if (foodCaught > 0 && gameGoobert) {
                updateStat(gameGoobert.id, "fullness", foodCaught);

                setFullness(previousFullness =>
                    Math.min(100, previousFullness + foodCaught)
                );
            }

            // Occasionally spawn a new item.
            if (!caughtTrash && Math.random() < 0.04) {
                remainingItems.push(
                    createFallingItem(boardWidth)
                );
            }

            // Update the falling items on screen.
            itemsRef.current = remainingItems;
            setItems(remainingItems);

            // End the game when the player catches trash.
            if (caughtTrash) {
                setGameOver(true);
                window.clearInterval(gameTimer);
            }

        }, 33);

        // Clean up the timer when the game stops.
        return () => window.clearInterval(gameTimer);

    }, [gameOver, updateStat]);

    /*
     * Move the catcher using a mouse or finger.
     * Pointer events support desktop and mobile devices.
     */
    function handlePointerMove(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        const board = boardRef.current;
        if (!board || gameOver) return;

        // Find the pointer's position inside the board.
        const bounds = board.getBoundingClientRect();
        const pointerX = event.clientX - bounds.left;

        // Keep the catcher inside the board.
        const newX = Math.max(
            0,
            Math.min(pointerX - 40, board.clientWidth - 80)
        );

        catcherXRef.current = newX;
        setCatcherX(newX);
    }

    /*
     * Restart the game after Game Over.
     */
    function playAgain() {
        itemsRef.current = [];
        setItems([]);
        setScore(0);

        catcherXRef.current = 280;
        setCatcherX(280);

        // Restart the game timer.
        setGameOver(false);
    }

    return (
        <main className="feast-screen">
            <button
                type="button"
                className="feast-back-button"
                onClick={() => load(rooms.gameRoom)}
            >
                Back to Game Room
            </button>

            <h1>Feast Fest!</h1>
            <p>Catch the food and avoid the trash!</p>

            {/* Display the current score */}
            <div className="feast-score">
                Score: {score}
            </div>

            {/* Display Goobert's Fullness */}
            {gameGoobert && (
                <div className="feast-fullness-label">
                    <label htmlFor="feast-fullness">Fullness</label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={fullness}
                        id="feast-fullness"
                        readOnly
                    />
                </div>
            )}

            {/* Main game board */}
            <div
                ref={boardRef}
                className="feast-board"
                onPointerDown={handlePointerMove}
                onPointerMove={handlePointerMove}
            >

                {/* Display food and trash from the sprite sheet */}
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="feast-item"
                        style={{
                            left: item.x,
                            top: item.y,

                            // Each sprite is 32x32 pixels in a sheet with 6 columns.
                            backgroundPosition: `${
                                -(item.spriteIndex % 6) * 32
                            }px ${
                                -Math.floor(item.spriteIndex / 6) * 32
                            }px`
                        }}
                    />
                ))}

                {/* Temporary orange catcher */}
                <div
                    className="feast-catcher"
                    style={{ left: catcherX }}
                />
            </div>

            {/* Game Over screen */}
            {gameOver && (
                <div className="feast-game-over-panel">
                    <h2>Game Over!</h2>
                    <p>You ate trash!</p>
                    <p>Final Score: {score}</p>

                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={playAgain}
                    >
                        Play Again
                    </button>
                </div>
            )}
        </main>
    );
}
