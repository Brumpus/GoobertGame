'use strict';
import React, { useState, type PointerEvent, type Ref, type RefObject, type MouseEvent as RMouseEvent } from "react";
import useGooberts from "./GoobertContext";
import { rooms } from "./App";

const BODY_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-bodies.png';
const LEG_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-legs.png';
const EYES_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-eyes.png';
const MOUTH_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-mouths.png';
type GoobertProps = {
    room: string,
    name: any,
    x: number,
    y: number,
    id: string,
    isUi: boolean,

    bodyType: number,
    bodyColor: number,
    legColor: number,
    legType: number,
    eyeType: number,
    mouthType: number,
    mouthExpression: number,
    eyeExpression: number,
    
    onGoobertSelected: Function,
    className?: string,
    ref?: Ref<HTMLElement>
}
export type Goobert = {
    name: string, 
    x: number, 
    y: number, 

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
    const { updatePosition, updateRoom, doorRefs } = useGooberts();

    
    // Used for identifying mouse movement on goobert click
    let [startPos, initStartPos] = useState(
        {
            x: x, 
            y: y,
            mouseDX: 0,
            mouseDY: 0
        }
    );

    // Allow position to update on global 
    let move = (newX: number, newY: number) => {
        setX(newX);
        setY(newY);

        updatePosition(props.id, newX, newY);
    }
    
    
    /* Will trigger only for a particular instance of a goobert when the sprite is clicked */
    let handleMouseStart = (mouse: PointerEvent) => {
        if(props.isUi) return; // ui gooberts can't move

        mouse.currentTarget.setPointerCapture(mouse.pointerId);

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

        move(
            mouse.clientX - startPos.mouseDX,
            mouse.clientY - startPos.mouseDY
        )
    }
    // Stop goobert from being dragged and open ui card if not dragged
    let handleMouseEnd = (mouse: PointerEvent) => {
        mouse.preventDefault();

        if(x == startPos.x && y == startPos.y) {
            // Did not move goobert; interpret as click
            click(props.name);
        } else {
            checkNewRoom();
        }
        
        setIsDragged(false);
    }

    let click = (name: string) => {
        console.log(`${name} says, "I've been poked!"`);
        props.onGoobertSelected();
    }

    function checkNewRoom() {
        // Check intersection with doors
        const keys = Object.keys(doorRefs) as (keyof typeof doorRefs)[];

        for (let i = 0; i < keys.length; i++) {
            let keyString = keys[i];
            if(keyString == undefined) continue;
            let ref: RefObject<HTMLImageElement | HTMLDivElement | null> = doorRefs[keyString];
            
            let boundingRect = ref.current?.getBoundingClientRect();
            if(boundingRect && 
                x < boundingRect.right &&
                x + 64 > boundingRect.left &&
                y < boundingRect.bottom &&
                y + 64 > boundingRect.top
            ) {
                // Convert string to room key
                let roomString = (keys as (keyof typeof rooms)[])[i];
                if(roomString == undefined) continue;
                
                // If going to hub, convert to correct room
                if(roomString.includes("Hub")) roomString = "hub";
                updateRoom(props.id, rooms[roomString]);

                // Randomize position
                updatePosition(
                    props.id,
                    (Math.random() * (window.innerWidth - 64) /* world width */),
                    ((Math.random() * (window.innerHeight - 550 - 64) /* world height */)) + 550
                );

                break; // No need to finish as doors do not overlap
            }
            
        }
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
            <img src={BODY_SPRITE_SHEET} style={{
                left: `${props.bodyColor*(-64)}px`,
                top: `${props.bodyType * -64}px`,
            }}/>
            <img src={MOUTH_SPRITE_SHEET} style={{
                left: `${props.mouthExpression*(-64)}px`,
                top: `${props.mouthType * -64}px`,
            }}/>
            <img src={EYES_SPRITE_SHEET} style={{
                left: `${props.eyeExpression*(-64)}px`,
                top: `${props.eyeType * -64}px`,
            }}/>
        </div>
    )
}




