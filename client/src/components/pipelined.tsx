import React, { useEffect, useRef, useState, type Ref, type RefObject } from "react";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import useGooberts from "../GoobertContext";
import { gameGoobert } from "./game-room";
import GoobertElement, {type Goobert} from "../Goobert";

import "../games/pipe-game.css"
import Pipe, { Directions } from "../games/pipe";

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
    checkAnswer: (pipes: PipeState[][]) => void;
}
type PipeState = {
    pipeType: string;
    rotation: number,
    isBlue: boolean,
    startblue: boolean,
    x: number,
    y: number
}

export const PipeObject = ({startblue, pipeType, initRotation, x, y, pipes, onRotate, checkAnswer}: Props) => {   
    const getPipeState = () => {
        if(pipes[y] == undefined || pipes[y][x] == undefined) {
            return ({x: x, y: y, rotation: initRotation, pipeType: pipeType, isBlue: startblue});
        } else {
            let pipe = pipes[y][x]
            return {...pipe};
        }
    }


	return (
		<div className='pipe-game-pipe col-2'>
            <button className="btn" onClick={() => {
                onRotate(x, y)
            }} style={{
                border: 'none',
                padding:0,
            }}>
                <img
                    className=""
                    src={`../images/games/${getPipeState().isBlue ? `${pipeType}Blue` : `${pipeType}`}.webp`}
                    alt="pipe"
                    style={{
                        transform: `rotate(${getPipeState().rotation * 90}deg)`,
                        transformOrigin: "center",
                        // transition: 'transform 0.3s ease',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
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
    new Pipe("end"),
    new Pipe("el"),
    new Pipe("eye"),
    new Pipe("end"),
    new Pipe("end"),
    new Pipe("el", true)
];

const pipesTwo = [
    new Pipe("el"),
    new Pipe("tee"),
    new Pipe("tee"),
    new Pipe("el"),
    new Pipe("el"),
    new Pipe("el")
];

const pipesThree = [
    new Pipe("end"),
    new Pipe("eye"),
    new Pipe("el"),
    new Pipe("el"),
    new Pipe("cross"),
    new Pipe("end")
];

const pipesFour = [
    new Pipe("end"),
    new Pipe("el"),
    new Pipe("eye"),
    new Pipe("end"),
    new Pipe("tee"),
    new Pipe("end")
];

const pipesFive = [
    new Pipe("el"),
    new Pipe("cross"),
    new Pipe("end"),
    new Pipe("end"),
    new Pipe("tee"),
    new Pipe("el")
];

const pipesSix = [
    new Pipe("end"),
    new Pipe("tee"),
    new Pipe("eye"),
    new Pipe("tee"),
    new Pipe("el"),
    new Pipe("end")
];

export default function Pipelined() {
    const[gameWon, setGameWon] = useState(false);
    const [isPulled, pullLever] = useState(false);
    const { updateStat } = useGooberts();
    const [cleanliness, setCleanliness] = useState(gameGoobert?.cleanliness?? 0);

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
        })),
        pipesFour.map((pipe, x) => ({
            rotation: pipe.initRotation,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 3
        })),
        pipesFive.map((pipe, x) => ({
            rotation: pipe.initRotation,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 4
        })),
        pipesSix.map((pipe, x) => ({
            rotation: pipe.initRotation,
            isBlue: pipe.isBlue,
            startblue: pipe.isBlue,
            pipeType: pipe.pipeType,
            x: x,
            y: 5
        })),
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
            case "end":
                directions[(pipe.rotation) % 4] = undefined;
                directions[(pipe.rotation + 1) % 4] = undefined;
                directions[(pipe.rotation + 2) % 4] = undefined; 
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

    // Use the same selected Goobert object and 0-100 stat meter as other arcade games.
    const rewardGoobert = (amount: number) => {
        if (!gameGoobert) return;
        gameGoobert.dexterity = Math.min(100, Math.max(0, gameGoobert.cleanliness + amount));
        setCleanliness(gameGoobert.dexterity);
        updateStat(gameGoobert.id, "cleanliness", amount);
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

    const checkAnswer = (currentPipes: PipeState[][]) => {
        const newPipes = currentPipes.map(row =>
            row.map(pipe => ({ ...pipe }))
        );

        var blues = 0;

        // Find all starting blue pipes
        for (const row of newPipes) {
            for (const pipe of row) {
                if (pipe.isBlue) {
                    blues += 1;
                } else {
                }
            }
        }
        
        if (blues === 36) {
            console.log("All Done boss!");
            rewardGoobert(1000000000)
            setGameWon(true);
        } else {
            pullLever((prev) => !prev)
        }
    }

    useEffect(() => {
        fill(pipes);
    }, [])

    // const ImageSwapGif: React.FC = () => {
    // };
    const PipeLever = () => {
        
        
        return(
            <div className="btn shower-lever" style={{
                padding: 0,
                border: 'none'
            }}>
                <img src={`../images/games/showerLeverUp.webp`} alt="" style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }} onClick={() => {
                        checkAnswer(pipes);
                        pullLever((prev) => !prev)
                    }}/>
            </div>
        )
    };
    

	return (
        <main className="pipelined">
            <button type="button" className="frogoobert-exit" onClick={() => {
                doorOpenSound.play();
                load(rooms.gameRoom);
            }}>BACK TO GAME ROOM</button>
            <div className="shower border border-black border-5 d-none d-md-block">
                <img src="../images/games/showerHead.webp" alt="" className="shower-head"/>
                {gameWon ? (
                    <img src="../images/games/WaterAnim.webp" alt="" className="shower-water"/>
                ) : (
                    <img src="../images/games/WaterAnim.webp" alt="" className="shower-water" style={{
                        opacity: 0.0,
                    }}/>
                )

                }
                <GoobertElement 
                    {...gameGoobert!}
                    isUi={true}
                    x={32}
                    y={64}
                    className="shower-goobert"
                />
                <img src="../images/games/showerFloor.webp" alt="" className="shower-floor"/>
            </div>

            <div className="d-none d-md-block">{gameWon ? (
                <img src="../images/games/eyeBlue.webp" alt="" />
            ) : (
                <img src="../images/games/eye.webp" alt="" />
            )}</div>
            <div className="game-container">
                
                <>
                    <div className="row">
                        {pipesOne.map((pipe, i) => <PipeObject
                            x={i} y={0} 
                            {...pipe} key={i} 
                            pipes = {pipes}
                            setPipes = {setPipes}
                            onRotate={rotatePipe}
                            checkAnswer={checkAnswer}
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
                            checkAnswer={checkAnswer}
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
                            checkAnswer={checkAnswer}
                        />			
                        )}
                    </div>
                    <div className="row">
                        {pipesFour.map((pipe, i) => <PipeObject
                            x={i} y={3} 
                            {...pipe} key={i} 
                            pipes = {pipes}
                            setPipes = {setPipes}
                            onRotate={rotatePipe}
                            checkAnswer={checkAnswer}
                        />			
                        )}
                    </div>
                    <div className="row">
                        {pipesFive.map((pipe, i) => <PipeObject
                            x={i} y={4} 
                            {...pipe} key={i} 
                            pipes = {pipes}
                            setPipes = {setPipes}
                            onRotate={rotatePipe}
                            checkAnswer={checkAnswer}
                        />			
                        )}
                    </div>
                    <div className="row">
                        {pipesSix.map((pipe, i) => <PipeObject
                            x={i} y={5} 
                            {...pipe} key={i} 
                            pipes = {pipes}
                            setPipes = {setPipes}
                            onRotate={rotatePipe}
                            checkAnswer={checkAnswer}
                        />			
                        )}
                    </div>
                </>
            </div>
            {!gameWon ? (
                <PipeLever/>
            ) : <img src='../images/games/showerLeverDown.webp' alt="" style={{
                        display: 'block',
                    }}/>}
        </main>
	);
};

