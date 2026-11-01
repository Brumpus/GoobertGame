"use strict";
import React from "react";
import { load, rooms, type Goobert, type createGoobert } from "../App";
import { doorHoverSound, doorOpenSound, dungeonClickSound, dungeonHoverSound } from "./audio";
import "../styles/hub.css";


/* 
Displays the test Goobert in the Hub.
The different body parts are displayed using separate image elements.
*/
export const TestGoobert = (props: any) => {
    return (
        <div className="goobert-container" style={{scale: "3 3", left: "17em", top: "36em"}}>
            <img id="goobert-legs" src="images/goobert-parts/Transparent-BG.png"/>
            <img id="goobert-body" src="images/goobert-parts/Transparent-BG.png"/>
            <img id="goobert-mouth" src="images/goobert-parts/Transparent-BG.png"/>
            <img id="goobert-eyes" src="images/goobert-parts/Transparent-BG.png"/>
        </div>
    );
}
/* 
Main Hub component where the player can customize Gooberts
and navigate to different rooms.
*/
export default function Hub(props: any): React.JSX.Element {
    return (
        <main id="main" className="hub">

            {/* Tree used for Goobert Customization */}
            <div className="tree-container">

                <img src="images/hub/gooberts_tree.png" 
                    alt="GOOBERTS HUB" 
                    className="pixelated-tree" 
                    id="goobert-tree" />

                {/* Clickable areas that change the Goobert's appearance */}
                <div id="tree-body-area" onClick={changeBodyType}></div>
                <div id="tree-legs-area" onClick={changeLegType}></div>
                <div id="tree-mouth-area" onClick={changeMouth}></div>
                <div id="tree-eyes-area" onClick={changeEyes}></div>
                <div id="tree-body-color" onClick={changeBodyColor}></div>
                <div id="tree-legs-color" onClick={changeLegColor}></div>

                {/* Display the Goobert being customized */}
                <TestGoobert createGoobert
                />
            </div>

            {/* Bedroom door */}
            <div className="sleep-door-container">
                <img src="images/hub/DreamDoor.webp" alt="BEDROOM" id="sleep-door"
                
                // Play the hover sound when mouse enters the door
                onMouseEnter={() => doorHoverSound.play()}
                // Play the opening sound and enter
                onClick={() => {
                    doorOpenSound.play();
                    load(rooms.bedroom);
                }} />
            </div>

            {/* Game Room door */}
            <div className="game-door-container">
                <img src="images/hub/game-door.png" alt="GAME" id="game-door"
                
                // Play the hover sound when mouse enters the door
                onMouseEnter={() => doorHoverSound.play()}
                // Play the opening sound and enter
                onClick={() => {
                    doorOpenSound.play();
                    load(rooms.gameRoom);
                }} />
            </div>

            {/* Shop door */}
            <div className="shop-door-container">
                <img src="images/hub/shop-door.png" alt="SHOP" id="shop-door"
                
                // Play the hover sound when mouse enters the door
                onMouseEnter={() => doorHoverSound.play()}
                // Play the opening sound and enter
                onClick={() => {
                    doorOpenSound.play();
                    load(rooms.shop);
                }} />               
            </div>

            {/* Return to main menu door */}
            <div className="leave-door-container">
                <img src="images/hub/leave-door.png" alt="LEAVE" id="leave-door"
                
                // Play the hover sound when mouse enters the door
                onMouseEnter={() => doorHoverSound.play()}
                // Play the opening sound and enter
                onClick={() => {
                    doorOpenSound.play();
                    load(rooms.menu);
                }} />   
            </div>

            {/* Dungeon door */}
            <div className="dungeon-door-container">
                <img src="images/doors/DungeonDoor.webp" alt="THE DUNGEON" id="dungeon-door" 
                
                // Play the hover sound when mouse enters the door
                onMouseEnter={() => dungeonHoverSound.play()}
                // Play the opening sound and enter
                onClick={() => {
                    dungeonClickSound.play();
                    load(rooms.dungeon);
                }} />
            </div>

        </main>
    );
}

/* Basic asset index selectors. */
/*
Stores the currently selected appearance options for the test Goobert.
Each number represents a different sprite or color option
*/
let hubAssets = {
    bodyType: 0,
    bodyColor: 0,
    legType: 0,
    legColor: 0,
    eyeType: 0,
    eyeExpression: 0,
    mouthType: 0,
    mouthExpression: 0
};

