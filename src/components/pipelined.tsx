import React, { useRef, useState, type Ref, type RefObject } from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";

import "../games/pipe-game.css"
import Pipe from "../games/pipe";

export default function Pipelined(){
    return(
        <main className="pipelined">
            <button type="button" className="frogoobert-exit" onClick={() => {
                doorOpenSound.play();
                load(rooms.gameRoom);
            }}>BACK TO GAME ROOM</button>
            
            <div className="game-container">
                <PipeGame />
            </div>
        </main>
    )
};

interface Props {
    pipeType: string;
    initRotation: number;
    neighbors?: Pipe[];
    x: number;
    y: number;
    ref?: RefObject<null> | undefined;
    // Pipes variable held by pipeGame
    pipes: PipeState[][];
    setPipes: React.Dispatch<React.SetStateAction<PipeState[][]>>
}
type PipeState = {
    rotation: number,
    isBlue: boolean
}

export const PipeObject = ({pipeType, initRotation, x, y, pipes, setPipes, ref}: Props) => {
    const[isBlue, setIsBlue] = useState<boolean>(false);
    // const changeColor = () => {
    //     return pipeType = `${type}Blue`;
    // }

	const [rotation, setRotation] = useState<number>(initRotation);

    const handleRotate = () => {
        setRotation((prevRotation) => (prevRotation + 1) % 4);        
    };
    const getNeighbors = () => {
        const neighbors: (PipeState|undefined)[] = [];

        neighbors.push(pipes[y - 1]?.[x]);
        neighbors.push(pipes[y + 1]?.[x]);
        neighbors.push(pipes[y]?.[x - 1]);
        neighbors.push(pipes[y]?.[x + 1]);

        return neighbors;
    }
    const updatePipes = () => {
        setPipes(prev =>
            prev.map((row, rowIndex) =>
            rowIndex === y
                ? row.map((pipe, colIndex) =>
                    colIndex === x
                        ? { rotation, isBlue }
                        : pipe
                )
                : row
            )
        );
        console.log("Updated pipes!");
    }

	return (
		<div ref={ref} className='pipe-game-pipe col-3'>
            <button className="btn" onClick={() => {
                handleRotate();
                setIsBlue(!isBlue);
                
                updatePipes();
                console.log(getNeighbors());
            }}>
                <img
                    className=""
                    src={`../images/games/${isBlue ? `${pipeType}Blue` : `${pipeType}`}.webp`}
                    alt="pipe"
                    style={{
                        transform: `rotate(${rotation * 90}deg)`,
                        transition: 'transform 0.3s ease',
                    }}
                />
            </button>
        </div>
	);
};

// const pipes = [
//     [(0,0), (0,1), (0,2), (0, 3)],
//     [(1,0), (1,1), (1,2), (1, 3)],
//     [(2,0), (2,1), (2,2), (2, 3)],
// ]
const pipesOne = [
    new Pipe("el", 0),
    new Pipe("eye", 1),
    new Pipe("eye", 1),
    new Pipe("el", 3)
];

const pipesTwo = [
    new Pipe("eye", 1),
    new Pipe("eye", 1),
    new Pipe("eye", 1),
    new Pipe("tee", 3)
];

const pipesThree = [
    new Pipe("tee", 3),
    new Pipe("tee", 2),
    new Pipe("tee", 2),
    new Pipe("el", 1)
];

export const PipeGame = () => {
    
    const [pipes, setPipes] = useState<PipeState[][]>(
        Array.from({ length: 3 }, () =>
            Array.from({ length: 4 }, () => ({
                rotation: 0,
                isBlue: false
            }))
        )
    );

	return (
		<>
			<div className="row">
				{pipesOne.map((pipe, i) => <PipeObject
                    x={i} y={0} 
                    {...pipe} key={i} 
                    pipes = {pipes}
                    setPipes = {setPipes}
                />
            )}
			</div>
            <div className="row">
                {pipesTwo.map((pipe, i) => <PipeObject
                    x={i} y={1} 
                    {...pipe} key={i} 
                    pipes = {pipes}
                    setPipes = {setPipes}
                />			
                )}
            </div>
            <div className="row">
                {pipesThree.map((pipe, i) => <PipeObject
                    x={i} y={2} 
                    {...pipe} key={i} 
                    pipes = {pipes}
                    setPipes = {setPipes}
                />			
                )}
			</div>
		</>
	);
};

