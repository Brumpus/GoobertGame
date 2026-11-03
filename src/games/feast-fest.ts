/*
 * Feast Fest - Falling Food Game
 *
 * Food and trash will fall from the top of the screen.
 * The player will move left and right to catch food
 * while trying to avoid trash.
 *
 * This file handles the falling items and their movement.
 * We will add the player, scoring, and collisions later.
 */

// Stores the information for one falling item.
export type FallingItem = {
    x: number;          // Position from left to right.
    y: number;          // Position from top to bottom.
    speed: number;      // How quickly the item falls.
    isTrash: boolean;   // Whether the item is trash or food.
};

// Keeps track of all items currently falling.
export let fallingItems: FallingItem[] = [];

/*
 * Creates a new food or trash item.
 * Each item starts above the screen at a random position.
 */
export function createFallingItem(gameWidth: number): FallingItem {

    // Give the item a 25% chance of being trash.
    const isTrash = Math.random() < 0.25;

    return {
        // Choose a random horizontal position.
        x: Math.random() * Math.max(0, gameWidth - 32),

        // Start above the visible game area.
        y: -32,

        // Give each item a random falling speed.
        speed: 2 + Math.random() * 3,

        // Remember whether the item is trash.
        isTrash: isTrash
    };
}

/*
 * Updates the position of every falling item.
 * Increasing Y makes an item move downward.
 */
export function updateFallingItems() {
    for (const item of fallingItems) {
        item.y += item.speed;
    }
}

/*
 * Creates and adds a new item to the game.
 */
export function spawnFallingItem(gameWidth: number) {
    fallingItems.push(createFallingItem(gameWidth));
}

/*
 * Clears all falling items when starting a new round.
 */
export function resetFeastFest() {
    fallingItems = [];
}