/* Controls for the test goobert */
const randomizeFeatures = () => {
    hubAssets.bodyType = Math.floor(Math.random() * 7);
    hubAssets.bodyColor = Math.floor(Math.random() * 7);
    hubAssets.legType = Math.floor(Math.random() * 7);
    hubAssets.legColor = Math.floor(Math.random() * 7);
    hubAssets.eyeType = Math.floor(Math.random() * 10);
    hubAssets.mouthType = Math.floor(Math.random() * 11);
    setBodyType(hubAssets.bodyType);
    setBodyColor(hubAssets.bodyColor);
    setLegsType(hubAssets.legType);
    setLegsColor(hubAssets.legColor);
    setEyes(hubAssets.eyeType);
    setMouth(hubAssets.mouthType);
};

// Switches to the next body type when the player clicks tree
// Once the last body type is reached, return to the first.
const changeBodyType = function() {
    hubAssets.bodyType = (hubAssets.bodyType == 6) ? 0 : hubAssets.bodyType + 1;
    // Update the Goobert's body sprite
    setBodyType(hubAssets.bodyType);
};

const changeBodyColor = function() {
    hubAssets.bodyColor = (hubAssets.bodyColor == 6) ? 0 : hubAssets.bodyColor + 1;
    setBodyColor(hubAssets.bodyColor);
};

const changeLegType = function() {
    hubAssets.legType = (hubAssets.legType == 6) ? 0 : hubAssets.legType + 1;
    setLegsType(hubAssets.legType);
};

const changeLegColor = function() {
    hubAssets.legColor = (hubAssets.legColor == 6) ? 0 : hubAssets.legColor + 1;
    setLegsColor(hubAssets.legColor);
};

const changeEyes = function() {
    hubAssets.eyeType = (hubAssets.eyeType == 9) ? 0 : hubAssets.eyeType + 1;
    setEyes(hubAssets.eyeType);
};

const changeEyesExpression = () => {
    hubAssets.eyeExpression = (hubAssets.eyeExpression == 6) ? 0 : hubAssets.eyeExpression + 1;
    setEyeExpression(hubAssets.eyeExpression);
};

const changeMouth = function() {
    hubAssets.mouthType = (hubAssets.mouthType == 10) ? 0 : hubAssets.mouthType + 1;
    setMouth(hubAssets.mouthType);
};

const changeMouthExpression = () => {
    hubAssets.mouthExpression = (hubAssets.mouthExpression == 5) ? 0 : hubAssets.mouthExpression + 1;
    setMouthExpression(hubAssets.mouthExpression);
};

/*
Stores the currently selected appearance options for the test Goobert.
Each number represents a different sprite or color option.
*/
const setBodyType = (assetIndex: number) => {
    const element = document.getElementById('goobert-body')!;
    // Move the background image vertically to display the selected body.
    element.style.backgroundPositionY = (hubAssets.bodyType*(-64)) + 'px';
};

const setBodyColor = (assetIndex: number) => {
    const element = document.getElementById('goobert-body')!;
    element.style.backgroundPositionX = (assetIndex*(-64)) + 'px';
};

const setLegsType = (assetIndex: number) => {
    const element = document.getElementById('goobert-legs')!;
    element.style.backgroundPositionY = (assetIndex*(-64)) + 'px';
};

const setLegsColor = (assetIndex: number) => {
    const element = document.getElementById('goobert-legs')!;
    element.style.backgroundPositionX = (assetIndex*(-64)) + 'px';
};

const setEyes = (assetIndex: number) => {
    const element = document.getElementById('goobert-eyes')!;
    element.style.backgroundPositionY = (assetIndex*(-64)) + 'px';
};

const setEyeExpression = (assetIndex: number) => {
    const element = document.getElementById('goobert-eyes')!;
    element.style.backgroundPositionX = (assetIndex*(-64)) + 'px';
};

const setMouth = (assetIndex: number) => {
    const element = document.getElementById('goobert-mouth')!;
    element.style.backgroundPositionY = (assetIndex*(-64)) + 'px';
};

const setMouthExpression = (assetIndex: number) => {
    const element = document.getElementById('goobert-mouth')!;
    element.style.backgroundPositionX = (assetIndex*(-64)) + 'px';
};