window.onload = () => {    
    snakeDivs.id = "snakeDivs";
    body.appendChild(snakeDivs);
    // Create an HTML element for each part of the snake
    for (position of snake.positions) {
        position.asset = [assets.right, assets.right];
        position.div = createSnakeDiv(position.x, position.y, position.id, position.asset);
        updateImage(position);
    }
    // Initialize snake head
    snake.head = snake.positions[0];
    snake.head.asset[1] = assets.head;
    updateImage(snake.head);

    // Create an HTML element for the apple
    createAppleDiv();
    apple.div = document.getElementById("apple");
    setPosition(apple.div, apple.x, apple.y);

    start(10);
}

const assets = {
    left: 0,
    down: 1,
    right: 2,
    up: 3,
    head: 4,

    size: 64 // Asset size in pixels
}
const windowSize = new URLSearchParams(window.location.search);

const snakeDivs = document.createElement("div");

// Update game size
width = parseInt(windowSize.get("width")) - 1 || 15;
height = parseInt(windowSize.get("height")) - 1 || 15;

setBodySize();

let snake = {
    positions: [
        { x: width > 10 ? 6 : 3, y: Math.floor(height / 2), id: 0 },
        { x: width > 10 ? 5 : 2, y: Math.floor(height / 2), id: 1 },
        { x: width > 10 ? 4 : 1, y: Math.floor(height / 2), id: 2 }
    ],
    velocity: {
        y: 0,
        x: 1,
        direction: assets.right
    },
    head: { x: 4, y: Math.floor(height / 2), id: 2},
    direction: "right"
}
let apple = { x: width > 15 ? width - 8 : width - 3, y: Math.floor(height / 2) };

function gameloop() {
    handleKeyPress();
    moveSnake();
}

function moveSnake() {
    // change snake direction if key was pressed this frame
    snake.direction = snake.velocity.direction;

    // Update snake head based on current head
    let currentSquare = snake.head;
    snake.head = snake.positions[snake.positions.length - 1];
    currentSquare.asset[1] = snake.direction;
    updateImage(currentSquare);

    // Update head x
    snake.head.x = currentSquare.x + snake.velocity.x;
    if (snake.head.x > width) {
        snake.head.x = 0;
    } else if (snake.head.x < 0) {
        snake.head.x = width;
    }

    // Update head y
    snake.head.y = currentSquare.y + snake.velocity.y;
    if (snake.head.y > height) {
        snake.head.y = 0;
    } else if (snake.head.y < 0) {
        snake.head.y = height;
    }

    // Eat apple if the snake head would end up on the apple this frame
    // This is an easy way to ensure when the snake grows, it will not grow into itself
    if (snake.head.x == apple.x && snake.head.y == apple.y) {
        eatApple();
    } else {
        // Move snake forward if it has not eaten an apple this frame
    
        snake.positions.splice(snake.positions.length - 1);
        snake.positions.unshift(snake.head);
    
        setObjPosition(snake.head);
    
        for (position of snake.positions) {
            // Kill snake if it is touching itself
            if (position.x == snake.head.x && position.y == snake.head.y && position != snake.head) {
                resetGame();
            }
        }

        // Update assets
        snake.head.asset[0] = snake.direction;
        snake.head.asset[1] = assets.head;
        updateImage(snake.head);
    }
}
function createSnakeDiv(x, y, id, asset) {
    let cell = document.createElement("div");

    let scale = gridSize / assets.size
    cell.style.backgroundSize = 
        scale * assets.size * 5 + "px " + 
        scale * assets.size * 4 + "px";
    cell.style.backgroundPosition = "0 0";

    setPosition(cell, x, y);
    cell.id = id;
    cell.classList.add("snake");
    cell.style.width = gridSize + "px";
    cell.style.height = gridSize + "px";

    snakeDivs.appendChild(cell);

    return cell;
}
function updateImage(position) {
    let scale = gridSize / assets.size;
    let sx = position.asset[1] * assets.size;
    let sy = position.asset[0] * assets.size;

    position.div.style.backgroundPosition = 
        `${(-sx * scale)}px ${(-sy * scale)}px`;
}
function createAppleDiv(x, y) {
    let cell = document.createElement("div");
    cell.id = "apple";
    cell.classList.add("apple");
    cell.style.width = gridSize + "px";
    cell.style.height = gridSize + "px";

    cell.style.backgroundSize = 
        gridSize + "px " + 
        gridSize + "px";
    cell.style.backgroundPosition = "0 0";

    body.appendChild(cell);
}
function setPosition(div, x, y) {
    
    div.style.left = x * gridSize + "px";
    div.style.top = y * gridSize + "px";
}
function setObjPosition(obj) {
    setPosition(obj.div, obj.x, obj.y);
}
function eatApple() {
    let newSquare = { x: apple.x, y: apple.y, id: snake.positions.length };
    newSquare.asset = [snake.direction, assets.head];

    newSquare.div = createSnakeDiv(apple.x, apple.y, snake.positions.length);
    snake.positions.unshift(newSquare);

    let validSpaces = findValidSpaces();
    let space = validSpaces[Math.floor(Math.random() * validSpaces.length)];

    apple.x = Math.floor(space.x);
    apple.y = Math.floor(space.y);
    setObjPosition(apple);

    snake.head = newSquare;
    updateImage(newSquare);

    // david.eat();
}
function findValidSpaces() {
    // As much as I hate nested loops, this is the best way I could think to do this.
    // This shouldn't scale too poorly with larger grids or snakes because the vast 
    // majority of players will have less than 30x30 (900) total tiles in the grid
    // meaning with a full grid and a maximally long snake, this will only run around 1800 times
    // which computers can do just fine
    let validSpaces = [];
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let isValid = true;
            for(let position of snake.positions) {
                if(position.x == x && position.y == y) {
                    isValid = false;
                    break;
                }
            }
            if(isValid) {
                validSpaces.push({x: x, y: y});
            }
        }
    }
    return validSpaces;
}

function handleKeyPress() {
    if (keys["a"] || keys["arrowleft"]) {
        setSnakeVelocity("left");
    } else if (keys["d"] || keys["arrowright"]) {
        setSnakeVelocity("right");
    }
    if (keys["s"] || keys["arrowdown"]) {
        setSnakeVelocity("down");
    } else if (keys["w"] || keys["arrowup"]) {
        setSnakeVelocity("up");
    }
}

function setSnakeVelocity(dir) {
    switch (dir) {
        case "left":
            if(snake.direction != assets.right) {
                snake.velocity = { x: -1, y: 0, direction: assets.left };
            }
            break;
        case "down":
            if(snake.direction != assets.down) {
                snake.velocity = { x: 0, y: 1, direction: assets.up };
            }
        break;
        case "right":
            if(snake.direction != assets.left) {
                snake.velocity = { x: 1, y: 0, direction: assets.right };
            }
        break;
        case "up":
            if(snake.direction != assets.up) {
                snake.velocity = { x: 0, y: -1, direction: assets.down };
            }
    }
}