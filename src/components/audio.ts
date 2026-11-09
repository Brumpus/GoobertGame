import { Howl } from "howler";
/*
 * Gooberts Audio
 * Uses Howler.js to play background music.
 */

// Main menu (index) music
export const indexMusic = new Howl({
    src: ["/audio/music/goobie-themesong.mp3"],
    loop: true,
    volume: 1.0
});

// Background music for the Hub and its rooms.
export const hubMusic = new Howl({
    src: ["/audio/music/slow-goobies-theme.mp3"],
    loop: true,
    volume: 0.4
});

//-----------//
// Index SFX //
//-----------//

// Main menu (index) button sounds
export const indexHoverSound = new Howl({
    src: ["/audio/sfx/button-hover.wav"],
    volume: 1.0
});

export const indexClickSound = new Howl({
    src: ["/audio/sfx/button-click.wav"],
    volume: 1.0
});

//---------------//
// Hub Doors SFX //
//---------------//

// Door hover sound.
export const doorHoverSound = new Howl({
    src: ["/audio/sfx/door-hover.mp3"],
    volume: 0.5
});

// Door click sound.
export const doorOpenSound = new Howl({
    src: ["/audio/sfx/door-click.mp3"],
    volume: 1.0
});

//----------//
// Tree SFX //
//----------//

// Sound played when hovering over or clicking the Tree.
export const treeSound = new Howl({
    src: ["/audio/sfx/tree-sound.mp3"],
    volume: 0.5
});

//-------------------//
// Dungeon Latch SFX //
//-------------------//

// Dungeon entrance hover.
export const dungeonHoverSound = new Howl({
    src: ["/audio/sfx/dungeon-hatch-hover.mp3"],
    volume: 0.5
});

// Dungeon entrance click.
export const dungeonClickSound = new Howl({
    src: ["/audio/sfx/dungeon-hatch-click.mp3"],
    volume: 0.3
});

// Ladder exit sound.
export const ladderClickSound = new Howl({
    src: ["/audio/sfx/ladder.mp3"],
    volume: 0.8
});

//---------------------//
// Arcade Machines SFX //
//---------------------//

// Arcade machine hover.
export const arcadeHoverSound = new Howl({
    src: ["/audio/sfx/arcade-machine-hover.mp3"],
    volume: 0.5
});

// Arcade machine click.
export const arcadeClickSound = new Howl({
    src: ["/audio/sfx/arcade-machine-click.mp3"],
    volume: 0.7
});

//-----------------//
// Shared Game SFX //
//-----------------//

// Sound played when game over.
export const gameOverSound = new Howl({
    src: ["/audio/sfx/game-over.mp3"],
    volume: 0.6
});

//--------------------//
// Flappy Goobert SFX //
//--------------------//

// Sound played when Flappy Goobert flaps.
export const flappyGoobertFlapSound = new Howl({
    src: ["/audio/sfx/flappy-goobert-flap.mp3"],
    volume: 0.5
});

// Sound played when Flappy Goobert earns a point.
export const flappyGoobertPointSound = new Howl({
    src: ["/audio/sfx/flappy-goobert-point.mp3"],
    volume: 0.5
});

//----------------//
// Frogoobert SFX //
//----------------//

// Sound played when Frogoobert jumps between tiles.
export const frogoobertJumpSound = new Howl({
    src: ["/audio/sfx/frogoobert-jump.mp3"],
    volume: 0.3
});

//-----------//
// Snake SFX //
//-----------//

// Sound played when Snake eats an apple.
export const snakeEatingSound = new Howl({
    src: ["/audio/sfx/snake-eating.mp3"],
    volume: 0.5
});

//---------------------//
// Goobert General SFX //
//---------------------//

// Sound played when clicking a Goobie.
export const goobertClickSound = new Howl({
    src: ["/audio/sfx/goobert-click.mp3"],
    volume: 0.5
});

// Sound played when creating a Goobie.
export const goobertCreateSound = new Howl({
    src: ["/audio/sfx/goobert-create.mp3"],
    volume: 0.5
});