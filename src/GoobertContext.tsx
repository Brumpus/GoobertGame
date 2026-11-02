import React, { createContext, useContext, useRef, useState, type RefObject } from "react";
import type { Goobert } from "./Goobert";
import { rooms } from "./App";

// How many of each type of asset exist
const MAX_EYE_TYPES = 10;
const MAX_BODY_TYPES = 7;
const MAX_LEG_TYPES = 7;
const MAX_MOUTH_TYPES = 11;
const MAX_COLORS = 7;

interface GoobertContextType {
    gooberts: Goobert[];
    createGoobert: (
        name: string,
        location?: string,
        x?: number,
        y?: number
    ) => void;

    updatePosition: (
        id: string,
        x: number,
        y: number,
    ) => void;
    updateRoom: (
        id: string,
        x: string
    ) => void;


    doorRefs: doorRefs
}
type doorRefs = {
    gameRoom: RefObject<HTMLImageElement | null>,
    bedroom: RefObject<HTMLImageElement | null>,
    shop: RefObject<HTMLImageElement | null>,
    menu: RefObject<HTMLImageElement | null>,
    dungeon: RefObject<HTMLImageElement | null>,

    gameRoomHub: RefObject<HTMLImageElement | null>,
    bedroomHub: RefObject<HTMLImageElement | null>,
    shopHub: RefObject<HTMLImageElement | null>,
    menuHub: RefObject<HTMLDivElement | null>,
    dungeonHub: RefObject<HTMLImageElement | null>,
}
const GoobertContext = createContext<GoobertContextType | null>(null);


export function GoobertProvider({ children }: any) {
    // Allow gooberts to be globally accessible
    const [gooberts, setGooberts] = useState<Goobert[]>([]);
    (window as any).gooberts = gooberts;

    // Allow gooberts to be created from anywhere
    const createGoobert = (
        name: string,
        location?: string,
        x?: number,
        y?: number
    ) => {
        const goobert = renderGoobert(name, location, x, y);
        goobert.id = name + gooberts.length;

        setGooberts(prev => [...prev, goobert]);
    };
    (window as any).createGoobert = createGoobert;

    // Update goobert position
    const updatePosition = (id: string, x: number, y: number) => {
        let newArray = [...gooberts];
        // Update goobert position
        for(let goobert of newArray) {
            if(goobert.id == id) {
                goobert.x = x;
                goobert.y = y;
            }
        }
        // Update gooberts array with new position
        setGooberts(newArray);
    }
    const updateRoom = (id: string, room: string) => {
        let newArray = [...gooberts];
        // Update goobert position
        for(let goobert of newArray) {
            if(goobert.id == id) {
                goobert.room = room;
            }
        }
        // Update gooberts array with new position
        setGooberts(newArray);
    }


    // Keep track of door references globally
    const doorRefs = {
        gameRoom: useRef<HTMLImageElement>(null),
        bedroom: useRef<HTMLImageElement>(null),
        shop: useRef<HTMLImageElement>(null),
        menu: useRef<HTMLImageElement>(null),
        dungeon: useRef<HTMLImageElement>(null),

        gameRoomHub: useRef<HTMLImageElement>(null),
        bedroomHub: useRef<HTMLImageElement>(null),
        shopHub: useRef<HTMLImageElement>(null),
        menuHub: useRef<HTMLDivElement>(null),
        dungeonHub: useRef<HTMLImageElement>(null)
    }

    // Render goobert context provider
    return (
        <GoobertContext.Provider value={{gooberts, createGoobert, updatePosition, updateRoom, doorRefs}}>
            {children}
        </GoobertContext.Provider>
    )
}

export function renderGoobert(
	name: string,
	location = rooms.hub,
	x = (Math.random() * (window.innerWidth - 64) /* world width */),
	y = ((Math.random() * (window.innerHeight - 550 - 64) /* world height */)) + 550,
    isUi = false
) {
	let goobert = {
        name: name,
        x: x,
        y: y,
        room: location,
        id: name,
        isUi: isUi,
        className: "",

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

        eat(amt = 10) { this.fullness += amt },
        sleep() { this.awakeness = 100 },
        entertain(quality: number) { this.swagosity += quality },
        bathe(amt: number) { this.cleanliness += amt },

        onGoobertSelected: (goobert: Goobert) => {
            // Setup by TopElement
        }
    }

    return goobert;
}

export default function useGooberts() {
  const context = useContext(GoobertContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}