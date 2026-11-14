import React from "react";

import "../styles/graveyard.css";
import { doorOpenSound } from "./audio";
import { load, rooms } from "../App";
import useGooberts from "../GoobertContext";
import type { Goobert } from "../Goobert";
import { assetPath } from "../assetPath";

/*=====GOOBERT MEMORIAL PORTRAIT=====*/

const spriteSheets = {
    legs: assetPath("images/goobert-parts/208-tamagotchi-legs.png"),
    body: assetPath("images/goobert-parts/208-tamagotchi-bodies.png"),
    mouth: assetPath("images/goobert-parts/208-tamagotchi-mouths.png"),
    eyes: assetPath("images/goobert-parts/208-tamagotchi-eyes.png")
};

function GoobertMemorial({ goobert }: { goobert: Goobert }) {
    const parts = [
        { key: "legs", col: goobert.legColor, row: goobert.legType },
        { key: "body", col: goobert.bodyColor, row: goobert.bodyType },
        { key: "mouth", col: goobert.mouthExpression ?? 0, row: goobert.mouthType },
        { key: "eyes", col: goobert.eyeExpression ?? 0, row: goobert.eyeType }
    ] as const;

    return (
        <div className="graveyard-portrait" aria-label={`${goobert.name}'s portrait`}>
            {parts.map(part => (
                <div
                    key={part.key}
                    className="graveyard-portrait-layer"
                    style={{
                        backgroundImage: `url("${spriteSheets[part.key]}")`,
                        backgroundPosition: `${-part.col * 64}px ${-part.row * 64}px`
                    }}
                />
            ))}
        </div>
    );
}

/*=====GRAVEYARD=====*/

export default function Graveyard() {
    const { deadGooberts } = useGooberts();

    return (
        <main className="graveyard">
            <button
                type="button"
                className="graveyard-exit-button"
                onClick={() => {
                    doorOpenSound.play();
                    load(rooms.hub);
                }}
            >
                Back to Hub
            </button>

            <section className="graveyard-memorials" aria-label="Goobert memorials">
                <h1>Goobert Graveyard</h1>

                {deadGooberts.length === 0 ? (
                    <div className="graveyard-empty">
                        <div className="graveyard-empty-stones" aria-hidden="true">
                            <div className="graveyard-stone" />
                            <div className="graveyard-stone" />
                            <div className="graveyard-stone" />
                        </div>
                        <p>No Gooberts have been laid to rest in this session.</p>
                    </div>
                ) : (
                    <div className="graveyard-grid">
                        {deadGooberts.map((goobert, index) => (
                            <article className="graveyard-memorial" key={`${goobert.id}-${index}`}>
                                <GoobertMemorial goobert={goobert} />
                                <div className="graveyard-stone">
                                    <span className="graveyard-rip">R.I.P.</span>
                                    <span className="graveyard-name">{goobert.name}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
