
'use strict';

import React, {
    useEffect,
    useRef,
    useState,
    type PointerEvent,
    type Ref
} from "react";

import useGooberts from "./GoobertContext";
import { goobertClickSound } from "./components/audio";
import { rooms } from "./App";

const BODY_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-bodies.png';
const LEG_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-legs.png';
const EYES_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-eyes.png';
const MOUTH_SPRITE_SHEET = 'images/goobert-parts/208-tamagotchi-mouths.png';

const SPRITE_SIZE = 64;
const DOOR_DISTANCE = 20;

type GoobertProps = {
    room: string;
    name: any;
    x: number;
    y: number;
    id: string;
    isUi: boolean;

    bodyType: number;
    bodyColor: number;
    legColor: number;
    legType: number;
    eyeType: number;
    mouthType: number;
    mouthExpression: number;
    eyeExpression: number;

    onGoobertSelected: Function;
    className?: string;
    ref?: Ref<HTMLElement>;
};

export type Goobert = {
    name: string;
    x: number;
    y: number;
    room: string;
    id: string;

    fullness: number;
    dexterity: number;
    awakeness: number;
    cleanliness: number;

    bodyType: number;
    bodyColor: number;
    legType: number;
    legColor: number;
    eyeType: number;
    mouthType: number;
    eyeExpression: number;
    mouthExpression: number;

    eat: Function;
    sleep: Function;
    entertain: Function;
    bathe: Function;

    onGoobertSelected: Function;
};

/*
 * Tracks the Goobert's current position while dragging.
 * Refs store the latest position without waiting for React to rerender.
 * This helps prevent dragging from stopping or jumping unexpectedly.
 */
