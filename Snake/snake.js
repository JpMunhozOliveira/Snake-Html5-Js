// Configurações do jogo
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");
const box = 32;

//Carrega imagens
const background = new Image();
background.src = "img/background.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// Cria a cobra
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
}

// Cria a comida
let food = {
    x: Math.floor(Math.random() * 16 + 1) * box,
    y: Math.floor(Math.random() * 10 + 3) * box
}

// Cria a pontuação
let score = 0;

// Controles
let d;

document.addEventListener("keydown", direction);

function direction(event) {
    if (event.key === "ArrowLeft" && d != "RIGHT") d = "LEFT";
    else if (event.key === "ArrowUp" && d != "DOWN") d = "UP";
    else if (event.key === "ArrowRight" && d != "LEFT") d = "RIGHT";
    else if (event.key === "ArrowDown" && d != "UP") d = "DOWN";
}

// Função da Colisão
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {

    context.drawImage(background, 0, 0);

    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i == 0) ? "green" : "white";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }

    context.drawImage(foodImg, food.x, food.y);

    // posição antiga da cabeca
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Direção
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Se a cobra comeu a comida
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 16 + 1) * box,
            y: Math.floor(Math.random() * 10 + 3) * box
        }
    } else {
        snake.pop();
    }

    // Adiciona um nova cabeça
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    // Game over
    if (snakeX < box || 
        snakeX > 16 * box || 
        snakeY < 3 * box || 
        snakeY > 12 * box || 
        collision(newHead, snake)) 
        {

        clearInterval(game);
    }

    snake.unshift(newHead);

    context.fillStyle = '#fff';
    context.font = "45px Comfortaa";
    context.fillText(score, canvas.width / 2 - 11, 2 * box);
}

// Chama a função draw a cada 100 ms
let game = setInterval(draw, 100);