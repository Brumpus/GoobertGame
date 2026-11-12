import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type RefObject } from "react";
import type { Goobert } from "./Goobert";
import { rooms } from "./App";
import { createMutant, MutantType, type Mutant } from "./Mutant";
import { getState, loadGoobert } from "./saveLoadGoobert";

export type GoobertAppearance = {
    bodyType: number;
    bodyColor: number;
    legType: number;
    legColor: number;
    eyeType: number;
    mouthType: number;
};
export type GoobertStats = {
    fullness: number;
    dexterity: number;
    awakeness: number;
    cleanliness: number;
}

// How many of each type of asset exist
const MAX_EYE_TYPES = 10;
const MAX_BODY_TYPES = 7;
const MAX_LEG_TYPES = 7;
const MAX_MOUTH_TYPES = 11;
const MAX_COLORS = 7;

interface GoobertContextType {
    gooberts: Goobert[];
    mutants: Mutant[];
    deadGooberts: Goobert[];

    // Stats that minigames and rooms are allowed to update.
    updateStat: (
        id: string,
        stat: "fullness" | "awakeness" | "cleanliness" | "dexterity",
        amount: number
    ) => void;

    createGoobert: (
        name: string,
        location?: string,
        x?: number,
        y?: number,
        appearance?: GoobertAppearance,
        stats?: GoobertStats
    ) => void;

    loadSlot: (saveSlot: string) => void
    newGame: () => void

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

declare global{
    interface window{
        kill: (id: string) => void;
    }
}

export function GoobertProvider({ children }: any) {
    // Allow gooberts to be globally accessible
    const [gooberts, setGooberts] = useState<Goobert[]>([]);
    (window as any).gooberts = gooberts;

    const [mutants, setMutants] = useState<Mutant[]>([]);
    (window as any).mutants = mutants;

    const [deadGooberts, killGooberts] = useState<Goobert[]>([]);
    (window as any).deadGooberts = deadGooberts;

    // ==== CENTRALIZED Goobert STAT UPDATES ====

    // Update a specific Goobert's stat through React state.
    // Positive amounts restore stats; negative amounts decrease them.
    // useCallback prevents the function from being recreated on every render.
    const updateStat = useCallback((
        id: string,
        stat: "fullness" | "awakeness" | "cleanliness" | "dexterity",
        amount: number
    ) => {
        setGooberts(previous =>
            previous.map(goobert => {
                if (goobert.id !== id) {
                    return goobert;
                }

                return {
                    ...goobert,
                    [stat]: Math.min(
                        100,
                        Math.max(0, goobert[stat] + amount)
                    )
                };
            })
        );
    }, []);

    // ==== AUTOMATIC Goobert STAT DEPLETION ====

    // Decrease stats every 5 seconds for testing.
    useEffect(() => {
        const interval = window.setInterval(() => {

            // Update gooberts to reduce stats, then convert things to mutants
            setGooberts((previous) => {
                const updatedGooberts = previous.map(goobert => ({
                    ...goobert,
                    fullness: Math.max(0, goobert.fullness - 1),
                    awakeness: Math.max(0, goobert.awakeness - 1),
                    cleanliness: Math.max(0, goobert.cleanliness - 1),
                    dexterity: Math.max(0, goobert.dexterity - 1)
                }))

                // Loop through each goobert
                let list = [...updatedGooberts];

                // Filter keys for ones that are <= 0
                const keys = ["fullness", "awakeness", "cleanliness", "dexterity"] as const;
                for(let goobert of list) {
                    // Turn to mutant if a stat is <= 0 and the goobert is not in the shadow realm
                    let mutateStats = keys.filter((key) => goobert[key] <= 0 && goobert.room != "shadow-realm");

                    if(mutateStats.length > 0) {
                        // Goobert has stat <= 0; make it a mutant
                        let type: MutantType;
                        switch (mutateStats[0]) {
                            case "fullness":
                                type = MutantType.HUNGRY;
                                break;
                            case "awakeness":
                                type = MutantType.SLEEPLESS;
                                break;
                            case "cleanliness":
                                type = MutantType.DIRTY;
                                break;
                            case "dexterity":
                                type = MutantType.BORED;
                                break;
                            default:
                                type = MutantType.HUNGRY;       
                        }
                        let room = goobert.room;
                        setMutants(prev => [...prev, createMutant(goobert.x + "px", goobert.y + "px", room, type, goobert.id)]);
                        goobert.room = "shadow-realm";
                    }
                }

                // set gooberts to updated list after reducing stats and converting to mutants
                return (list);
            });
        }, 10000);

        return () => window.clearInterval(interval);
    }, []);

    // Allow gooberts to be created from anywhere
    const createGoobert = (
        name: string,
        location?: string,
        x?: number,
        y?: number,
        appearance?: GoobertAppearance,
        stats?: GoobertStats
    ) => {
        const goobert = renderGoobert(name, location, x, y);

        if (appearance) {
            Object.assign(goobert, appearance);
        }
        if (stats) {
            Object.assign(goobert, stats);
        }

        goobert.id = name + gooberts.length;

        setGooberts(prev => [...prev, goobert]);
    };
    (window as any).createGoobert = createGoobert;
    // Get saved goobert from local storage and render it to the screen
    const createSavedGoobert = async (goobertId: string) => {
        let goobert = await loadGoobert(goobertId);
        if(!goobert) return;

        const stats: GoobertStats = {...goobert};
        const appearance: GoobertAppearance = {...goobert};

        createGoobert(goobert.name, goobert.room, undefined, undefined, appearance, stats);
    }
    (window as any).loadGoobert = createSavedGoobert;
    /**
     * Load a save slot. The exact location of the saved storage is determined by getState
     * But the data rendering is handled by this function.
    */
    const loadSlot = async (saveSlot: string) => {
        let data = await getState(saveSlot);
        if(!data) return;

        let newGooberts = data.map(goobert => {
            let newGoobert: Goobert = renderGoobert(goobert.name, goobert.room);
            // Populate saved properties
            Object.assign(newGoobert, {...goobert});
            // Randomize Position
            newGoobert.x = Math.floor(Math.random() * window.innerWidth);
            newGoobert.y = Math.floor(Math.random() * window.innerHeight)

            return newGoobert;
        });
        
        setGooberts(newGooberts);
    }
    (window as any).loadSlot = loadSlot;

    const newGame = () => {
        setGooberts([]);
    }

    //KILL GOOBERTS DEAD!!!!!
    

    (window as any).kill = (id: string) => {
        let newArray = [...gooberts];
        //find the goobert in the living gooberts array
        for(let i = 0; i <= newArray.length; i++) {
            let deadGoobert = (newArray[i] as Goobert);
            if(deadGoobert!.id == id) {
                killGooberts([...deadGooberts, deadGoobert])
                newArray.splice(i, 1);
                break;
            }
        }
        setGooberts(newArray)
        //print so I know it's really dead
        console.log(deadGooberts);
    }


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
        <GoobertContext.Provider value={{
            gooberts, mutants, deadGooberts,
            
            createGoobert, updatePosition, updateRoom, updateStat, 
            loadSlot, newGame,
            
            doorRefs}}>
            {children}
        </GoobertContext.Provider>
    )
}

