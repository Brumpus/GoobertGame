"use strict";

import React, { useEffect, useState } from "react";
import { load, rooms } from "../App";
import { useSearchParams } from "react-router";
import "../styles/dressing-room.css";
import useGooberts from "../GoobertContext";
import GoobertElement from "../Goobert";

// Number of accessory types and styles in each sprite sheet.
const ACCESSORY_LIMITS = {
    HEADWEAR: { types: 11, styles: 8 },
    FACEWEAR: { types: 15, styles: 5 },
    ACCESSORIES: { types: 15, styles: 5 }
};

export default function DressingRoom() {
useSearchParams
    const { gooberts, updateAccessories } = useGooberts();
    const [searchParams] = useSearchParams();

    // Get the selected Goobert and accessory category.
    const selectedId = searchParams.get("id");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Track the accessory currently being previewed.
    const [previewAccessories, setPreviewAccessories] = useState({
        hatType: 0,
        hatStyle: 0,
        maskType: 0,
        maskStyle: 0,
        extraType: 0,
        extraStyle: 0
    });

    // Find the selected Goobert.
    const selectedGoobert = gooberts.find(
        (goobert) => String(goobert.id) === selectedId
    );

    // Load the selected Goobert's existing accessories into the preview.
    useEffect(() => {
        if (!selectedGoobert) return;

        setPreviewAccessories({
            hatType: selectedGoobert.hatType ?? 0,
            hatStyle: selectedGoobert.hatStyle ?? 0,
            maskType: selectedGoobert.maskType ?? 0,
            maskStyle: selectedGoobert.maskStyle ?? 0,
            extraType: selectedGoobert.extraType ?? 0,
            extraStyle: selectedGoobert.extraStyle ?? 0
        });
    }, [selectedId]);

    // Change the accessory type for the selected category.
    const changeType = (direction: number) => {
        if (!selectedCategory) return;

        const category = selectedCategory as keyof typeof ACCESSORY_LIMITS;
        const maxTypes = ACCESSORY_LIMITS[category].types;

        const typeKey = (
            category === "HEADWEAR" ? "hatType" :
            category === "FACEWEAR" ? "maskType" :
            "extraType"
        ) as "hatType" | "maskType" | "extraType";

        setPreviewAccessories((previous) => ({
            ...previous,
            [typeKey]: (previous[typeKey] + direction + maxTypes) % maxTypes
        }));
    };

    // ADD THIS NEW FUNCTION HERE
    const changeStyle = (direction: number) => {
        if (!selectedCategory) return;

        const category = selectedCategory as keyof typeof ACCESSORY_LIMITS;
        const maxStyles = ACCESSORY_LIMITS[category].styles;

        const styleKey = (
            category === "HEADWEAR" ? "hatStyle" :
            category === "FACEWEAR" ? "maskStyle" :
            "extraStyle"
        ) as "hatStyle" | "maskStyle" | "extraStyle";

        setPreviewAccessories((previous) => ({
            ...previous,
            [styleKey]: (previous[styleKey] + direction + maxStyles) % maxStyles
        }));
    };

    // YOUR EXISTING RETURN STAYS HERE
    return (
        <main id="main" className="dressing-room">

            <h1>{selectedCategory || "Dressing Room"}</h1>

            {/* DISPLAY THE SELECTED GOOBERT */}
            <div className="dressing-goobert">
                {selectedGoobert && (
                    <GoobertElement
                        {...selectedGoobert}
                        {...previewAccessories}
                        isUi={true}
                        styleGoobert={true}
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

                <button
                    type="button"
                    onClick={() => {
                        if (!selectedGoobert) return;

                        updateAccessories(selectedGoobert.id, previewAccessories);
                    }}
                >
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
                    <button
                        type="button"
                        onClick={() => changeType(-1)}
                    >
                        ◀
                    </button>

                    <span>TYPE</span>

                    <button
                        type="button"
                        onClick={() => changeType(1)}
                    >
                        ▶
                    </button>
                </div>

                <div className="dressing-option">
                    <button
                        type="button"
                        onClick={() => changeStyle(-1)}
                    >
                        ◀
                    </button>

                    <span>STYLE</span>

                    <button
                        type="button"
                        onClick={() => changeStyle(1)}
                    >
                        ▶
                    </button>
                </div>
            </div>

        </main>
    );
}