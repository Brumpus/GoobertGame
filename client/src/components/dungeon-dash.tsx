import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { load, rooms } from "../App";
import useGooberts, { renderGoobert } from "../GoobertContext";
import type { Goobert } from "../Goobert";
import { dungeonDashJumpSound, gameOverSound } from "./audio";

import "../games/dungeon-dash.css";
import { assetPath } from "../assetPath";

/*=====GAME SETTINGS=====*/

const WIDTH = 420;
const HEIGHT = 620;
const TARGET = 5000;

const PLAYER_SIZE = 54;
const GRAVITY = 1150;
const BOUNCE = 690;
const SPEED = 280;
const PLATFORM_HEIGHT = 14;
const MONSTER_HEIGHT = 160;

/*=====GAME TYPES=====*/

type GameStatus = "playing" | "lost" | "won";
type Direction = "left" | "right";

type Platform = {
    x: number;
    y: number;
    width: number;
    moving: boolean;
    phase: number;
    origin: number;
    speed: number;
    range: number;
};

type GameState = {
    x: number;
    y: number;
    vy: number;
    camera: number;
    best: number;
    platforms: Platform[];
    nextPlatformY: number;
    monsterY: number;
    status: GameStatus;
};

/*=====DIFFICULTY SETTINGS=====*/

// Difficulty increases gradually over the 5,000-unit climb.
function difficultyAt(height: number): number {
    return Math.min(1, Math.max(0, height / TARGET));
}

function platformWidthAt(height: number): number {
    return 90 - difficultyAt(height) * 30;
}

function createPlatform(previous: Platform, height: number): Platform {
    const difficulty = difficultyAt(height);
    const width = platformWidthAt(height);

    // Higher ledges are spaced farther apart, but remain jumpable.
    const horizontalRange = 150 + difficulty * 35;
    const x = Math.max(
        12,
        Math.min(
            WIDTH - width - 12,
            previous.origin + (Math.random() - 0.5) * horizontalRange * 2
        )
    );

    return {
        x,
        y: height,
        width,
        origin: x,
        phase: Math.random() * Math.PI * 2,
        moving: height > 250 && Math.random() < 0.20 + difficulty * 0.35,
        speed: 1.2 + difficulty * 1.4,
        range: 24 + difficulty * 26
    };
}

/*=====STARTING GAME STATE=====*/

function newGame(): GameState {
    const firstPlatform: Platform = {
        x: 166,
        y: 60,
        width: 92,
        moving: false,
        phase: 0,
        origin: 166,
        speed: 0,
        range: 0
    };

    const platforms = [firstPlatform];
    let height = firstPlatform.y;

    while (height < 900) {
        const difficulty = difficultyAt(height);
        height += 102 + Math.random() * (28 + difficulty * 20);
        platforms.push(createPlatform(platforms[platforms.length - 1]!, height));
    }

    return {
        x: 180,
        y: 75,
        vy: BOUNCE,
        camera: 0,
        best: 0,
        platforms,
        nextPlatformY: height,
        monsterY: -90,
        status: "playing"
    };
}

/*=====GOOBERT APPEARANCE=====*/

const imageSources = {
    legs: assetPath("images/goobert-parts/208-tamagotchi-legs.png"),
    body: assetPath("images/goobert-parts/208-tamagotchi-bodies.png"),
    mouth: assetPath("images/goobert-parts/208-tamagotchi-mouths.png"),
    eyes: assetPath("images/goobert-parts/208-tamagotchi-eyes.png")
};

