'use strict';

import React from "react";

const TRANSPARENT = "images/goobert-parts/Transparent-BG.png";



type AccessoryProps = {
    x: number;
    y: number;
    

    hatType: number;
    hatStyle: number;
    maskType: number;
    maskStyle: number;
    extraType: number;
    extraStyle: number;
}


function AccessoriesFront(props: AccessoryProps): React.JSX.Element {

    return (
    
        <div
            className="accessory-front-container"
            style={{
                position: "fixed",
                left: `${props.x}px`,
                top: `${props.y}px`
            }}
        >
            {/* Masks */}
            <img
                src={TRANSPARENT}
                style={{
                    backgroundImage: `url(./images/accessories/masks.png)`,
                    position: "fixed",
                    height: "96px",
                    width: "128px",
                    left: `${props.x - 32}px`,
                    top: `${props.y -32}px`,
                    backgroundPositionX: `${props.maskStyle * -128}px`,
                    backgroundPositionY: `${props.maskType * -96}px`
                }}
            />

            {/* Hats */}
            <img
                src={TRANSPARENT}
                style={{
                    backgroundImage: `url(./images/accessories/hats-front.png)`,
                    position: "fixed",
                    height: "96px",
                    width: "128px",
                    left: `${props.x - 32}px`,
                    top: `${props.y -32}px`,
                    backgroundPositionX: `${props.hatStyle * -128}px`,
                    backgroundPositionY: `${props.hatType * -96}px`
                }}
            />

            {/* Extra */}
            <img
                src={TRANSPARENT}
                style={{
                    backgroundImage: `url(./images/accessories/extra-front.png)`,
                    position: "fixed",
                    height: "96px",
                    width: "128px",
                    left: `${props.x - 32}px`,
                    top: `${props.y -32}px`,
                    backgroundPositionX: `${props.extraStyle * -128}px`,
                    backgroundPositionY: `${props.extraType * -96}px`
                }}
            />


        </div>
    )
}


function AccessoriesBack(props: AccessoryProps) : React.JSX.Element {

    return (

        <div
            className="accessory-back-container"
            style={{
                position: "fixed",
                left: `${props.x}px`,
                top: `${props.y}px`
            }}
        >
            {/* Extra */}
            <img
                src={TRANSPARENT}
                style={{
                    backgroundImage: `url(./images/accessories/extra-back.png)`,
                    position: "fixed",
                    height: "96px",
                    width: "128px",
                    left: `${props.x - 32}px`,
                    top: `${props.y -32}px`,
                    backgroundPositionX: `${props.extraStyle * -128}px`,
                    backgroundPositionY: `${props.extraType * -96}px`
                }}
            />

            {/* HATS */}
            <img
                src={TRANSPARENT}
                style={{
                    backgroundImage: `url(./images/accessories/hats-back.png)`,
                    position: "fixed",
                    height: "96px",
                    width: "128px",
                    left: `${props.x - 32}px`,
                    top: `${props.y -32}px`,
                    backgroundPositionX: `${props.hatStyle * -128}px`,
                    backgroundPositionY: `${props.hatType * -96}px`
                }}
            />
            
        </div>
    )
}



export {AccessoriesFront, AccessoriesBack};
