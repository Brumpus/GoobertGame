import React from "react";
import { Route, Routes } from "react-router";
import { rooms } from "./App";
import MainMenu from "./components";
import Hub from "./components/hub";
import Shop from "./components/shop";
import GameRoom from "./components/game-room";
import Bedroom from "./components/bedroom";
import Dungeon from "./components/dungeon";
import FlappyGoobert from "./components/flappy-goobert";
import SnakeGame from "./components/snake";

const PageController = () => { 
    return (
        <Routes>
            <Route path="" element={<MainMenu />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/game-room" element={<GameRoom />} />
            <Route path="/bedroom" element={<Bedroom />} />
            <Route path="/dungeon" element={<Dungeon />} />

            <Route path="/flappy-goobert" element={<FlappyGoobert />} />
            <Route path="/snake" element={<SnakeGame />} />

            {/* Default: main menu */}
            <Route path="*" element={rooms.menu} />
        </Routes>
    );
}
export default PageController;