function drawGoobert(
    ctx: CanvasRenderingContext2D,
    goobert: Goobert,
    images: Record<string, HTMLImageElement>,
    x: number,
    y: number
): void {
    const drawPart = (key: string, column: number, row: number) => {
        const image = images[key];

        if (!image?.complete || image.naturalWidth === 0) {
            return;
        }

        ctx.drawImage(
            image,
            column * 64,
            row * 64,
            64,
            64,
            x,
            y,
            PLAYER_SIZE,
            PLAYER_SIZE
        );
    };

    /*=====SPRITE LOADING FALLBACK=====*/

    // If the browser cannot load the sprite sheets, show a visible player
    // instead of leaving the game board blank. The real Goobert sprites
    // replace this fallback automatically as soon as they finish loading.
    const spritesReady = ["legs", "body", "mouth", "eyes"].every(key => {
        const image = images[key];
        return image?.complete && image.naturalWidth > 0;
    });

    if (!spritesReady) {
        ctx.fillStyle = "#78dcb4";
        ctx.fillRect(x + 9, y + 8, PLAYER_SIZE - 18, PLAYER_SIZE - 14);
        ctx.fillStyle = "#241e31";
        ctx.fillRect(x + 18, y + 21, 5, 5);
        ctx.fillRect(x + 31, y + 21, 5, 5);
        ctx.fillRect(x + 22, y + 35, 12, 3);
        return;
    }

    drawPart("legs", goobert.legColor, goobert.legType);
    drawPart("body", goobert.bodyColor, goobert.bodyType);
    drawPart("mouth", goobert.mouthExpression ?? 0, goobert.mouthType);
    drawPart("eyes", goobert.eyeExpression ?? 0, goobert.eyeType);
}

/*=====DUNGEON DASH COMPONENT=====*/

