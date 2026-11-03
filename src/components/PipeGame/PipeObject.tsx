import React, { useState } from "react";

import "../../games/pipe-game.css"
import type Pipe from "./pipe";

interface Props {
    pipeType: string;
}

const PipeObject = ({pipeType}: Props) => {
    const[isBlue, setIsBlue] = useState<boolean>(false);

    // const changeColor = () => {
    //     return pipeType = `${type}Blue`;
    // }

	const [rotation, setRotation] = useState<number>(0);

    const handleRotate = () => {
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    };

	return (
		<div className='pipe col-3'>
            <button className="btn" onClick={() => {
                handleRotate();
                setIsBlue(!isBlue)
            }}>
                <img
                className=""
                src={`../images/games/${isBlue ? `${pipeType}Blue` : `${pipeType}`}.webp`}
                alt="pipe"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: 'transform 0.3s ease',
                }}
                />
            </button>
        </div>
	);
};

export default PipeObject;