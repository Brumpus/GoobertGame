"use strict";
import "./styles/ui.css";

import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';

import GoobertElement from "./Goobert";
import Hub from "./components/hub";
import Shop from "./components/shop";
import GameRoom from "./components/game-room";
import Bedroom from "./components/bedroom";
import Dungeon from "./components/dungeon";

import UIGoobertCard from "./components/ui-script";

import SnakeGame from "./components/snake";
import FlappyGoobert from "./components/flappy-goobert";
import PipeGame from "./components/pipeGame";

// How many of each type of asset exist
const MAX_EYE_TYPES = 10;
const MAX_BODY_TYPES = 7;
const MAX_LEG_TYPES = 7;
const MAX_MOUTH_TYPES = 11;
const MAX_COLORS = 7;

export let gooberts: Goobert[] = [];

export type Room = {
	room: React.JSX.Element
}
export const rooms = {
	hub: <Hub />,
	gameRoom: <GameRoom />,
	shop: <Shop />,
	bedroom: <Bedroom />,
	dungeon: <Dungeon />,

	snakeGame: <SnakeGame />,
	flappyGoobert: <FlappyGoobert />,
	pipeGame: <PipeGame />

}


type TopElementProps = {
	room: React.JSX.Element,
	uiGoobert?: Goobert
}
const TopElement = (props: TopElementProps): React.JSX.Element => {
	const [room, setRoom] = useState(props.room);
	const [uiGoobert, setUiGoobert] = useState(props.uiGoobert);
	const [goobertList, setGoobertList] = useState(gooberts);

	useEffect(() => {
		// Define the load function to load a room and re-render the page
		load = (component: React.JSX.Element) => {
			setRoom(component);
		}
	});
	useEffect(() => {
		// Define the load function to create a goobert and re-render the page
		renderGoobert = (goobert: Goobert) => {
			goobertList.push(goobert);
			gooberts = goobertList; // Make gooberts public globally
			setGoobertList(goobertList);
		}

		// Allow developer to create a goobert from console
		(window as any).createGoobert = (
			name: string,
			room: React.JSX.Element = rooms.hub
		) => renderGoobert(createGoobert(name, room)); 
	});

	
	return (
		<>
			{/* Display the currently selected room (Hub, Bedroom, etc...) */}
			{room}

			{
				// Filter gooberts to only display the ones on the current room
				gooberts.filter((goobert, i) => {
					return goobert.room == room
				}).map((goobert, i) => {
					// Create a goobert for each object stored in this room
					return (
						<GoobertElement
							className=""
							key={goobert.id}
							{...goobert}
							onGoobertSelected={
								() => {
									setUiGoobert(goobert);
								}
							} 
						/>
					);
				})
			}

			{
				uiGoobert && uiGoobert.room === room && <UIGoobertCard goobert={uiGoobert} />
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
		<TopElement room={rooms.hub} />
	);
}

init();


// Implemented by TopElement, loads a room defined within the rooms variable
type Load = ((component: React.JSX.Element) => void);
export let load: Load;

export function createGoobert(
	name: string, 
	location = rooms.hub, 
	x = (Math.random() * (window.innerWidth - 64) /* goobert width */), 
	y = ((Math.random() * (window.innerHeight - 550 - 64) /* goobert height */)) + 550
) 
{
	return (
		{
			name: name, 
			x:x, 
			y:y, 
			room:location, 
			id: name + gooberts.length,

			fullness: 0, // Eating, catch the food game
			swagosity: 50, // Boredom, Snake
			awakeness: 50, // Sleeping
			cleanliness: 50, // Bathing, Flappy Goobert
		
			bodyType: Math.floor(Math.random() * MAX_BODY_TYPES),
			bodyColor: Math.floor(Math.random() * MAX_COLORS),
			legType: Math.floor(Math.random() * MAX_LEG_TYPES),
			legColor: Math.floor(Math.random() * MAX_COLORS),
			eyeType: Math.floor(Math.random() * MAX_EYE_TYPES),
			mouthType: Math.floor(Math.random() * MAX_MOUTH_TYPES),
			eyeExpression: 0,
			mouthExpression: 0,

			eat(amt = 10) {this.fullness += amt},
			sleep() {this.awakeness = 100},
			entertain(quality: number) {this.swagosity += quality},
			bathe(amt: number) {this.cleanliness += amt},

			onGoobertSelected: (goobert: Goobert) => {
				console.log(goobert.name + " says, \"I've been poked!\"");
			}
		}
	);
}
export type Goobert = {
	name: string, 
	x: string, 
	y: string, 
	room: React.JSX.Element, 
	id: string,

	fullness: number, // Eating, catch the food game
	swagosity: number, // Boredom, Snake
	awakeness: number, // Sleeping
	cleanliness: number, // Bathing, Flappy Goobert

	bodyType: number,
	bodyColor: number,
	legType: number,
	legColor: number,
	eyeType: number,
	mouthType: number,
	eyeExpression: number,
	mouthExpression: number,

	eat: Function,
	sleep: Function,
	entertain: Function,
	bathe: Function,

	onGoobertSelected: Function

} 
// Defined within TopElement, takes a goobert and adds it to the list 
// used to render TopElement gooberts
type RenderGoobert = ((goobert: Goobert) => void);
export let renderGoobert: Function;

// Make variables accessible to console
(window as any).rooms = rooms;
(window as any).gooberts = gooberts;
