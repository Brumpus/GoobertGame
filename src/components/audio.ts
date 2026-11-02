import { Howl } from "howler";
/*
 * Gooberts Audio
 * Uses Howler.js to play background music.
 */
// Main menu (index) music
export const indexMusic = new Howl({
    src: ["audio/music/Goobert-themesong.mp3"],
    loop: true,
    volume: 1.0
});

// Background music for the Hub and its rooms.
export const hubMusic = new Howl({
    src: ["audio/music/slow-Gooberts-theme.mp3"],
    loop: true,
    volume: 0.4
});

// Start the appropriate music after the first click.
document.addEventListener("click", () => {

    if (window.location.pathname.endsWith("hub.html")) {
        hubMusic.play();
    } else {
        indexMusic.play();
    }

}, { once: true });

/*
 * Sound Effects
 */

// Main menu (index) button sounds
export const indexHoverSound = new Howl({
    src: ["audio/sfx/button-hover.wav"],
    volume: 1.0
});

export const indexClickSound = new Howl({
    src: ["audio/sfx/button-click.wav"],
    volume: 1.0
});
// Door hover sound.
export const doorHoverSound = new Howl({
    src: ["audio/sfx/door-hover.mp3"],
    volume: 0.5
});

// Door click sound.
export const doorOpenSound = new Howl({
    src: ["audio/sfx/door-click.mp3"],
    volume: 1.0
});

// Dungeon entrance hover.
export const dungeonHoverSound = new Howl({
    src: ["audio/sfx/dungeon-hatch-hover.mp3"],
    volume: 0.5
});

// Dungeon entrance click.
export const dungeonClickSound = new Howl({
    src: ["audio/sfx/dungeon-hatch-click.mp3"],
    volume: 0.3
});

// Ladder exit sound.
export const ladderClickSound = new Howl({
    src: ["audio/sfx/ladder.mp3"],
    volume: 0.8
});

// Arcade machine hover.
export const arcadeHoverSound = new Howl({
    src: ["audio/sfx/arcade-machine-hover.mp3"],
    volume: 0.5
});

// Arcade machine click.
export const arcadeClickSound = new Howl({
    src: ["audio/sfx/arcade-machine-click.mp3"],
    volume: 0.7
});
