"use strict";

let rooms = {
	hub: React.createElement(Hub),
	// gameRoom: new GameRoom(),
	shop: React.createElement(Shop),
	bedroom: React.createElement(Bedroom),

	snakeGame: React.createElement(SnakeGame),
	flappyGoobert: React.createElement(FlappyGoobert)

}
let topElement;
const root = ReactDOM.createRoot(document.body); 
function loadHub() {
    topElement = React.createElement(Hub);
	console.log(topElement);
	root.render(topElement);
}
loadHub();

function load(component) {
	topElement = rooms[component];
	root.render(topElement);
}