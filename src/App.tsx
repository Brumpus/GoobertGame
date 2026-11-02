"use strict";
import "./styles/ui.css";

import React, { useState } from "react";
import { createRoot } from 'react-dom/client';

import GoobertElement, { type Goobert } from "./Goobert";

import UIGoobertCard from "./components/ui-script";

import { BrowserRouter, useNavigate } from "react-router";
import PageController from "./PageController";
import useGooberts, { GoobertProvider } from "./GoobertContext";

export type Room = {
	room: React.JSX.Element
}
export const rooms = {
	menu: "",

	hub: "/hub",
	gameRoom: "/game-room",
	shop: "/shop",
	bedroom: "/bedroom",
	dungeon: "/dungeon",

	snakeGame: "/snake",
	flappyGoobert: "/flappy-goobert"

}


type TopElementProps = {
	room: string,
	uiGoobert?: Goobert
}
const TopElement = (props: TopElementProps): React.JSX.Element => {
	let gooberts = useGooberts().gooberts;
	const [room, setRoom] = useState(props.room);
	const [uiGoobert, setUiGoobert] = useState(props.uiGoobert);

	const handleUiCloseButton = () => {
		setUiGoobert(undefined);
	}

	// Define the load function to load a room and re-render the page
	const navigate = useNavigate();
	load = (url: string) => {
		navigate(url);
		setRoom(url); // Let gooberts know which room they're on
	}

	return (
		<>
			{/* Display the currently selected room (Hub, Bedroom, etc...) */}
			<PageController />

			<div id="gooberts">
				{
					// Filter gooberts to only display the ones on the current room
					gooberts.filter((goobert, i) => {
						return goobert.room === room
					}).map((goobert, i) => {
						// Create a goobert for each object stored in this room
						return (
							<GoobertElement
								key={goobert.id}
								{...goobert}
								isUi={false}
								onGoobertSelected={
									() => {
										setUiGoobert(goobert as unknown as Goobert);
									}
								}
							/>
						);
					})
				}
			</div>

			{
				// A goobert card will be rendered if a ui goobert exists and if it is in the current room
				uiGoobert && uiGoobert.room === room &&
				<UIGoobertCard goobert={uiGoobert} onUiClose={handleUiCloseButton} />
			}
		</>
	);
}

let topElement;
const root = createRoot(
	document.getElementById("content")!
);
function init() {
	topElement = React.createRef();
	root.render(
		<GoobertProvider>
			<BrowserRouter>
				<TopElement room={new URL(window.location.href).pathname} />
			</BrowserRouter>
		</GoobertProvider>
	);
}

init();


// Implemented by TopElement, loads a room defined within the rooms variable
type Load = ((component: string) => void);
export let load: Load;

// Make variables accessible to console
(window as any).rooms = rooms;
