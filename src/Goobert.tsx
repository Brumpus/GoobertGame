'use strict';
import React, { useState, type PointerEvent, type MouseEvent as RMouseEvent } from "react";

const BODY_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-bodies.png';
const LEG_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-legs.png';
const EYES_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-eyes.png';
const MOUTH_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-mouths.png';
export type GoobertProps = {
    room: any,
    name: any,
    x: number,
    y: number,
    isUi: boolean,

    bodyType: number,
    bodyColor: number,
    legColor: number,
    legType: number,
    eyeType: number,
    mouthType: number,
    mouthExpression: number,
    eyeExpression: number,
    
    className: string,
    onGoobertSelected: Function
}
export type Goobert = {
    name: string, 
    x: number, 
    y: number, 
    setX: Function,
    setY: Function,

    room: string, 
    id: string,

    fullness: number, // Eating, catch the food game
    swagosity: number, // Boredom, Snake
    awakeness: number, // Sleeping
    cleanliness: number, // Bathing, Flappy Goobert

    bodyType: number,
    bodyColor: number,
    legType: number,
    legColor: number,
    eyeType: number,
    mouthType: number,
    eyeExpression: number,
    mouthExpression: number,

    eat: Function,
    sleep: Function,
    entertain: Function,
    bathe: Function,

    onGoobertSelected: Function

} 
export default function Goobert(props: GoobertProps): React.JSX.Element {
    let [x, setX] = useState(props.x);
    let [y, setY] = useState(props.y);
    let [isDragged, setIsDragged] = useState(false);

    
    // Used for identifying mouse movement on goobert click
    let [startPos, initStartPos] = useState(
        {
            x: x, 
            y: y,
            mouseDX: 0,
            mouseDY: 0
        }
    );
    
    
    /* Will trigger only for a particular instance of a goobert when the sprite is clicked */
    let handleMouseStart = (mouse: PointerEvent) => {
        if(props.isUi) return; // ui gooberts can't move

        mouse.currentTarget.setPointerCapture(mouse.pointerId);

        // Update positions to be within game screen
        if(x > window.innerWidth) {
            setX(window.innerWidth - 64);
        }
        if (y > window.innerHeight) {
            setY(window.innerHeight - 64);
        }
        initStartPos(
            {
                x: x, 
                y: y,
                mouseDX: mouse.clientX - x,
                mouseDY:  mouse.clientY - y
            }
        );
        setIsDragged(true);
    }
    // Drags gooberts as the mouse moves
    let handleMouseOver = (mouse: PointerEvent) => {
        if(!isDragged) return; // Don't drag gooberts that have not been clicked on

        setX(mouse.clientX - startPos.mouseDX);
        setY(mouse.clientY - startPos.mouseDY);
    }
    // Stop goobert from being dragged and open ui card if not dragged
    let handleMouseEnd = (mouse: PointerEvent) => {
        mouse.preventDefault();

        if(x == startPos.x && y == startPos.y) {
            // Did not move goobert; interpret as click
            click(props.name);
        }
        
        setIsDragged(false);
    }

    let click = (name: string) => {
        console.log(`${name} says, "I've been poked!"`);
        props.onGoobertSelected();
    }
    return (
        <div className="goobert-container" 
            onPointerDown={handleMouseStart}
            onPointerMove={handleMouseOver}
            onPointerUp={handleMouseEnd}

            // Mouseover and mousend handled on the window level because if the mouse is moving quickly,
            // it may leave the goobert div before onmouseover is caled.

            style={{left: `${x}px`, top: `${y}px`}}
        >
            <img src={LEG_SPRITE_SHEET} draggable={false} style={{
                left: `${props.legColor*(-64)}px`,
                top: `${props.legType * -64}px`,
            }}/>
            <img src={BODY_SPRITE_SHEET} draggable={false} style={{
                left: `${props.bodyColor*(-64)}px`,
                top: `${props.bodyType * -64}px`,
            }}/>
            <img src={MOUTH_SPRITE_SHEET} draggable={false} style={{
                left: `${props.mouthExpression*(-64)}px`,
                top: `${props.mouthType * -64}px`,
            }}/>
            <img src={EYES_SPRITE_SHEET} draggable={false} style={{
                left: `${props.eyeExpression*(-64)}px`,
                top: `${props.eyeType * -64}px`,
            }}/>
        </div>
    )
}




