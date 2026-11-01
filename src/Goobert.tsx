'use strict';
import React from "react";

const BODY_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-bodies.png';
const LEG_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-legs.png';
const EYES_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-eyes.png';
const MOUTH_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-mouths.png';
type GoobertProps = {
    room: string,
    name: any,
    x: string,
    y: string,

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
export default function Goobert(props: GoobertProps): React.JSX.Element {
    /* Will trigger only for a particular instance of a goobert when the sprite is clicked */
    let click = (name: string) => {
        console.log(`${name} says, "I've been poked!"`);
        props.onGoobertSelected();
    }
    return (
        <div className="goobert-container" onClick={() => click(props.name)} style={{left: `${props.x}px`, top: `${props.y}px`}}>
            <img src={LEG_SPRITE_SHEET} style={{
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




