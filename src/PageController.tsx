import React from "react";
import { Route, Routes } from "react-router";
import { rooms } from "./App";
import MainMenu from "./components";
import Hub from "./components/hub";
import Tree from "./components/tree";
import Shop from "./components/shop";
import GameRoom from "./components/game-room";
import Bedroom from "./components/bedroom";
import Dungeon from "./components/dungeon";
import FlappyGoobert from "./components/flappy-goobert";
import SnakeGame from "./components/snake";
import Frogoobert from "./components/frogoobert";
import Pipelined from "./components/PipeGame/pipelined";
import FeastFest from "./components/feast-fest";

const PageController = () => { 
    return (
        <Routes>
            <Route path="" element={<MainMenu />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/game-room" element={<GameRoom />} />
            <Route path="/games" element={<GameRoom />} />
            <Route path="/bedroom" element={<Bedroom />} />
            <Route path="/dungeon" element={<Dungeon />} />
            
            <Route path="/games/flappy-goobert" element={<FlappyGoobert />} />
            <Route path="/games/snake" element={<SnakeGame />} />
            
            <Route path="/games/pipelined" element={<Pipelined />} />
            <Route path="/games/frogoobert" element={<Frogoobert />} />
            <Route path="/games/feast-fest" element={<FeastFest />} />

            {/* Default: main menu */}
            <Route path="*" element={<MainMenu />} />
        </Routes>
    );
}
export default PageController;