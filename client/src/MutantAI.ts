import type { Goobert } from "./Goobert";
import { MutantType } from "./Mutant";

export function findGoobert (
    gooberts: Goobert[], mutantId: string, room: string): Goobert[] {
        return gooberts.filter(goobert => 
            goobert.id !== mutantId && // Prevents mutant from selecting itself
            !goobert.isMutant && // Only targets normal Gooberts not mutants
            goobert.room === room // Stops mutants from chasing Gooberts in other rooms
        );
}

export function chooseGoobert(targets: Goobert[]): Goobert | null {
    if (targets.length === 0) {
        return null;
    }

    const index = Math.floor(Math.random() * targets.length);

    return targets[index] ?? null;
}

export function getMutantSpeed(type: MutantType): number {
    switch (type) {
        case MutantType.HUNGRY:
            return 6;

        case MutantType.SLEEPLESS:
            return 5;
        
        case MutantType.DIRTY:
            return 3;
        
        case MutantType.BORED:
            return 0;
    
        default:
            return 0;
    }
}

export function catchGoobert(
    mutantX: number, 
    mutantY: number, 
    goobertX: number,
    goobertY: number 
): boolean {
    const distanceX = mutantX - goobertX;
    const distanceY = mutantY - goobertY;

    const distance = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY
    );

    return distance < 40;
}