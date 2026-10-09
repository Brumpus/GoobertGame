"use strict"

class Hub extends React.Component {
    render() {
        return (
            <main className="background">
                <div className="tree-container">

                    <img src="hub-images/gooberts_tree.png" 
                        alt="GOOBERTS HUB" 
                        className="pixelated-tree" 
                        id="goobert-tree" />

                    {/* <!--CLickable Areas--> */}
                    <div id="tree-body-area"></div>
                    <div id="tree-legs-area"></div>
                    <div id="tree-mouth-area"></div>
                    <div id="tree-eyes-area"></div>
                    <div id="tree-body-color"></div>
                    <div id="tree-legs-color"></div>


                    {/* <!--Goobert Container--> */}
                    <div className="goobert-container">
                        <img id="goobert-legs" src="assets/goobert-parts/Transparent-BG.png"/>
                        <img id="goobert-body" src="assets/goobert-parts/Transparent-BG.png"/>
                        <img id="goobert-mouth" src="assets/goobert-parts/Transparent-BG.png"/>
                        <img id="goobert-eyes" src="assets/goobert-parts/Transparent-BG.png"/>
                    </div> 
                </div>

                <div className="sleep-door-container">
                    <img src="index-images/DreamDoor.webp" alt="BEDROOM" id="sleep-door" onClick={() => {load("bedroom")}} />
                </div>

                <div className="game-door-container">
                    <img src="hub-images/game-door.png" alt="GAME" id="game-door" onClick={() => {load("gameroom")}} />
                </div>

                <div className="shop-door-container">
                    <img src="hub-images/shop-door.png" alt="SHOP" id="shop-door" onClick={() => {load("shop")}} />
                </div>

                <div className="leave-door-container">
                    <img src="hub-images/leave-door.png" alt="LEAVE" id="leave-door" />
                </div>
            </main>
        );
    }
}