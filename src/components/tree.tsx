"use strict";

import React, { useState, type KeyboardEvent } from "react";
import { load, rooms } from "../App";
import { treeSound, goobertCreateSound } from "./audio";
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

// Each fruit uses a 64x64 section of fruit-buttons.png.
// The sprite sheet contains six fruits arranged horizontally.
const apples: {
    feature: Feature;
    spriteIndex: number;
    label: string;
}[] = [
    { feature: "bodyType", spriteIndex: 0, label: "Body Type" },
    { feature: "bodyColor", spriteIndex: 1, label: "Body Color" },
    { feature: "legType", spriteIndex: 2, label: "Leg Type" },
    { feature: "legColor", spriteIndex: 3, label: "Leg Color" },
    { feature: "eyeType", spriteIndex: 4, label: "Eyes" },
    { feature: "mouthType", spriteIndex: 5, label: "Mouth" }
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
    const [GoobertName, setGoobertName] = useState("");

    // Store the currently selected Goobert appearance.
    const [appearance, setAppearance] = useState<Appearance>(
        randomAppearance
    );

    // Track the currently displayed dice face (0 through 5).
    const [diceFace, setDiceFace] = useState(0);

    // Cycle through the available options for the selected feature.
    const changeFeature = (feature: Feature) => {
        setAppearance(previous => {
            let selected = (previous[feature] + 1) % limits[feature];

            return {
                ...previous,
                [feature]: selected
            };
        });
    };

    // Randomize all Goobert features and roll the dice.
    const rollDice = () => {

        // Generate a new random Goobert appearance.
        setAppearance(randomAppearance());

        // Select a different dice face from the previous roll.
        setDiceFace(previous => {
            const next = Math.floor(Math.random() * 5);

            // Skip the previously displayed face.
            return next >= previous ? next + 1 : next;
        });
    };

    // Create a Goobert with the chosen name and appearance.
    const handleCreateGoobert = () => {
        const name = GoobertName.trim();

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

        // Play the Goobie creation sound.
        goobertCreateSound.play();

        // Clear the name for the next Goobie.
        setGoobertName("");

        // Generate a new appearance for the next Goobie.
        setAppearance(randomAppearance());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key == "Enter") {
            handleCreateGoobert();
        }

        // Don't allow number inputs so as to keep ids accurate
        if("0123456789".includes(e.key)) e.preventDefault();
    }

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

                {/* CUSTOMIZATION FRUITS */}
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
                            {/* Display the corresponding fruit from the sprite sheet */}
                            <span
                                className="tree-fruit-sprite"
                                style={{
                                    backgroundPosition:
                                        `${apple.spriteIndex * 20}% 0%`
                                }}
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
                        // Play the Tree room exit sound.
                        treeSound.play();

                        // Return to the Hub.
                        load(rooms.hub);
                    }}
                >
                    <span>BACK TO HUB</span>
                </button>
            </div>

            {/* CREATE GOOBERT */}
            <div className="tree-create-controls">

                <input
                    type="text"
                    className="tree-name-input"
                    placeholder="Name your Goobert"
                    aria-label="Goobert name"
                    maxLength={20}
                    value={GoobertName}
                    onChange={(event) => setGoobertName(event.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* SAVE GOOBERT BUTTON */}
                <button
                    type="button"
                    className="tree-create"
                    title="Save Goobert"
                    aria-label="Save Goobert"
                    onClick={handleCreateGoobert}
                    disabled={!GoobertName.trim()}
                >
                    <span className="tree-save-sprite" />
                </button>

            </div>

            {/* RANDOMIZE ALL FEATURES */}
            <div className="tree-randomize-controls">
                <button
                    type="button"
                    className="tree-randomize"
                    title="Randomize Goobert"
                    aria-label="Randomize Goobert"
                    onClick={rollDice}
                >
                    {/* Display the current dice face from the sprite sheet */}
                    <span
                        className="tree-dice-sprite"
                        style={{
                            backgroundPosition:
                                `${diceFace * 20}% 0%`
                        }}
                    />
                </button>
            </div>

        </main>
    );
}
