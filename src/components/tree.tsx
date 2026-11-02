
"use strict";
import React, { useState } from "react";
import { load, rooms } from "../App";
import { doorOpenSound } from "./audio";
import useGooberts from "../GoobertContext";
import "../styles/tree.css";

type Feature =
    | "bodyType"
    | "bodyColor"
    | "legType"
    | "legColor"
    | "eyeType"
    | "mouthType";

type Appearance = Record<Feature, number>;

const limits: Record<Feature, number> = {
    bodyType: 7,
    bodyColor: 7,
    legType: 7,
    legColor: 7,
    eyeType: 10,
    mouthType: 11
};

const apples: {
    feature: Feature;
    image: string;
    label: string;
}[] = [
    { feature: "bodyType", image: "red-apple.png", label: "Body Type" },
    { feature: "bodyColor", image: "orange-apple.png", label: "Body Color" },
    { feature: "legType", image: "yellow-apple.png", label: "Leg Type" },
    { feature: "legColor", image: "cyan-apple.png", label: "Leg Color" },
    { feature: "eyeType", image: "blue-apple.png", label: "Eyes" },
    { feature: "mouthType", image: "purple-apple.png", label: "Mouth" }
];

function randomNumber(max: number): number {
    return Math.floor(Math.random() * max);
}

function randomAppearance(): Appearance {
    return {
        bodyType: randomNumber(7),
        bodyColor: randomNumber(7),
        legType: randomNumber(7),
        legColor: randomNumber(7),
        eyeType: randomNumber(10),
        mouthType: randomNumber(11)
    };
}

export default function Tree(): React.JSX.Element {

    const { createGoobert } = useGooberts();

    // Store the name entered by the player.
    const [goobieName, setGoobieName] = useState("");

    // Store the currently selected Goobie appearance.
    const [appearance, setAppearance] = useState<Appearance>(
        randomAppearance
    );

    // Randomize only the feature associated with the clicked apple.
    const changeFeature = (feature: Feature) => {
        setAppearance(previous => {
            let selected = randomNumber(limits[feature]);

            // Avoid selecting the same sprite twice in a row.
            if (selected === previous[feature]) {
                selected = (selected + 1) % limits[feature];
            }

            return {
                ...previous,
                [feature]: selected
            };
        });
    };

    // Create a Goobie with the chosen name and appearance.
    const handleCreateGoobert = () => {
        const name = goobieName.trim();

        // Prevent empty or whitespace-only names.
        if (!name) {
            return;
        }

        createGoobert(
            name,
            rooms.hub,
            undefined,
            undefined,
            appearance
        );

        // Return to the Hub after creating the Goobie.
        doorOpenSound.play();
        load(rooms.hub);
    };

    return (
        <main id="main" className="tree">

            {/* TREE BACKGROUND AND CUSTOMIZATION AREA */}
            <div className="tree-scene">

                {/* GOOBERT PREVIEW */}
                <div className="tree-goobert">

                    <div
                        className="tree-sprite tree-legs"
                        style={{
                            backgroundPosition:
                                `${-appearance.legColor * 64}px ${-appearance.legType * 64}px`
                        }}
                    />

                    <div
                        className="tree-sprite tree-body"
                        style={{
                            backgroundPosition:
                                `${-appearance.bodyColor * 64}px ${-appearance.bodyType * 64}px`
                        }}
                    />

                    <div
                        className="tree-sprite tree-mouth"
                        style={{
                            backgroundPosition:
                                `0px ${-appearance.mouthType * 64}px`
                        }}
                    />

                    <div
                        className="tree-sprite tree-eyes"
                        style={{
                            backgroundPosition:
                                `0px ${-appearance.eyeType * 64}px`
                        }}
                    />

                </div>

                {/* CUSTOMIZATION APPLES */}
                <div className="tree-apples">
                    {apples.map(apple => (
                        <button
                            key={apple.feature}
                            type="button"
                            className={`tree-apple tree-apple-${apple.feature}`}
                            title={apple.label}
                            aria-label={`Randomize ${apple.label}`}
                            onClick={() => changeFeature(apple.feature)}
                        >
                            <img
                                src={`images/tree/${apple.image}`}
                                alt=""
                            />
                        </button>
                    ))}
                </div>

            </div>

            {/* ROOM CONTROLS */}
            <div className="tree-controls">
                <button
                    type="button"
                    className="tree-exit"
                    onClick={() => {
                        doorOpenSound.play();
                        load(rooms.hub);
                    }}
                >
                    <span>BACK TO HUB</span>
                </button>
            </div>

            {/* CREATE GOOBIE */}
            <div className="tree-create-controls">

                <input
                    type="text"
                    className="tree-name-input"
                    placeholder="Name your Goobie"
                    aria-label="Goobie name"
                    maxLength={20}
                    value={goobieName}
                    onChange={(event) => setGoobieName(event.target.value)}
                />

                <button
                    type="button"
                    className="tree-create"
                    onClick={handleCreateGoobert}
                    disabled={!goobieName.trim()}
                >
                    CREATE GOOBIE
                </button>

            </div>

            {/* RANDOMIZE ALL FEATURES */}
            <div className="tree-randomize-controls">
                <button
                    type="button"
                    className="tree-randomize"
                    title="Randomize Goobert"
                    aria-label="Randomize Goobert"
                    onClick={() => setAppearance(randomAppearance())}
                >
                    <i className="bi bi-dice-5-fill"></i>
                </button>
            </div>

        </main>
    );
}
