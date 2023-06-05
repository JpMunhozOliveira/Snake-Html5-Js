// Configurações do jogo
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");
const boxSize = 32;

// Carrega imagens
const background = new Image();
background.src = "img/background.png";

const pointImg = new Image();
pointImg.src = "img/point.png";

// Define os limites da área de jogo
const gameArea = {
    top: 3 * boxSize,
    right: 17 * boxSize,
    bottom: 13 * boxSize,
    left: boxSize
};

// Carrega sons
const sounds = {
    dead: new Audio("sounds/dead.mp3"),
    eat: new Audio("sounds/eat.mp3"),
    move: new Audio("sounds/move.mp3")
};

// Cobra
class Snake {
    constructor() {
        this.body = [
            {
                x: 9 * boxSize,
                y: 10 * boxSize
            }
        ];
        this.direction = null;
    }

    changeDirection(newDirection) {
        if (
            (newDirection === "LEFT" && this.direction !== "RIGHT") ||
            (newDirection === "UP" && this.direction !== "DOWN") ||
            (newDirection === "RIGHT" && this.direction !== "LEFT") ||
            (newDirection === "DOWN" && this.direction !== "UP")
        ) {
            sounds.move.play()
            this.direction = newDirection;
        }
    }

    move() {
        const head = { ...this.body[0] };
        switch (this.direction) {
            case "LEFT":
                head.x -= boxSize;
                break;
            case "UP":
                head.y -= boxSize;
                break;
            case "RIGHT":
                head.x += boxSize;
                break;
            case "DOWN":
                head.y += boxSize;
                break;
            default:
                return;
        }
        this.body.unshift(head);
        this.body.pop();
    }

    checkCollision() {
        const head = this.body[0];
        // Verifica colisão com as paredes do canvas
        if (head.x < gameArea.left || head.x >= gameArea.right ||
            head.y < gameArea.top || head.y >= gameArea.bottom) {
            return true;
        }
        // Verifica colisão com o próprio corpo
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    draw() {
        for (let i = 0; i < this.body.length; i++) {
            const { x, y } = this.body[i];
            context.fillStyle = (i === 0) ? "#65eb65" : "#98FB98";
            context.fillRect(x, y, boxSize, boxSize);
        }
    }
}

// Comida
class Point {
    constructor() {
        this.x = Math.floor(Math.random() * 16 + 1) * boxSize;
        this.y = Math.floor(Math.random() * 10 + 3) * boxSize;
    }

    update() {
        context.drawImage(pointImg, this.x, this.y);
    }
}

// Pontuação
class Score {
    constructor() {
        this.value = 0;
    }

    increase() {
        this.value++;
        sounds.eat.play();
    }

    draw() {
        context.fillStyle = "#fff";
        context.font = "45px Comfortaa";
        context.fillText(this.value, canvas.width / 2 - 11, 2 * boxSize);
    }
}

// Controles
document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
    const keyPressed = event.key;
    const arrowKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

    if (arrowKeys.includes(keyPressed)) {
        let direction;

        switch (keyPressed) {
            case "ArrowUp":
                direction = "UP";
                break;
            case "ArrowRight":
                direction = "RIGHT";
                break;
            case "ArrowDown":
                direction = "DOWN";
                break;
            case "ArrowLeft":
                direction = "LEFT";
                break;
            default:
                return;
        }

        snake.changeDirection(direction);
    }
}

// Cria os objetos do jogo
let snake = new Snake();
let point = new Point();

// Cria a pontuação
let score = new Score();

function draw() {
    // Limpa o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o fundo
    context.drawImage(background, 0, 0);

    // Atualiza e desenha a comida
    point.update();

    // Move a cobra
    snake.move();

    // Verifica colisões
    if (snake.checkCollision()) {
        endGame();
        return;
    }

    // Verifica se a cobra comeu a comida
    if (snake.body[0].x === point.x && snake.body[0].y === point.y) {

        snake.body.push({ ...snake.body[snake.body.length - 1] });
        score.increase();
        point.x = Math.floor(Math.random() * 16 + 1) * boxSize;
        point.y = Math.floor(Math.random() * 10 + 3) * boxSize;
        
    }

    // Desenha a cobra
    snake.draw();

    // Desenha a pontuação
    score.draw();
}

function endGame() {
    clearInterval(game);
    sounds.dead.play();

    document.removeEventListener("keydown", handleKeyPress); // Remove o event listener anterior

    // Exibe a tela de fim de jogo com a pontuação
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#fff";
    context.font = "36px Comfortaa";
    context.fillText("Game Over!", canvas.width / 2 - 110, canvas.height / 2 - 50);
    context.font = "24px Comfortaa";
    context.fillText("Score: " + score.value, canvas.width / 2 - 50, canvas.height / 2);

    context.fillText("Press 'ENTER' to restart ", canvas.width / 2 - 140, canvas.height / 2 + 150);

    document.addEventListener("keydown", restartGame);

    function restartGame(event) {
        if (event.key === "Enter") {
            document.removeEventListener("keydown", restartGame);
            resetGame();
        }
    }
}

function resetGame() {
    // Limpa o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Reinicia os objetos do jogo
    snake = new Snake();
    point = new Point();
    score = new Score();

    // Reinicia as configurações do jogo
    document.addEventListener("keydown", handleKeyPress);
    game = setInterval(draw, 200);
}

// Chama a função draw a cada 100 ms
let game = setInterval(draw, 200);