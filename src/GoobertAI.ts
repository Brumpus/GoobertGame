type Point = { x: number; y: number};
type Bounds = { minX: number; maxX: number; minY: number; maxY: number};

// RANDOM SPOT
function randomTarget(bounds: Bounds): Point {
    return {
        x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
        y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY)
    };
}

// CLOSE ENOUGH TO TARGET TO SAY "we're there"?
function arrived(current: Point, target: Point): boolean {
    return Math.hypot(target.x - current.x, target.y - current.y) < 2;
}

// MOVE DISTANCE PIXES FROM CURRENT TARGET
function step(current: Point, target: Point, distance: number): Point {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const total = Math.hypot(dx, dy); // Straight line distance

    if (total <= distance) {
        return target; // CLOSE SENOUGHT TO LAND
    }

    return {
        x: current.x + (dx / total) * distance,
        y: current.y + (dy / total) * distance
    };
}

export { 
    randomTarget,
    arrived,
    step
 };

 export type { Point, Bounds };
