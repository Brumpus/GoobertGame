window.onload = () => {
    bird.div = createBirdDiv();
    bird.eyes = createEyeDiv();
    bird.div.appendChild(bird.eyes);

    setBodySize();
    start(30);
}

let bird = {
    x: gridSize * 3,
    y: 10,
    velocity: 0,

    jumpPower: 30,
    maxFall: 100,
    fallSpeed: 3,
}
let countdown = 0; 
let pipes = [];
class Pipe {
    constructor() {
        this.x = parseInt(body.style.width) + 20;
        this.gapSize = ((Math.random() * 80) + 300) * gridSize / 64;
        this.width = 1.5;
        this.firstPipeHeight = Math.random() * (body.offsetHeight - this.gapSize) * gridSize / 64;
        this.div = createPipeDivs(this);
        this.dead = false;
    }

    move() {
        this.x -= 10 * gridSize / 64;
        if(this.x < -gridSize * this.width) {
            body.removeChild(this.div);
            this.dead = true;
        }
    }
}

function gameloop() {
    handleKeyPress();
    moveBird();
    if(countdown <= 0) {
        pipes.push(new Pipe());
        countdown = Math.floor(Math.random() * 60) + 45; 
    }
    for(let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.move();
        if(pipe.dead) {
            pipes.splice(i, 1);
        } else {
            renderPipe(pipe);
        }
    }

    setPosition(bird.div, bird.x, bird.y);
    bird.eyes.style.top = 
        Math.max(Math.min((bird.velocity) * (gridSize / 64), gridSize * 0.5), -(gridSize * 0.5)) 
        + "px";
    countdown--;
}

function moveBird() {
    bird.y += bird.velocity * gridSize / 64;
    bird.velocity = Math.min(bird.velocity + bird.fallSpeed, bird.maxFall);

    checkPipeIntersection();

    if(bird.y > (height+1) * gridSize || bird.y + gridSize < -gridSize / 2) resetGame();

}
function checkPipeIntersection() {
    function checkCircleBoxIntersection(circle, box) { 
        // This function was generated in part through use of Google Gemini
        // I could have written it myself but I am tired
        const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.width));
        const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.height));

        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;

        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        return distanceSquared <= (circle.radius * circle.radius);
    }

    let circle = {
        x: bird.x + gridSize / 2,
        y: bird.y + gridSize / 2,
        radius: gridSize / 2 * 0.95 // Shrunk down a bit to feel more fair
    }


    for(let pipe of pipes) {
        if(
            (bird.x < pipe.x + pipe.width * gridSize && bird.x + gridSize > pipe.x)
            // Bird has met a pipe (either inside the water or inside the pipe)
        ) {
            let topPipe = {
                x: pipe.x,
                y: 0,
                width: pipe.width * gridSize,
                height: pipe.firstPipeHeight
            }
            let bottomPipe = {
                x: pipe.x,
                y: pipe.firstPipeHeight + pipe.gapSize,
                width: pipe.width * gridSize,
                height: Infinity
            }

            if(
                checkCircleBoxIntersection(circle, topPipe) ||
                checkCircleBoxIntersection(circle, bottomPipe)
            ) {
                // Intersecting with a pipe
                resetGame();
            } else {
                // Intersecting with water
                // david.cleanliness += 0.04; // Wash goobert
            }
        }
    }
}
function createBirdDiv() {
    let cell = document.createElement("div");

    cell.style.backgroundSize = 
        gridSize + "px " + 
        gridSize + "px";
    cell.style.backgroundPosition = "0 0";

    setPosition(cell, bird.x, bird.y);
    cell.id = "bird";
    cell.classList.add("bird");
    cell.style.width = gridSize + "px";
    cell.style.height = gridSize + "px";

    body.appendChild(cell);

    return cell;
}
function createEyeDiv() {
    let cell = document.createElement("div");

    cell.style.backgroundSize = 
        gridSize + "px " + 
        gridSize + "px";
    cell.style.backgroundPosition = "0 0";

    cell.classList.add("eyes");
    cell.style.left = gridSize * 0.4 + "px";
    cell.style.width = gridSize + "px";
    cell.style.height = gridSize + "px";

    body.appendChild(cell);

    return cell;
}



function createPipeDivs(pipe) {
    let div = document.createElement("div");
    div.classList.add("pipeGroup");
    
    div.appendChild(createTopPipe(pipe));
    div.appendChild(createWaterDiv(pipe));
    div.appendChild(createBottomPipe(pipe));

    body.appendChild(div);

    return div;
}
function createTopPipe(pipe) {
    let cell = document.createElement("div");
    cell.classList.add("pipe");
    cell.style.width = gridSize * pipe.width + "px";
    cell.style.height = pipe.firstPipeHeight + "px";
    cell.style.top = "0px";

    cell.style.backgroundSize = 
        gridSize + "px " + 
        gridSize + "px";
    cell.style.backgroundPosition = "0 0";

    body.appendChild(cell);

    return cell;
}
function createBottomPipe(pipe) {
    let cell = document.createElement("div");
    cell.classList.add("pipe");
    cell.style.width = gridSize * pipe.width + "px";
    cell.style.top = pipe.firstPipeHeight + pipe.gapSize + "px";
    cell.style.height = body.offsetHeight - pipe.firstPipeHeight - pipe.gapSize + "px";

    cell.style.backgroundSize = 
        gridSize + "px " + 
        gridSize + "px";
    cell.style.backgroundPosition = "0 0";

    body.appendChild(cell);

    return cell;
}
function createWaterDiv(pipe) {
    let cell = document.createElement("div");
    cell.classList.add("water");
    cell.style.width = gridSize * pipe.width * 0.75 + "px";
    cell.style.height = pipe.gapSize + "px";
    cell.style.top = pipe.firstPipeHeight + "px";

    cell.style.backgroundSize = 
        gridSize + "px " + 
        gridSize + "px";
    cell.style.backgroundPosition = "0 0";
    cell.style.top

    body.appendChild(cell);

    return cell;
}
function renderPipe(pipe) {
    pipe.div.style.left = pipe.x + "px";
}

function setPosition(div, x, y) {
    div.style.left = x  + "px";
    div.style.top = y + "px";
}

function handleKeyPress() {
    if(keys["w"] || keys[" "] || keys["arrowup"]) {
        jump();
        keys["w"] = keys[" "] = keys["arrowup"] = false;
    }
}
function jump() {
    if(bird.velocity > 0) {
        bird.velocity = -bird.jumpPower
    }
}