let rooms = {
	hub: new Hub(),
	// gameRoom: new GameRoom(),
	shop: new Shop(),
	bedroom: new Bedroom(),

	snakeGame: new SnakeGame(),
	flappyGoobert: new FlappyGoobert()

}

(function start() {
    const topElement = new Hub();
	const root = ReactDOM.createRoot(document.getElementById("main"));
	root.render(topElement);
})();