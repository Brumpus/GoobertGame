"use strict";

// Retrieve appropriate music from HTML
let menuMusic = document.getElementById("menuMusic");

// Retrieve the volume slider element from HTML
let volumeSlider = document.getElementById("volumeSlider");

// Retrieve the volume value display element from HTML
let volumeValue = document.getElementById("volumeValue");

// Retrieve the mute music button element from HTML
let muteMusicButton = document.getElementById("muteMusicButton");

// Retrieve the mute sound effects button element from HTML
let muteSoundButton = document.getElementById("muteSoundButton");

// Set initial music volume to 75%
menuMusic.volume = 0.75;

document.addEventListener("click", startMenuMusic);

// Failsafe to start menu music on first click for picky browsers
function startMenuMusic() {
    if (menuMusic.paused) {
        menuMusic.play();
    }
    
    // Once playing we want to remove the event listener regardless
    document.removeEventListener("click", startMenuMusic);
}

// Function to change the music volume based on the slider's input
function changeVolume() {

    // Retrieve the new volume value from the music slider
    let newVolume = volumeSlider.value;

    // Update volume display to match the slider's value
    volumeValue.textContent = newVolume + "%";

    // Update the music volume based on the slider's value (0-100)
    menuMusic.volume = newVolume / 100;
}

// Change volume when moving the slider
volumeSlider.addEventListener("input", changeVolume);

// Function to mute and unmute music
function toggleMusicMute() {

    if (menuMusic.muted == false) {

        // Mute music
        menuMusic.muted = true;

        // Change button text
        muteMusicButton.textContent = "Unmute Music";

    } else {

        // Unmute music
        menuMusic.muted = false;

        // Change button text
        muteMusicButton.textContent = "Mute Music";
    }
}

// Mute or unmute music when button is clicked
muteMusicButton.addEventListener("click", toggleMusicMute);

//----------------
// SOUND EFFECTS
//----------------

// Retrieve sound effect elements from HTML
let hoverSound = document.getElementById("hoverSound");
let clickSound = document.getElementById("clickSound");

// Retrieve the sound effects volume controls from HTML
let soundSlider = document.getElementById("soundSlider");
let soundValue = document.getElementById("soundValue");

// [IMPORTANT!!!] Retrieve all menu buttons from HTML
let menuButtons = document.querySelectorAll(".menu-button");


// Set initial volume for sound effects
hoverSound.volume = 0.75;
clickSound.volume = 0.75;

// Function changes sound effects volume
function changeSoundVolume() {

    //Retrieve the new volume value from the sound effects slider
    let newSoundVolume = soundSlider.value;

    // Update sound effects volume display
    soundValue.textContent = newSoundVolume + "%";

    // Update all sound effect volumes
    hoverSound.volume = newSoundVolume / 100;
    clickSound.volume = newSoundVolume / 100;

}

// Change cound effects vol when moving slider
soundSlider.addEventListener("input", changeSoundVolume);

// Function to mute and unmute sound effects
function toggleSoundMute() {

    if (hoverSound.muted == false) {

        // Mute all sound effects
        hoverSound.muted = true;
        clickSound.muted = true;

        // Change button text
        muteSoundButton.textContent = "Unmute Sound Effects";

    } else {

        // Unmute all sound effects
        hoverSound.muted = false;
        clickSound.muted = false;

        // Change button text
        muteSoundButton.textContent = "Mute Sound Effects";
    }
}

// Mute or unmute sound effects when button is clicked
muteSoundButton.addEventListener("click", toggleSoundMute);

//----------------
// MENU BUTTON SOUND EFFECTS
//----------------

// Add sound effects to menu buttons
for (let i = 0; i < menuButtons.length; i++) {

    menuButtons[i].addEventListener("mouseenter", playHoverSound);

    menuButtons[i].addEventListener("click", playClickSound);
    

}

// Function to play hover sound
function playHoverSound() {

    hoverSound.currentTime = 0; // Reset the sound to start from the beginning

    hoverSound.play();
}

// Function to play click sound
function playClickSound() {

    clickSound.currentTime = 0; // Reset the sound to start from the beginning

    clickSound.play();
}