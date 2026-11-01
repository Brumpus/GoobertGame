"use strict";
import React, { useState, type MouseEventHandler } from "react";
import GoobertElement from "../Goobert";
import type { Goobert } from "../App";

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
    let [savedGoobert, updateSavedGoobert] = useState(goobert.id);

    if(savedGoobert != goobert.id) {
        setX(goobert.x);
        setY(goobert.y);
        updateSavedGoobert(goobert.id);
    }

    console.log(goobert);

    return (
        <div className="info-card" style={{left: x, top: y}}>
            <img id="card-frame-back" src="images/goobert-parts/Transparent-BG.png" />
            <GoobertElement
                {...goobert}
                x={"0.6em"} 
                y={"0.6em"} 
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