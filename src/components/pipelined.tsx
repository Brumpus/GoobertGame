import React, { useRef, useState, type Ref, type RefObject } from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";

import "../games/pipe-game.css"
import Pipe, { Directions } from "../games/pipe";

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
    startblue: boolean | undefined;
    x: number;
    y: number;
    // Pipes variable held by pipeGame
    pipes: PipeState[][];
    setPipes: React.Dispatch<React.SetStateAction<PipeState[][]>>
}
type PipeState = {
    pipeType: string;
    rotation: number,
    isBlue: boolean,
    x: number,
    y: number
}

export const PipeObject = ({startblue, pipeType, initRotation, x, y, pipes, setPipes}: Props) => {
    const[isBlue, setIsBlue] = useState<boolean>(startblue ?? false);
    // const changeColor = () => {
    //     return pipeType = `${type}Blue`;
    // }

	const [rotation, setRotation] = useState<number>(initRotation);

    const handleRotate = () => {
        setRotation((prevRotation) => (prevRotation + 1) % 4);     
        
        fill(getPipeState());
    };
    /**
     * Get neighboring pipes
     * @returns array of neighboring pipes
     */
    const getNeighbors = (pipe: PipeState) => {
        const neighbors: (PipeState|undefined)[] = [];

        neighbors.push(pipes[pipe.y - 1]?.[pipe.x]);
        neighbors.push(pipes[pipe.y]?.[pipe.x + 1]);
        neighbors.push(pipes[pipe.y + 1]?.[pipe.x]);
        neighbors.push(pipes[pipe.y]?.[pipe.x - 1]);

        return neighbors;
    }
    /**
     * Check which neighboring pipes actually touch current pipe
     * @returns Array of connected pipes
     */
    const getConnections = (pipe: PipeState) => {
        const neighbors = getNeighbors(pipe);

        const directions = getDirections(pipe);

        const connections: PipeState[] = [];

        for (let i = 0; i < 4; i++) {
            const neighbor = neighbors[i];

            // Skip empty neighboring cells
            if (!neighbor) continue;

            const neighborDirs = getDirections(neighbor);

            // Check whether both pipes have an opening
            // facing each other.
            const oppositeDirection = (i + 2) % 4;

            const currentHasOpening = directions[i] !== undefined;
            const neighborHasOpening = neighborDirs[oppositeDirection] !== undefined;

            if (currentHasOpening && neighborHasOpening) {
                connections.push(neighbor);
            }
        }

        console.log(connections);
        return connections;
    }
    /**
     * Get valid flow directions for pipes
     * 
     * @param pipe which pipe is being checked
     * @returns directions the pipe is able to flow
     */
    const getDirections = (pipe: PipeState): (Directions | undefined)[] => {

        const directions: (Directions | undefined)[] = [
            Directions.up, 
            Directions.right, 
            Directions.down, 
            Directions.left
        ];

        switch (pipe.pipeType) {
            case "el":
                directions[(pipe.rotation + 1) % 4] = undefined;
                directions[(pipe.rotation + 2) % 4] = undefined;
            break;
            case "eye":
                directions[(pipe.rotation + 1) % 4] = undefined;
                directions[(pipe.rotation + 3) % 4] = undefined; 
            break;
            case "tee":
                directions[(pipe.rotation + 1) % 4] = undefined;
            break;
        }

        return directions;
    }
    const getPipeState = () => {return ({x: x, y: y, rotation: rotation, pipeType: pipeType, isBlue: isBlue})}
    /**
     * Update react state to allow pipes to communicate with their neighbors
     */
    const updatePipes = (pipeState: PipeState) => {
        setPipes(prev =>
            prev.map((row, rowIndex) =>
            rowIndex === pipeState.y
                ? row.map((pipe, colIndex) =>
                    colIndex === pipeState.x
                        ? { ...pipeState }
                        : pipe
                )
                : row
            )
        );
    }
    const fill = (pipeState: PipeState) => {
        if(isBlue) {
            const connections = getConnections(pipeState);

            for(let pipe of connections) {
                if(!pipe.isBlue) {
                    pipe.isBlue = true;
                    updatePipes(pipe)
                    fill(pipe);
                }
            }
        }
    }
    


	return (
		<div className='pipe-game-pipe col-3'>
            <button className="btn" onClick={() => {
                handleRotate();

                updatePipes(getPipeState());
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
    new Pipe("tee", 3, true),
    new Pipe("tee", 2),
    new Pipe("tee", 2),
    new Pipe("el", 1)
];

console.log(pipesThree);

export const PipeGame = () => {
    
    const [pipes, setPipes] = useState<PipeState[][]>([
        pipesOne.map((pipe, x) => ({
            rotation: pipe.initRotation - 1,
            isBlue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 0
        })),
        pipesTwo.map((pipe, x) => ({
            rotation: pipe.initRotation - 1,
            isBlue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 1
        })),
        pipesThree.map((pipe, x) => ({
            rotation: pipe.initRotation - 1,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 2
        }))
    ]);
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

