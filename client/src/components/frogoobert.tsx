"use strict";
import React, { useEffect, useRef, useState } from "react";
import { load, rooms } from "../App";
import { gameGoobert } from "./game-room";
import { doorOpenSound, gameOverSound, frogoobertJumpSound } from "./audio";
import "../games/frogoobert.css";
import useGooberts from "../GoobertContext";

const COLS = 9;
const ROWS = 17;
const START_X = 4;
const START_Y = 16;

type Position = { x: number; y: number };

type Car = { id: number; x: number; row: number; speed: number; width: number; color?: string };

const carColors = ["#ffffff", "#3498db", "#cf5151", "#f1c40f"];

const randomCarColor = (): string => {
    return carColors[Math.floor(Math.random() * carColors.length)] ?? "#ffffff";
};

const startingCars: Car[] = [
    // Row 2: Regular cars, moderately fast.
    { id: 1, x: 0, row: 2, speed: 0.055, width: 1.5 },
    { id: 2, x: 5, row: 2, speed: 0.055, width: 1.5 },

    // Row 3: Longer vehicles, moving left.
    { id: 3, x: 3, row: 3, speed: -0.045, width: 2.4 },
    { id: 4, x: 8, row: 3, speed: -0.045, width: 2.4 },

    // Row 4: Small, fast cars.
    { id: 5, x: 1, row: 4, speed: 0.085, width: 1.1 },
    { id: 6, x: 6, row: 4, speed: 0.085, width: 1.1 },

    // Row 6: Long, slower trucks.
    { id: 7, x: 4, row: 6, speed: -0.040, width: 2.8 },
    { id: 8, x: 9, row: 6, speed: -0.040, width: 2.8 },

    // Row 7: Faster regular cars.
    { id: 9, x: 0, row: 7, speed: 0.075, width: 1.4 },
    { id: 10, x: 5, row: 7, speed: 0.075, width: 1.4 },

    // Row 8: Very fast small cars.
    { id: 11, x: 2, row: 8, speed: -0.095, width: 1.0 },
    { id: 12, x: 7, row: 8, speed: -0.095, width: 1.0 },

    // Additional traffic for the longer track
    { id: 13, x: 1, row: 10, speed: 0.065, width: 1.4 },
    { id: 14, x: 6, row: 10, speed: 0.065, width: 1.4 },

    { id: 15, x: 3, row: 11, speed: -0.045, width: 2.4 },
    { id: 16, x: 8, row: 11, speed: -0.045, width: 2.4 },

    { id: 17, x: 0, row: 12, speed: 0.085, width: 1.1 },
    { id: 18, x: 5, row: 12, speed: 0.085, width: 1.1 },

    { id: 19, x: 2, row: 14, speed: -0.055, width: 1.5 },
    { id: 20, x: 7, row: 14, speed: -0.055, width: 2.5 }
];

// Assign each vehicle a color once per game.
const createCars = (): Car[] =>
    startingCars.map(car => ({ ...car, color: randomCarColor() }));

