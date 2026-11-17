"use strict";

import React, { useState } from "react";
import { load, rooms } from "../App";
import { useSearchParams } from "react-router";
import "../styles/dressing-room.css";
import useGooberts from "../GoobertContext";
import GoobertElement from "../Goobert";

export default function DressingRoom() {

    const { gooberts } = useGooberts();
    const [searchParams] = useSearchParams();

    // Get the selected Goobert and accessory category.
    const selectedId = searchParams.get("id");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Find the selected Goobert.
    const selectedGoobert = gooberts.find(
        (goobert) => String(goobert.id) === selectedId
    );

    return (
        <main id="main" className="dressing-room">

            <h1>{selectedCategory || "Dressing Room"}</h1>

            {/* DISPLAY THE SELECTED GOOBERT */}
            <div className="dressing-goobert">
                {selectedGoobert && (
                    <GoobertElement
                        {...selectedGoobert}
                        isUi={true}
                        x={0}
                        y={0}
                    />
                )}
            </div>

            {/* DRESSING ROOM CONTROLS */}
            <div className="dressing-controls">

                <button onClick={() => load(rooms.shop)}>
                    BACK
                </button>

                <button type="button">
                    SAVE
                </button>

            </div>

            {/* ACCESSORY CATEGORY BUTTONS */}
            <div className="dressing-categories">
                <button
                    className={`headwear-button ${selectedCategory === "HEADWEAR" ? "selected" : ""}`}
                    onClick={() => setSelectedCategory("HEADWEAR")}
                >
                    HEADWEAR
                </button>

                <button
                    className={`facewear-button ${selectedCategory === "FACEWEAR" ? "selected" : ""}`}
                    onClick={() => setSelectedCategory("FACEWEAR")}
                >
                    FACEWEAR
                </button>

                <button
                    className={`accessory-button ${selectedCategory === "ACCESSORIES" ? "selected" : ""}`}
                    onClick={() => setSelectedCategory("ACCESSORIES")}
                >
                    ACCESSORIES
                </button>
            </div>

            {/* ACCESSORY TYPE AND STYLE CONTROLS */}
            <div className="dressing-options">
                <div className="dressing-option">
                    <button type="button">◀</button>
                    <span>TYPE</span>
                    <button type="button">▶</button>
                </div>

                <div className="dressing-option">
                    <button type="button">◀</button>
                    <span>STYLE</span>
                    <button type="button">▶</button>
                </div>
            </div>

        </main>
    );
}