export function renderGoobert(
	name: string,
	location = rooms.hub,
	x = (Math.random() * (window.innerWidth - 64) /* world width */),
	y = ((Math.random() * (window.innerHeight - 550 - 64) /* world height */)) + 550,
    isUi = false,
) {
	let goobert = {
        name: name,
        x: x,
        y: y,
        room: location,
        id: name,
        isUi: isUi,
        className: "",

        // Initialize stats with a random number between 30 and 70
        fullness: 30 + Math.floor(Math.random() * 41), // Eating, catch the food game
        dexterity: 30 + Math.floor(Math.random() * 41), // Exercise, Snake & Frogoobert
        awakeness: 30 + Math.floor(Math.random() * 41), // Sleeping
        cleanliness: 30 + Math.floor(Math.random() * 41), // Bathing, Flappy Goobert

        bodyType: Math.floor(Math.random() * MAX_BODY_TYPES),
        bodyColor: Math.floor(Math.random() * MAX_COLORS),
        legType: Math.floor(Math.random() * MAX_LEG_TYPES),
        legColor: Math.floor(Math.random() * MAX_COLORS),
        eyeType: Math.floor(Math.random() * MAX_EYE_TYPES),
        mouthType: Math.floor(Math.random() * MAX_MOUTH_TYPES),
        eyeExpression: 0,
        mouthExpression: 0,

        // Restore Goobert needs without exceeding 100.
        eat(amt = 10) {
            this.fullness = Math.min(100, this.fullness + amt);
        },

        sleep() {
            this.awakeness = 100;
        },

        // Dexterity is earned through minigames.
        entertain(quality: number) {
            this.dexterity = Math.min(100, this.dexterity + quality);
        },

        bathe(amt: number) {
            this.cleanliness = Math.min(100, this.cleanliness + amt);
        },

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
