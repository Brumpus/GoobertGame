"use strict";
import React, { useState, type MouseEventHandler, type PointerEvent } from "react";
import GoobertElement from "../Goobert";
import type { Goobert } from "../Goobert";

/* TODO: 
 - change the goobert to match the appearance of the clicked goobert
 - change the stats to match the stats of the clicked goobert
 - make the card be able to rotate and have the goobert, statbars, and icons line up correctly
 - render the card to the page via React 
 */

const statBarWidth = 47;

type UIProps = {
    goobert: Goobert
    onUiClose: MouseEventHandler<HTMLImageElement>
}
export default function UIGoobertCard({goobert, onUiClose}: UIProps): React.JSX.Element {
    let [x, setX] = useState(goobert.x);
    let [y, setY] = useState(goobert.y);
    let [isDragged, setIsDragged] = useState(false);
    let [savedGoobert, updateSavedGoobert] = useState(goobert.id);

    let move = (newX: number, newY: number) => {
        setX(newX);
        setY(newY);
    }

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
            if((mouse.target as HTMLElement).id == "ui-card-xbutton") return;
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
            setIsDragged(false);
        }


    if(savedGoobert != goobert.id) {
        setX(goobert.x);
        setY(goobert.y);
        updateSavedGoobert(goobert.id);
    }

    return (
        <div 
            className="info-card" 
            style={{left: x, top: y}}
            
            onPointerDown={handleMouseStart}
            onPointerMove={handleMouseOver}
            onPointerUp={handleMouseEnd}
        >
            <img id="card-frame-back" src="images/goobert-parts/Transparent-BG.png" />
            <GoobertElement
                {...goobert}
                isUi={true}
                x={11} 
                y={11} 
                className="goobert-container icon"
            />
            <div className="ui-statbar-container">
                <img id="ui-statbar-fullness" style={{width:statBarWidth * (goobert.fullness / 100)}} src="images/goobert-parts/Transparent-BG.png"/>
                <img id="ui-statbar-awakeness" style={{width:statBarWidth * (goobert.awakeness / 100)}} src="images/goobert-parts/Transparent-BG.png"/>
                <img id="ui-statbar-swagosity" style={{width:statBarWidth * (goobert.swagosity / 100)}} src="images/goobert-parts/Transparent-BG.png"/>
                <img id="ui-statbar-cleanliness" style={{width:statBarWidth * (goobert.cleanliness / 100)}} src="images/goobert-parts/Transparent-BG.png"/>
            </div>
            <img id="card-frame-front" src="images/goobert-parts/Transparent-BG.png" />
            <div className="ui-icon-container">
                <img id="ui-icon-fullness" src="images/goobert-parts/Transparent-BG.png"/>
                <img id="ui-icon-awakeness" src="images/goobert-parts/Transparent-BG.png"/>
                <img id="ui-icon-swagosity" src="images/goobert-parts/Transparent-BG.png"/>
                <img id="ui-icon-cleanliness" src="images/goobert-parts/Transparent-BG.png"/>
            </div>
            <img id="ui-card-xbutton" src="images/goobert-parts/Transparent-BG.png" onClick={onUiClose} />

        </div>
    );
}