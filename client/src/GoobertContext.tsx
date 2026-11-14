import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type RefObject } from "react";
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
    cureGoobert: (id: string) => void;
    summonGoobertsToHub: () => void;

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

    loadSlot: (saveSlot: number) => void
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

/*=====MUTATION TYPES=====*/

function getMutationType(goobert: Goobert): MutantType {
    if (goobert.fullness <= 0) return MutantType.HUNGRY;
    if (goobert.awakeness <= 0) return MutantType.SLEEPLESS;
    if (goobert.cleanliness <= 0) return MutantType.DIRTY;
    if (goobert.dexterity <= 0) return MutantType.BORED;

    // Saved shadow-realm Gooberts without a zero stat still need a sprite.
    return MutantType.HUNGRY;
}

export function GoobertProvider({ children }: any) {
    // Allow gooberts to be globally accessible
    const [gooberts, setGooberts] = useState<Goobert[]>([]);
    (window as any).gooberts = gooberts;

    /*=====MUTANTS FROM GOOBERT STATE=====*/

    // A shadow-realm Goobert is a mutant. Deriving this list from Gooberts
    // keeps mutation records consistent after a server save slot is loaded.
    const mutants = useMemo<Mutant[]>(() => {
        return gooberts
            .filter(goobert => goobert.room === "shadow-realm")
            .map(goobert => createMutant(
                `${goobert.x}px`,
                `${goobert.y}px`,
                rooms.dungeon,
                getMutationType(goobert),
                goobert.id
            ));
    }, [gooberts]);

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

    /*=====AUTOMATIC STAT DEPLETION AND MUTATION=====*/

    // Maintain the upstream ten-second stat depletion interval.
    // Mutated Gooberts do not lose additional stats while imprisoned.
    useEffect(() => {
        const interval = window.setInterval(() => {
            setGooberts(previous => previous.map(goobert => {
                if (goobert.room === "shadow-realm") {
                    return goobert;
                }

                const updated = {
                    ...goobert,
                    fullness: Math.max(0, goobert.fullness - 1),
                    awakeness: Math.max(0, goobert.awakeness - 1),
                    cleanliness: Math.max(0, goobert.cleanliness - 1),
                    dexterity: Math.max(0, goobert.dexterity - 1)
                };

                const depleted = (
                    updated.fullness <= 0 ||
                    updated.awakeness <= 0 ||
                    updated.cleanliness <= 0 ||
                    updated.dexterity <= 0
                );

                return depleted
                    ? { ...updated, room: "shadow-realm" }
                    : updated;
            }));
        }, 10000);

        return () => window.clearInterval(interval);
    }, []);

    /*=====DUNGEON DASH RESCUE=====*/

    const cureGoobert = useCallback((id: string) => {
        setGooberts(previous => previous.map(goobert => {
            if (goobert.id !== id || goobert.room !== "shadow-realm") {
                return goobert;
            }

            return {
                ...goobert,
                room: rooms.hub,
                x: 100 + Math.random() * 180,
                y: 450,
                fullness: Math.max(50, goobert.fullness),
                awakeness: Math.max(50, goobert.awakeness),
                cleanliness: Math.max(50, goobert.cleanliness),
                dexterity: Math.max(50, goobert.dexterity)
            };
        }));
    }, []);

    /*=====HUB SUMMONING BELL=====*/

    const summonGoobertsToHub = useCallback(() => {
        const hub = document.querySelector<HTMLElement>(".hub");
        const width = hub?.clientWidth ?? window.innerWidth;
        const height = hub?.clientHeight ?? window.innerHeight;

        setGooberts(previous => {
            const available = previous.filter(goobert =>
                goobert.room !== "shadow-realm"
            );

            const columns = Math.max(1, Math.min(8, Math.floor((width - 24) / 76)));
            const positions = new Map<string, { x: number; y: number }>();

            available.forEach((goobert, index) => {
                const row = Math.floor(index / columns);
                const column = index % columns;
                const countInRow = Math.min(columns, available.length - row * columns);
                const spacing = Math.min(76, Math.max(66, (width - 24) / countInRow));
                const rowWidth = countInRow * spacing;

                positions.set(goobert.id, {
                    x: Math.max(0, Math.min(
                        width - 64,
                        (width - rowWidth) / 2 + column * spacing + (spacing - 64) / 2
                    )),
                    y: Math.max(0, height - 95 - row * 72)
                });
            });

            return previous.map(goobert => {
                const position = positions.get(goobert.id);
                return position
                    ? { ...goobert, room: rooms.hub, ...position }
                    : goobert;
            });
        });
    }, []);

    /*=====LOCAL DUNGEON DASH TESTING=====*/

    useEffect(() => {
        if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
            return;
        }

        (window as any).testDungeonMutation = () => {
            setGooberts(previous => {
                const candidate = previous.find(goobert =>
                    goobert.room !== "shadow-realm"
                );

                if (!candidate) {
                    console.warn("Create or load a Goobert before testing a mutation.");
                    return previous;
                }

                console.log(`${candidate.name} has mutated and can be rescued in the Dungeon.`);

                return previous.map(goobert => goobert.id === candidate.id
                    ? { ...goobert, room: "shadow-realm", fullness: 0 }
                    : goobert
                );
            });
        };

        return () => {
            delete (window as any).testDungeonMutation;
        };
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
    const loadSlot = async (saveSlot: number) => {
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
        killGooberts([]);
    }
    (window as any).loadSlot = loadSlot;

    const newGame = () => {
        setGooberts([]);
        killGooberts([]);
    }

    //KILL GOOBERTS DEAD!!!!!
    

    (window as any).kill = (id: string) => {
        let newArray = [...gooberts];
        //find the goobert in the living gooberts array
        for(let i = 0; i < newArray.length; i++) {
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
            cureGoobert, summonGoobertsToHub,
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
