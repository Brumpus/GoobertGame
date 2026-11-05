import React, { useEffect, useRef, useState, type Ref, type RefObject } from "react";
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
    setPipes: React.Dispatch<React.SetStateAction<PipeState[][]>>;
    onRotate: (x: number, y: number) => void;
}
type PipeState = {
    pipeType: string;
    rotation: number,
    isBlue: boolean,
    startblue: boolean,
    x: number,
    y: number
}

export const PipeObject = ({startblue, pipeType, initRotation, x, y, pipes, onRotate}: Props) => {   
    const getPipeState = () => {
        if(pipes[y] == undefined || pipes[y][x] == undefined) {
            return ({x: x, y: y, rotation: initRotation, pipeType: pipeType, isBlue: startblue});
        } else {
            let pipe = pipes[y][x]
            return {...pipe};
        }
    }


	return (
		<div className='pipe-game-pipe col-3'>
            <button className="btn" onClick={() => onRotate(x, y)}>
                <img
                    className=""
                    src={`../images/games/${getPipeState().isBlue ? `${pipeType}Blue` : `${pipeType}`}.webp`}
                    alt="pipe"
                    style={{
                        transform: `rotate(${getPipeState().rotation * 90}deg)`,
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
    new Pipe("eye"),
    new Pipe("eye"),
    new Pipe("eye"),
    new Pipe("eye")
];

const pipesTwo = [
    new Pipe("eye"),
    new Pipe("cross"),
    new Pipe("el"),
    new Pipe("tee")
];

const pipesThree = [
    new Pipe("el", true),
    new Pipe("tee"),
    new Pipe("eye"),
    new Pipe("el")
];

export const PipeGame = () => {
    
    const [pipes, setPipes] = useState<PipeState[][]>([
        pipesOne.map((pipe, x) => ({
            rotation: pipe.initRotation,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 0
        })),
        pipesTwo.map((pipe, x) => ({
            rotation: pipe.initRotation,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 1
        })),
        pipesThree.map((pipe, x) => ({
            rotation: pipe.initRotation,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 2
        }))
    ]);

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
                directions[(pipe.rotation) % 4] = undefined;
                directions[(pipe.rotation + 1) % 4] = undefined;
            break;
            case "eye":
                directions[(pipe.rotation) % 4] = undefined;
                directions[(pipe.rotation + 2) % 4] = undefined; 
            break;
            case "tee":
                directions[(pipe.rotation) % 4] = undefined;
            break;
        }

        return directions;
    }

    const rotatePipe = (x: number, y: number) => {
        const updatedPipes = pipes.map(row =>
            row.map(pipe => ({ ...pipe } as PipeState))
        );
        if(updatedPipes[y] == undefined) return;
        if(updatedPipes[y][x] == undefined) return;

        updatedPipes[y][x].rotation =
            (updatedPipes[y][x].rotation + 1) % 4;

        fill(updatedPipes);
    };

    /**
     * Find all pipes which are meant to be blue, flood fills pipes around it.
     * 
     * 
     * @param currentPipes the current pipe state
     */
    const fill = (currentPipes: PipeState[][]) => {
        const newPipes = currentPipes.map(row =>
            row.map(pipe => ({ ...pipe }))
        );

        const queue: PipeState[] = [];

        // Find all starting blue pipes
        for (const row of newPipes) {
            for (const pipe of row) {
                if (pipe.startblue) {
                    queue.push(pipe);
                } else {
                    pipe.isBlue = false;
                }
            }
        }

        while (queue.length > 0) {
            const current = queue.shift()!;

            const directions = getDirections(current);

            const neighbors = [
                newPipes[current.y - 1]?.[current.x],
                newPipes[current.y]?.[current.x + 1],
                newPipes[current.y + 1]?.[current.x],
                newPipes[current.y]?.[current.x - 1]
            ];

            for (let i = 0; i < 4; i++) {
                const neighbor = neighbors[i];

                if (!neighbor || neighbor.isBlue) continue;

                const neighborDirections = getDirections(neighbor);

                const oppositeDirection = (i + 2) % 4;

                if (
                    directions[i] !== undefined &&
                    neighborDirections[oppositeDirection] !== undefined
                ) {
                    neighbor.isBlue = true;
                    queue.push(neighbor);
                }
            }
        }

        setPipes(newPipes);
    };

    useEffect(() => {
        fill(pipes);
    }, [])


	return (
		<>
			<div className="row">
				{pipesOne.map((pipe, i) => <PipeObject
                    x={i} y={0} 
                    {...pipe} key={i} 
                    pipes = {pipes}
                    setPipes = {setPipes}
                    onRotate={rotatePipe}
                />
            )}
			</div>
            <div className="row">
                {pipesTwo.map((pipe, i) => <PipeObject
                    x={i} y={1} 
                    {...pipe} key={i} 
                    pipes = {pipes}
                    setPipes = {setPipes}
                    onRotate={rotatePipe}
                />			
                )}
            </div>
            <div className="row">
                {pipesThree.map((pipe, i) => <PipeObject
                    x={i} y={2} 
                    {...pipe} key={i} 
                    pipes = {pipes}
                    setPipes = {setPipes}
                    onRotate={rotatePipe}
                />			
                )}
			</div>
		</>
	);
};

