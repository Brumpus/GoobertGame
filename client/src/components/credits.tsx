"use strict";
import React, { type MouseEventHandler } from "react";


/* Credits screen. This is a React screen, not another HTML page. */
type CreditsProps = {
    onHover: MouseEventHandler<HTMLButtonElement>,
    onBack: MouseEventHandler<HTMLButtonElement>
}
export default function Credits(props: CreditsProps) {
    return (
        <section className="credits-screen" aria-label="Gooberts credits">
            {/* Return to the menu without reloading the page. */}
            <button type="button" className="btn btn-credits credits-back menu-button"
                    onMouseEnter={props.onHover} onClick={props.onBack}>
                Back to Menu
            </button>

            {/* The text moves upward automatically, like movie credits. */}
            <div className="credits-window">
                <div className="credits-scroll">
                    <h1>GoobertS</h1>
                    {/* Development team with rainbow colors */}
                    <h2>Development Team</h2>

                    <p style={{ color: "#FF4D6D" }}>Annette</p>
                    <p style={{ color: "#FF922B" }}>Elena</p>
                    <p style={{ color: "#FFD43B" }}>Joseph</p>
                    <p style={{ color: "#51CF66" }}>Katalina</p>
                    <p style={{ color: "#22B8CF" }}>Quinton</p>
                    <p style={{ color: "#4C6EF5" }}>Spencer</p>

                    <h2>Art &amp; Assets</h2>
                    <p>Menu Background — KrycerKris / DeviantArt</p>
                    <p>Sound Effects — Freesound / freesound.org</p>
                    {/* Music credits */}
                    <h2>Music</h2>
                    <p>Title Music — Spencer Elayer</p>
                    <p>Main Theme — Spencer Elayer</p>
                    <p>Game Room — moodmode / pixabay.com</p>
                    <p>Fonts — Pixelify Sans</p>

                    {/* Final message in purple */}
                    <h2 style={{ color: "#BE4BDB" }}>
                        Thanks for playing!
                    </h2>
                </div>
            </div>
        </section>
    );
}