export default function DungeonDash() {
    const { gooberts, mutants, cureGoobert } = useGooberts();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const selectedId = params.get("id");
    const practice = params.get("practice") === "1";

    const eligible = !!selectedId && mutants.some(
        (mutant) => mutant.goobertId === selectedId
    );

    const actualGoobert = gooberts.find(
        (goobert) => goobert.id === selectedId
    );

    const demoRef = useRef<Goobert | null>(null);

    if (!demoRef.current) {
        demoRef.current = renderGoobert(
            "Practice Goobert",
            rooms.dungeon
        ) as Goobert;
    }

    // Keep the selected Goobert available through the victory screen.
    // Curing removes the mutant record, so eligibility alone cannot control rendering.
    const rescuePlayerRef = useRef<Goobert | null>(null);

    if (!practice && eligible && actualGoobert && !rescuePlayerRef.current) {
        rescuePlayerRef.current = actualGoobert;
    }

    const player = practice
        ? actualGoobert ?? demoRef.current
        : rescuePlayerRef.current ?? (eligible ? actualGoobert : undefined);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const monsterRef = useRef<HTMLImageElement>(null);
    const keysRef = useRef({ left: false, right: false });
    const gameRef = useRef<GameState>(newGame());
    const playerRef = useRef(player);
    const curedRef = useRef(false);

    playerRef.current = player;

    const [status, setStatus] = useState<GameStatus>("playing");
    const [progress, setProgress] = useState(0);
    const [attempt, setAttempt] = useState(0);

    /*=====GAME LOOP=====*/

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");

        if (!ctx || !player) {
            return;
        }

        const images: Record<string, HTMLImageElement> = {};

        Object.entries(imageSources).forEach(([key, src]) => {
            const image = new Image();
            image.src = src;
            images[key] = image;
        });

        let frame = 0;
        let lastFrame = 0;
        let displayedProgress = -1;

        const tick = (now: number) => {
            const dt = Math.min((now - (lastFrame || now)) / 1000, 0.035);
            lastFrame = now;

            const game = gameRef.current;

            /*=====PLAYER MOVEMENT=====*/

            if (game.status === "playing") {
                const previousBottom = game.y;
                const horizontal = Number(keysRef.current.right) - Number(keysRef.current.left);

                game.x += horizontal * SPEED * dt;

                if (game.x > WIDTH) {
                    game.x = -PLAYER_SIZE;
                } else if (game.x < -PLAYER_SIZE) {
                    game.x = WIDTH;
                }

                game.vy -= GRAVITY * dt;
                game.y += game.vy * dt;

                /*=====MOVING PLATFORMS=====*/

                for (const platform of game.platforms) {
                    if (!platform.moving) {
                        continue;
                    }

                    platform.phase += dt * platform.speed;
                    platform.x = Math.max(
                        8,
                        Math.min(
                            WIDTH - platform.width - 8,
                            platform.origin + Math.sin(platform.phase) * platform.range
                        )
                    );
                }

                /*=====AUTOMATIC JUMPING=====*/

                if (game.vy < 0) {
                    for (const platform of game.platforms) {
                        const top = platform.y + PLATFORM_HEIGHT;
                        const crossed = previousBottom >= top && game.y <= top;
                        const overlaps = game.x + PLAYER_SIZE - 8 > platform.x &&
                            game.x + 8 < platform.x + platform.width;

                        if (crossed && overlaps) {
                            game.y = top;
                            game.vy = BOUNCE;
                            dungeonDashJumpSound.play();
                            break;
                        }
                    }
                }

                /*=====HEIGHT AND RECOVERY=====*/

                game.best = Math.max(game.best, game.y);
                game.camera = Math.max(game.camera, game.best - 290);

                const percent = Math.min(100, Math.floor(game.best / TARGET * 100));

                if (percent !== displayedProgress) {
                    displayedProgress = percent;
                    setProgress(percent);
                }

                /*=====PLATFORM GENERATION=====*/

                while (game.nextPlatformY < game.best + 750) {
                    const previous = game.platforms[game.platforms.length - 1]!;
                    const difficulty = difficultyAt(game.nextPlatformY);

                    const nextHeight =
                        game.nextPlatformY +
                        102 +
                        Math.random() * (28 + difficulty * 20);

                    game.platforms.push(createPlatform(previous, nextHeight));

                    game.nextPlatformY = nextHeight;
                }

                game.platforms = game.platforms.filter(
                    (platform) => platform.y > game.camera - 80
                );

                /*=====MONSTROSITY PURSUIT=====*/

                // The monster follows the camera and closes in slightly at higher levels.
                // Its visible image and collision boundary share the same world position.
                const difficulty = difficultyAt(game.best);
                const chaseDistance = 355 - difficulty * 65;
                const desiredMonsterY = game.best - chaseDistance;

                game.monsterY = Math.max(
                    game.monsterY,
                    Math.min(desiredMonsterY, game.monsterY + (170 + difficulty * 85) * dt)
                );

                /*=====WIN AND LOSS CONDITIONS=====*/

                // Victory takes priority once the cure target is reached.
                if (game.best >= TARGET) {
                    game.status = "won";
                    setStatus("won");

                    if (!practice && selectedId && !curedRef.current) {
                        curedRef.current = true;
                        cureGoobert(selectedId);
                    }
                } else if (
                    game.y < game.camera - 60 ||
                    game.y < game.monsterY + 75
                ) {
                    game.status = "lost";
                    setStatus("lost");
                    gameOverSound.play();
                }
            }

            /*=====DRAW BACKGROUND=====*/

            const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
            gradient.addColorStop(0, "#141126");
            gradient.addColorStop(1, "#30203b");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.fillStyle = "#ffffff10";

            for (let i = 0; i < 34; i++) {
                const x = (i * 139 + 17) % WIDTH;
                const y = ((i * 117 - game.camera * 0.18) % HEIGHT + HEIGHT) % HEIGHT;
                ctx.fillRect(x, y, 3, 3);
            }

            /*=====DRAW PLATFORMS AND PLAYER=====*/

            for (const platform of game.platforms) {
                const screenY = HEIGHT - (platform.y - game.camera) - PLATFORM_HEIGHT;

                if (screenY < -25 || screenY > HEIGHT + 25) {
                    continue;
                }

                ctx.fillStyle = platform.moving ? "#b88ce8" : "#79bd8b";
                ctx.fillRect(platform.x, screenY, platform.width, PLATFORM_HEIGHT);

                ctx.fillStyle = platform.moving ? "#794cbb" : "#426f54";
                ctx.fillRect(platform.x + 5, screenY + PLATFORM_HEIGHT - 4, platform.width - 10, 4);
            }

            if (playerRef.current) {
                drawGoobert(
                    ctx,
                    playerRef.current,
                    images,
                    game.x,
                    HEIGHT - (game.y - game.camera) - PLAYER_SIZE
                );
            }

            /*=====POSITION MONSTROSITY GIF=====*/

            if (monsterRef.current) {
                const screenY = HEIGHT - (game.monsterY - game.camera) - MONSTER_HEIGHT;

                // Keep the monster visible near the bottom of the board.
                // Collision detection uses monsterY, not the clamped display position.
                const visibleY = Math.max(HEIGHT * 0.65, Math.min(HEIGHT * 0.82, screenY));
                monsterRef.current.style.top = `${(visibleY / HEIGHT) * 100}%`;
                monsterRef.current.style.display = "block";
            }

            if (game.status === "playing") {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
        };
    }, [attempt, selectedId, practice, !!player]);

    /*=====KEYBOARD CONTROLS=====*/

    useEffect(() => {
        const keyDown = (event: KeyboardEvent) => {
            if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(event.key)) {
                event.preventDefault();
            }

            if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
                keysRef.current.left = true;
            }

            if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
                keysRef.current.right = true;
            }
        };

        const keyUp = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
                keysRef.current.left = false;
            }

            if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
                keysRef.current.right = false;
            }
        };

        const clearKeys = () => {
            keysRef.current.left = false;
            keysRef.current.right = false;
        };

        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
        window.addEventListener("blur", clearKeys);

        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);
            window.removeEventListener("blur", clearKeys);
        };
    }, []);

    /*=====RETRY AND TOUCH CONTROLS=====*/

    const retry = () => {
        // A rescued Goobert is no longer mutated; don't restart a completed rescue.
        if (status === "won" && !practice) {
            load(rooms.dungeon);
            return;
        }

        keysRef.current = { left: false, right: false };
        gameRef.current = newGame();
        curedRef.current = false;
        setProgress(0);
        setStatus("playing");
        setAttempt((current) => current + 1);
    };

    const touch = (direction: Direction, pressed: boolean) => {
        keysRef.current[direction] = pressed;
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, direction: Direction) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        touch(direction, true);
    };

    const handlePointerEnd = (direction: Direction) => {
        touch(direction, false);
    };

    /*=====GAME INTERFACE=====*/

    return (
        <main className="dash-page">
            <div className="dash-header">
                <button type="button" onClick={() => load(rooms.dungeon)}>
                    Dungeon
                </button>

                <strong>DUNGEON DASH</strong>
                <span>{practice ? "Practice" : player?.name ?? "No Goobert"}</span>
            </div>

            {!player ? (
                <div className="dash-message">
                    <h2>No mutated Goobert selected</h2>
                    <p>Choose a mutant from the Dungeon arcade machine, or try practice mode.</p>
                    <button
                        type="button"
                        onClick={() => load(`${rooms.dungeonDash}?practice=1`)}
                    >
                        Practice
                    </button>
                </div>
            ) : (
                <>
                    <div className="dash-meter">
                        <div className="dash-meter-label">
                            <span>Mutation recovery</span>
                            <strong>{progress}%</strong>
                        </div>

                        <div className="dash-meter-track">
                            <div style={{ width: `${progress}%` }} />
                        </div>

                        <small>
                            {Math.min(TARGET, Math.floor(gameRef.current.best))} / {TARGET} height units
                        </small>
                    </div>

                    <div className="dash-board">
                        <canvas
                            ref={canvasRef}
                            width={WIDTH}
                            height={HEIGHT}
                            aria-label="Dungeon Dash vertical platforming game"
                        />

                        <img
                            ref={monsterRef}
                            className="dash-monster"
                            src={assetPath("images/dungeon-dash/monstrocity-goobert.gif")}
                            alt="The pursuing monstrosity"
                        />

                        {status !== "playing" && (
                            <div className="dash-overlay">
                                <h2>
                                    {status === "won"
                                        ? practice ? "Practice complete!" : "Goobert cured!"
                                        : "Game Over"}
                                </h2>

                                <p>
                                    {status === "won"
                                        ? practice
                                            ? "You reached the rescue height!"
                                            : `${player.name} has been restored.`
                                        : "The monstrosity caught up. Try again!"}
                                </p>

                                <div className="dash-actions">
                                    {(status !== "won" || practice) && (
                                        <button type="button" onClick={retry}>
                                            Play Again
                                        </button>
                                    )}

                                    <button type="button" onClick={() => load(rooms.dungeon)}>
                                        Return to Dungeon
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="dash-controls">
                        <button
                            type="button"
                            onPointerDown={(event) => handlePointerDown(event, "left")}
                            onPointerUp={() => handlePointerEnd("left")}
                            onPointerCancel={() => handlePointerEnd("left")}
                            onLostPointerCapture={() => handlePointerEnd("left")}
                            style={{ touchAction: "none" }}
                        >
                            LEFT
                        </button>

                        <button
                            type="button"
                            onPointerDown={(event) => handlePointerDown(event, "right")}
                            onPointerUp={() => handlePointerEnd("right")}
                            onPointerCancel={() => handlePointerEnd("right")}
                            onLostPointerCapture={() => handlePointerEnd("right")}
                            style={{ touchAction: "none" }}
                        >
                            RIGHT
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}
