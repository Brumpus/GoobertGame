import React, { createContext, useContext, useEffect, useState } from "react";
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
}

const GoobertContext = createContext<GoobertContextType | null>(null);


export function GoobertProvider({ children }: any) {
    const [gooberts, setGooberts] = useState<Goobert[]>([]);
    (window as any).gooberts = gooberts;

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

    return (
        <GoobertContext.Provider value={{gooberts, createGoobert, updatePosition}}>
            {children}
        </GoobertContext.Provider>
    )
}

export function renderGoobert(
	name: string,
	location = rooms.hub,
	x = (Math.random() * (window.innerWidth - 64) /* goobert width */),
	y = ((Math.random() * (window.innerHeight - 550 - 64) /* goobert height */)) + 550,
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