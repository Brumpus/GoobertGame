"use strict";
import "games/snake-stylesheet.css";

class Snake extends React.Component {
    render() {
        return (
            <main>
                <script src="games/snake-game.js" defer></script>

                <div id="main" class="container bg-primary"></div>
                <div id="keys" class="d-block d-md-none">
                    <i class="bi bi-arrow-up text-white bg-warning p-1 rounded-pill key keyup" onclick="setSnakeVelocity('up')"></i><br />
                    <i class="bi bi-arrow-left text-white bg-warning p-1 rounded-pill key keyleft" onclick="setSnakeVelocity('left')"></i>
                    <i class="bi bi-arrow-down text-white bg-warning p-1 rounded-pill key keydown" onclick="setSnakeVelocity('down')"></i>
                    <i class="bi bi-arrow-right text-white bg-warning p-1 rounded-pill key keyright" onclick="setSnakeVelocity('right')"></i>
                </div>
            </main>
        );
    }
}