export default function Frogoobert(): React.JSX.Element {
    const [player, setPlayer] = useState<Position>({ x: START_X, y: START_Y });
    const [cars, setCars] = useState<Car[]>(createCars);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [dexterity, setDexterity] = useState(gameGoobert?.dexterity ?? 0);

    const { updateStat } = useGooberts();

    const playerRef = useRef<Position>({ x: START_X, y: START_Y });
    const carsRef = useRef<Car[]>(cars);
    const scoreRef = useRef(0);
    const highestRowRef = useRef(START_Y);
    const gameOverRef = useRef(false);

    const resetPlayer = () => {
        const start = { x: START_X, y: START_Y };
        playerRef.current = start;
        highestRowRef.current = START_Y;
        setPlayer(start);
    };

    const endGame = () => {
        // Prevent the game-over sound from playing multiple times
        if (gameOverRef.current) return;
        gameOverRef.current = true;

        // Play the game-over sound when Goobert hit by car.
        gameOverSound.play();

        setGameOver(true);
    };

    const checkCollision = (position: Position, vehicles: Car[]) =>
        vehicles.some(car =>
            car.row === position.y &&
            position.x + 0.75 > car.x &&
            position.x + 0.25 < car.x + car.width
        );

    // Use the same selected Goobert object and 0-100 stat meter as other arcade games.
    const rewardGoobert = (amount: number) => {
        if (!gameGoobert) return;
        gameGoobert.dexterity = Math.min(100, Math.max(0, gameGoobert.dexterity + amount));
        setDexterity(gameGoobert.dexterity);
        updateStat(gameGoobert.id, "dexterity", amount);
    };

    const movePlayer = (dx: number, dy: number) => {
        if (gameOverRef.current) return;

        const current = playerRef.current;
        const next = {
            x: Math.max(0, Math.min(COLS - 1, current.x + dx)),
            y: Math.max(0, Math.min(ROWS - 1, current.y + dy))
        };
        if (next.x === current.x && next.y === current.y) return;

        // Play the jump sound when Frogoobert moves to a new tile.
        frogoobertJumpSound.play();
        
        playerRef.current = next;
        setPlayer(next);
        if (checkCollision(next, carsRef.current)) {
            endGame();
            return;
        }

        if (next.y < highestRowRef.current) {
            const rowsAdvanced = highestRowRef.current - next.y;
            const newScore = scoreRef.current + rowsAdvanced * 10;
            scoreRef.current = newScore;
            setScore(newScore);
            setBestScore(previous => Math.max(previous, newScore));
            highestRowRef.current = next.y;
            rewardGoobert(rowsAdvanced); // +1 entertainment per new row
        }

        if (next.y === 0) {
            const newScore = scoreRef.current + 50;
            scoreRef.current = newScore;
            setScore(newScore);
            setBestScore(previous => Math.max(previous, newScore));
            rewardGoobert(5); // +5 entertainment for completing a crossing
            resetPlayer();
        }
    };

    // Stable keyboard listener; the latest move function is used via a ref.
    const moveRef = useRef(movePlayer);
    moveRef.current = movePlayer;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const keys: Record<string, [number, number]> = {
                ArrowUp: [0, -1], ArrowDown: [0, 1],
                ArrowLeft: [-1, 0], ArrowRight: [1, 0],
                w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
            };
            const direction = keys[event.key];
            if (!direction) return;
            event.preventDefault();
            if (event.repeat) return; // one tile per key press
            moveRef.current(direction[0], direction[1]);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        const interval = window.setInterval(() => {
            if (gameOverRef.current) return;
            const updatedCars = carsRef.current.map(car => {
                let nextX = car.x + car.speed;
                if (car.speed > 0 && nextX > COLS) nextX = -car.width;
                if (car.speed < 0 && nextX + car.width < 0) nextX = COLS;
                return { ...car, x: nextX };
            });
            carsRef.current = updatedCars;
            setCars(updatedCars);
            if (checkCollision(playerRef.current, updatedCars)) endGame();
        }, 30);
        return () => window.clearInterval(interval);
    }, []);

    const restartGame = () => {
        scoreRef.current = 0;
        gameOverRef.current = false;
        setScore(0);
        setGameOver(false);
        carsRef.current = createCars();
        setCars(carsRef.current);
        resetPlayer();
    };

    const appearance = gameGoobert;
    const parts = appearance ? [
        { key: "legs", color: appearance.legColor, type: appearance.legType },
        { key: "body", color: appearance.bodyColor, type: appearance.bodyType },
        { key: "mouth", color: appearance.mouthExpression, type: appearance.mouthType },
        { key: "eyes", color: appearance.eyeExpression, type: appearance.eyeType }
    ] : [];

    return (
        <main className="frogoobert">
            <button type="button" className="frogoobert-exit" onClick={() => {
                doorOpenSound.play();
                load(rooms.gameRoom);
            }}>BACK TO GAME ROOM</button>

            <div className="frogoobert-scoreboard">
                <span>SCORE: {score}</span>
                <span>BEST: {bestScore}</span>
            </div>

            {appearance && (
                <div className="frogoobert-meter">
                    <label htmlFor="frogoobert-dexterity">Dexterity</label>
                    <input id="frogoobert-dexterity" type="range" min={0} max={100}
                        value={dexterity} readOnly aria-label="Goobert's Dexterity" />
                    <span>{Math.round(dexterity)}%</span>
                </div>
            )}

            <div className="frogoobert-board">
                {Array.from({ length: ROWS }, (_, row) => (
                    <div key={row}

                    className={[0, 1, 5, 9, 13, 15, 16].includes(row)
                        ? "frogoobert-row safe" : "frogoobert-row road"}
                        style={{ top: `${row / ROWS * 100}%`, height: `${100 / ROWS}%` }} />
                    ))}

                {cars.map(car => (
                    <div key={car.id} className="frogoobert-car"
                        style={{
                            left: `${car.x / COLS * 100}%`,
                            top: `${car.row / ROWS * 100}%`,
                            width: `${car.width / COLS * 100}%`,
                            height: `${100 / ROWS}%`,
                            backgroundColor: car.color
                        }} />
                ))}

                <div className={`frogoobert-player${appearance ? " has-Goobert" : ""}`}
                    style={{
                        left: `${player.x / COLS * 100}%`,
                        top: `${player.y / ROWS * 100}%`,
                        width: `${100 / COLS}%`,
                        height: `${100 / ROWS}%`
                    }}>
                    {parts.map(part => (
                        <div key={part.key} className={`frogoobert-part frogoobert-${part.key}`}
                            style={{ backgroundPosition: `${-part.color * 64}px ${-part.type * 64}px` }} />
                    ))}
                </div>

                {gameOver && (
                    <div className="frogoobert-gameover">
                        <h2>GAME OVER</h2>
                        <p>FINAL SCORE: {score}</p>
                        <button type="button" onClick={restartGame}>PLAY AGAIN</button>
                    </div>
                )}
            </div>

            {/* Tap controls: shown on touch devices, no swipe handling. */}
            <div className="frogoobert-mobile-controls">
                <button type="button" aria-label="Move up" onClick={() => movePlayer(0, -1)}>▲</button>
                <div className="frogoobert-mobile-row">
                    <button type="button" aria-label="Move left" onClick={() => movePlayer(-1, 0)}>◀</button>
                    <button type="button" aria-label="Move down" onClick={() => movePlayer(0, 1)}>▼</button>
                    <button type="button" aria-label="Move right" onClick={() => movePlayer(1, 0)}>▶</button>
                </div>
            </div>
        </main>
    );
}
