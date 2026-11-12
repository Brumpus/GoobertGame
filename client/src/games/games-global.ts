import { load, rooms } from "../App";

export let game: any;
export let body: HTMLElement | null = null;
export function setBody(element: HTMLElement) {
    body = element;
}

export function refreshGameBody() {
    body = document.getElementById("main");
    return body;
}

export function stopGame() {
    if (game) {
        window.clearInterval(game);
        game = null;
    }
    document.removeEventListener("keydown", keypress);
    document.removeEventListener("keyup", keyReleased);
}

export function start(fps: number, gameLoop: Function) {
    stopGame();
    refreshGameBody();
    if (!body) return;

    // Add key press event & start game
    document.addEventListener("keydown", keypress);
    document.addEventListener("keyup", keyReleased);
    game = setInterval(gameLoop, 1000 / fps); // 10FPS
}
export const keys: boolean[] = [];
export let width = 15, height = 15;
export function setWidth(amt: number): void {
    width = amt;
}
export function setHeight(amt: number): void {
    height = amt;
}

// Update grid size to a power of 2, since it helps render images better
export function getGridSize() {
    const columns = Math.max(width + 1, 1);
    const rows = Math.max(height + 1, 1);
    const desired = Math.floor(
        Math.min(
            window.innerWidth / columns,
            window.innerHeight / rows
        )
    );

    return Math.max(desired, 4);
}
export function setBodySize() {
    refreshGameBody();
    if (!body) return;
    
    // Update grid size
    gridSize = getGridSize();

    // Update body size
    body.style.width = (width+1) * gridSize + "px";
    body.style.height = (height+1) * gridSize + "px";

}
export let gridSize = getGridSize();

export function resetGame() {
    stopGame();

    // Pause for a quarter second to let the player know they died
    // Then send the player back to game room
    setTimeout(() => {
        if (typeof load === "function") {
            load(rooms.gameRoom);
        } else {
            history.back();
        }
    }, 250);
}
export function keypress(e: any) {
    keys[e.key.toLowerCase()] = true;
}
export function keyReleased(e: any) {
    keys[e.key.toLowerCase()] = false;
}
