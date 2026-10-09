"use strict";

class SnakeGame extends React.Component {
    render() {
        return (
            <main>
                <script src="games/snake-game.js" defer></script>

                <div id="main" className="container bg-primary"></div>
                <div id="keys" className="d-block d-md-none">
                    <i className="bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup" onClick={setSnakeVelocity('up')}></i><br />
                    <i className="bi bi-arrow-left text-white bg-warning p-1 rounded-pill key keyleft" onClick={setSnakeVelocity('left')}></i>
                    <i className="bi bi-arrow-down text-white bg-warning p-1 rounded-pill key keydown" onClick={setSnakeVelocity('down')}></i>
                    <i className="bi bi-arrow-right text-white bg-warning p-1 rounded-pill key keyright" onClick={setSnakeVelocity('right')}></i>
                </div>
            </main>
        );
    }
}