export default function Goobert(props: GoobertProps): React.JSX.Element {
    const [position, setPosition] = useState({
        x: props.x,
        y: props.y
    });

    const positionRef = useRef(position);
    const draggingRef = useRef(false);
    const movedRef = useRef(false);

    const dragStartRef = useRef({
        pointerX: 0,
        pointerY: 0,
        x: props.x,
        y: props.y
    });

    const { updatePosition, updateRoom, doorRefs } = useGooberts();

    /*
    * Synchronizes the Goobert's displayed position with GoobertContext.
    * This ensures external position updates are reflected on screen...
    * including when a Goobert moves between rooms.
    */
    useEffect(() => {
        const nextPosition = {
            x: props.x,
            y: props.y
        };

        positionRef.current = nextPosition;
        setPosition(nextPosition);
    }, [props.x, props.y]);

    /*
    * Converts the Goobert's position into viewport coordinates.
    * Accounts for the Hub's position and scrolling so collision
    * detection works across desktop and mobile layouts.
    */
    const getGoobertRect = (x: number, y: number) => {
        const hub = document.querySelector(".hub");

        if (!hub) {
            return {
                left: x,
                right: x + SPRITE_SIZE,
                top: y,
                bottom: y + SPRITE_SIZE
            };
        }

        const hubRect = hub.getBoundingClientRect();

        return {
            left: hubRect.left + x - hub.scrollLeft,
            right: hubRect.left + x - hub.scrollLeft + SPRITE_SIZE,
            top: hubRect.top + y - hub.scrollTop,
            bottom: hubRect.top + y - hub.scrollTop + SPRITE_SIZE
        };
    };

    /*
    * Checks whether two rectangular areas overlap.
    * Used to detect collisions with doors and nearby objects.
    */
    const overlaps = (
        a: { left: number; right: number; top: number; bottom: number },
        b: { left: number; right: number; top: number; bottom: number },
        padding = 0
    ): boolean => {
        return (
            a.left < b.right + padding &&
            a.right > b.left - padding &&
            a.top < b.bottom + padding &&
            a.bottom > b.top - padding
        );
    };

    /*
    * Prevents Gooberts from occupying the same space as Hub doors.
    * The tree is excluded so Gooberts can walk in front of it.
    */
    const overlapsDoor = (x: number, y: number): boolean => {
        if (props.room !== rooms.hub) return false;

        const hub = document.querySelector(".hub");
        if (!hub) return false;

        const goobertRect = getGoobertRect(x, y);

        const doors = hub.querySelectorAll(
            "#sleep-door, #game-door, #shop-door, #leave-door, #dungeon-door"
        );

        return Array.from(doors).some(door => {
            return overlaps(
                goobertRect,
                door.getBoundingClientRect()
            );
        });
    };

    /**
    * Updates the Goobert's position while enforcing movement boundaries.
    * Keeps Gooberts within the Hub, prevents door overlap, and restricts
    * desktop movement to the ground area
    * IMPORTANT:
    * Mobile uses different boundaries to support the responsive layout.
    */
    const findNearbyDoor = (x: number, y: number) => {
        const goobertRect = getGoobertRect(x, y);

        const keys = Object.keys(doorRefs) as (keyof typeof doorRefs)[];

        for (const key of keys) {
            const door = doorRefs[key].current;
            if (!door) continue;

            const doorRect = door.getBoundingClientRect();

            if (overlaps(goobertRect, doorRect, DOOR_DISTANCE)) {
                return key;
            }
        }

        return null;
    };

    /*
    * Updates the Goobert's position while enforcing movement boundaries.
    * Keeps Gooberts within the Hub, prevents door overlap, and restricts
    * desktop movement to the ground area.
    *
    * Mobile uses different boundaries to support the responsive layout.
    */
    const move = (newX: number, newY: number) => {
        const hub = document.querySelector(".hub");

        let boundedX = Math.max(0, newX);
        let boundedY = Math.max(0, newY);

        if (props.room === rooms.hub && hub) {
            /*
            * Adjusts Goobert movement boundaries for mobile screens.
            * Mobile uses the visible Hub height instead of its scrollable height
            * to prevent Gooberts from being dragged off-screen.
            * Desktop keeps its original movement boundaries.
            */
            const isMobile = window.innerWidth <= 768;
            const maxX = Math.max(
                0,
                hub.clientWidth - SPRITE_SIZE
            );

            const maxY = Math.max(
                0,
                (isMobile ? hub.clientHeight : hub.scrollHeight) - SPRITE_SIZE
            );

            boundedX = Math.min(boundedX, maxX);
            boundedY = Math.min(boundedY, maxY);

            // Keep Gooberts on the ground on desktop.
            // Mobile uses a different, responsive Hub layout.
            if (window.innerWidth > 768) {
                boundedY = Math.max(
                    Math.min(0, maxY),
                    boundedY
                );
            }

            // Stop before entering a door.
            if (overlapsDoor(boundedX, boundedY)) {
                return;
            }
        }

        const nextPosition = {
            x: boundedX,
            y: boundedY
        };

        positionRef.current = nextPosition;
        setPosition(nextPosition);

        updatePosition(props.id, boundedX, boundedY);
    };

    /*
    * Starts dragging when the player presses a Goobert.
    * Captures pointer events so dragging continues even when the
    * pointer moves outside the Goobert's sprite.
    */
    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (props.isUi) return;

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);

        draggingRef.current = true;
        movedRef.current = false;

        dragStartRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            x: positionRef.current.x,
            y: positionRef.current.y
        };
    };

    /*
    * Calculates movement relative to the original pointer position.
    * Prevents sudden jumps and ignores very small movements so
    * ordinary clicks are not mistaken for dragging.
    */
    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return;

        const start = dragStartRef.current;

        const deltaX = event.clientX - start.pointerX;
        const deltaY = event.clientY - start.pointerY;

        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            // Prevent drags less than 3px from moving goobert
            movedRef.current = true;
        }

        if (!movedRef.current) return;

        move(
            start.x + deltaX,
            start.y + deltaY
        );
    };

    /*
    * Ends dragging when the player releases the Goobert.
    * A normal click opens the Goobert's interaction UI.
    * If dragged near a door, the Goobert transfers to that room.
    */
    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return;

        draggingRef.current = false;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        if (!movedRef.current) {
            console.log(`${props.name} says, "I've been poked!"`);
            // Play the Goobert click sound
            goobertClickSound.play();
            props.onGoobertSelected();
            return;
        }

        // Transfer the Goobert if released near a door.
        const doorKey = findNearbyDoor(
            positionRef.current.x,
            positionRef.current.y
        );

        if (!doorKey) return;

        let roomKey = String(doorKey);

        if (roomKey.includes("Hub")) {
            roomKey = "hub";
        }

        const destination = roomKey as keyof typeof rooms;

        if (!destination) return;

        updateRoom(props.id, rooms[destination]);



        // Spawn the Goobert within the visible destination area.
        const hub = document.querySelector(".hub");

        /*
         * Uses the Hub's dimensions when spawning Gooberts.
         * Prevents Gooberts from spawning outside the mobile display
         * while preserving desktop spawning boundaries.
         */
        const isMobile = window.innerWidth <= 768;

        const width = destination === rooms.hub && hub
            ? hub.clientWidth
            : window.innerWidth;

        const height = destination === rooms.hub && hub
            ? hub.clientHeight
            : window.innerHeight;

        const spawnX = Math.random() *
            Math.max(0, width - SPRITE_SIZE);

        const minY = destination === rooms.hub && !isMobile
            ? Math.min(550, Math.max(0, height - SPRITE_SIZE))
            : 0;

        const spawnY = minY + Math.random() *
            Math.max(0, height - SPRITE_SIZE - minY);

        updatePosition(props.id, spawnX, spawnY);

    };

    
    // Resets dragging if the browser interrupts the pointer interaction.
    const handlePointerCancel = () => {
        draggingRef.current = false;
        movedRef.current = false;
    };

    return (
        <div
            className={`goobert-container ${props.className ?? ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                touchAction: "none"
            }}
        >
            <img
                src={LEG_SPRITE_SHEET}
                draggable={false}
                style={{
                    left: `${props.legColor * -64}px`,
                    top: `${props.legType * -64}px`
                }}
            />

            <img
                src={BODY_SPRITE_SHEET}
                draggable={false}
                style={{
                    left: `${props.bodyColor * -64}px`,
                    top: `${props.bodyType * -64}px`
                }}
            />

            <img
                src={MOUTH_SPRITE_SHEET}
                draggable={false}
                style={{
                    left: `${props.mouthExpression * -64}px`,
                    top: `${props.mouthType * -64}px`
                }}
            />

            <img
                src={EYES_SPRITE_SHEET}
                draggable={false}
                style={{
                    left: `${props.eyeExpression * -64}px`,
                    top: `${props.eyeType * -64}px`
                }}
            />
        </div>
    );
}
