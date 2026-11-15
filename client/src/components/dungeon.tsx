import React, { useState } from "react";

import { ladderClickSound, arcadeClickSound, arcadeHoverSound } from "./audio";
import { load, rooms } from "../App";
import Mutant, { MutantType } from "../Mutant";
import useGooberts from "../GoobertContext";

import "../styles/dungeon.css";
import { assetPath } from "../assetPath";

/*=====MUTATION NAMES=====*/

const mutationNames: Record<MutantType, string> = {
    [MutantType.SLEEPLESS]: "Sleepless",
    [MutantType.DIRTY]: "Dirty",
    [MutantType.BORED]: "Bored",
    [MutantType.HUNGRY]: "Hungry"
};

/*=====DUNGEON COMPONENT=====*/

export default function Dungeon() {
    const { doorRefs, gooberts, mutants } = useGooberts();
    const [selectorOpen, setSelectorOpen] = useState(false);

    // Only show genuine mutated Gooberts that still have an original character.
    const availableMutants = mutants.filter(mutant =>
        mutant.goobertId && gooberts.some(g => g.id === mutant.goobertId)
    );

    // The Dungeon renders its own prisoners; App.tsx does not duplicate them.
    const dungeonMutants = availableMutants.filter(mutant => mutant.room === rooms.dungeon);

    const openSelector = () => {
        arcadeClickSound.play();
        setSelectorOpen(true);
    };

    const closeSelector = () => setSelectorOpen(false);

    const startRescue = (id: string) => {
        closeSelector();
        load(`${rooms.dungeonDash}?id=${encodeURIComponent(id)}`);
    };

    const startPractice = () => {
        closeSelector();
        load(`${rooms.dungeonDash}?practice=1`);
    };

    return (
        <main className="dungeon">
            <div className="dungeonWrapper d-flex flex-column justify-content-between vh-100">
                <div className="dungeonWall">
                    {/*=====EXIT LADDER=====*/}
                    <div className="col-12 text-center">
                        <img
                            id="escape"
                            className="img-fluid"
                            src={assetPath("images/doors/Ladder.webp")}
                            alt="Return to Hub"
                            ref={doorRefs.dungeonHub}
                            onClick={() => {
                                ladderClickSound.play();
                                load(rooms.hub);
                            }}
                        />
                    </div>

                    {/*=====DUNGEON DASH ARCADE MACHINE=====*/}
                    <div className="dash-machine-area">
                        <button
                            type="button"
                            className="dash-machine-button"
                            aria-label="Play Dungeon Dash"
                            onMouseEnter={() => arcadeHoverSound.play()}
                            onClick={openSelector}
                        >
                            <img
                                src={assetPath("images/dungeon-dash/dungeon-dash-machine.png")}
                                alt="Dungeon Dash arcade machine"
                            />
                        </button>
                    </div>

                    {/*=====DUNGEON PRISONERS=====*/}
                    <div className="prisoners" aria-label="Mutated Gooberts in the Dungeon">
                        {dungeonMutants.map((mutant, index) => (
                            <div className="dungeon-prisoner" key={mutant.goobertId ?? index}>
                                <Mutant {...mutant} x="0px" y="0px" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dungeonFloor">
                    <div className="col-12" />
                </div>
            </div>

            {/*=====MUTANT SELECTION DIALOG=====*/}
            {selectorOpen && (
                <div className="dash-selector-backdrop" onClick={closeSelector}>
                    <div
                        className="dash-selector"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Choose a Goobert to cure"
                        onClick={event => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="dash-selector-close"
                            onClick={closeSelector}
                            aria-label="Close selector"
                        >
                            ✕
                        </button>

                        <h2>Dungeon Dash</h2>
                        <p>Select a mutated Goobert to cure.</p>

                        <div className="dash-selector-list">
                            {availableMutants.map((mutant, index) => {
                                const goobert = gooberts.find(g => g.id === mutant.goobertId)!;

                                return (
                                    <button
                                        type="button"
                                        key={mutant.goobertId ?? index}
                                        onClick={() => startRescue(goobert.id)}
                                    >
                                        <span>
                                            <strong>{goobert.name}</strong>
                                            <small>{mutationNames[mutant.type]} mutation</small>
                                        </span>
                                        <span>Rescue</span>
                                    </button>
                                );
                            })}

                            {availableMutants.length === 0 && (
                                <p>No mutated Gooberts yet. Practice mode is available.</p>
                            )}
                        </div>

                        <button type="button" className="dash-practice" onClick={startPractice}>
                            Practice Run (no cure)
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
