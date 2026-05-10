// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;
const WIN_SCORE = 10;

// Get canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Responsive canvas sizing
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const scale = rect.width / CANVAS_WIDTH;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game Objects
const paddlePlayer = {
    x: 10,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const paddleComputer = {
    x: CANVAS_WIDTH - PADDLE_WIDTH - 10,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
    size: BALL_SIZE,
    speed: BALL_SPEED
};

let score = {
    player: 0,
    computer: 0
};

let gameRunning = false;
let keys = {};
let mouseY = CANVAS_HEIGHT / 2;

// Input handling
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// UI Event Listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('resetBtn').addEventListener('click', resetScore);

function startGame() {
    gameRunning = true;
    document.getElementById('startBtn').textContent = 'Pause Game';
    document.getElementById('startBtn').onclick = pauseGame;
}

function pauseGame() {
    gameRunning = false;
    document.getElementById('startBtn').textContent = 'Resume Game';
    document.getElementById('startBtn').onclick = startGame;
}

function resetScore() {
    score.player = 0;
    score.computer = 0;
    updateScore();
    resetBall();
}

function resetBall() {
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    ball.dy = (Math.random() - 0.5) * BALL_SPEED * 2;
    
    // Ensure ball has minimum speed in x direction
    if (Math.abs(ball.dx) < BALL_SPEED * 0.7) {
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED * 0.8;
    }
}

// Update Functions
function updatePlayerPaddle() {
    let targetY = mouseY - PADDLE_HEIGHT / 2;
    
    if (keys['ArrowUp']) {
        targetY = paddlePlayer.y - PADDLE_SPEED;
    } else if (keys['ArrowDown']) {
        targetY = paddlePlayer.y + PADDLE_SPEED;
    } else {
        // Smoothly move towards mouse position
        const diff = targetY - paddlePlayer.y;
        targetY = paddlePlayer.y + diff * 0.15; // Smooth lerp
    }
    
    // Clamp paddle to canvas bounds
    paddlePlayer.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, targetY));
}

function updateComputerPaddle() {
    // AI Logic: track ball with some delay for difficulty balance
    const paddleCenter = paddleComputer.y + PADDLE_HEIGHT / 2;
    const ballCenter = ball.y;
    const difficulty = 0.06; // 0-1, higher = harder
    
    if (ballCenter < paddleCenter - 10) {
        paddleComputer.y -= PADDLE_SPEED * difficulty;
    } else if (ballCenter > paddleCenter + 10) {
        paddleComputer.y += PADDLE_SPEED * difficulty;
    }
    
    // Clamp paddle to canvas bounds
    paddleComputer.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddleComputer.y));
}

function updateBall() {
    if (!gameRunning) return;
    
    // Update position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top and bottom)
    if (ball.y - ball.size / 2 < 0 || ball.y + ball.size / 2 > CANVAS_HEIGHT) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.size / 2, Math.min(CANVAS_HEIGHT - ball.size / 2, ball.y));
    }
    
    // Paddle collision - Player
    if (checkPaddleCollision(ball, paddlePlayer)) {
        const deltaY = (ball.y - (paddlePlayer.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.dx = -ball.dx;
        ball.dy += paddlePlayer.dy * 0.2; // Add spin
        ball.dy += deltaY * BALL_SPEED * 0.3; // Add angle based on hit location
        ball.x = paddlePlayer.x + PADDLE_WIDTH; // Prevent ball from getting stuck
    }
    
    // Paddle collision - Computer
    if (checkPaddleCollision(ball, paddleComputer)) {
        const deltaY = (ball.y - (paddleComputer.y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ball.dx = -ball.dx;
        ball.dy += paddleComputer.dy * 0.2; // Add spin
        ball.dy += deltaY * BALL_SPEED * 0.3; // Add angle based on hit location
        ball.x = paddleComputer.x - BALL_SIZE; // Prevent ball from getting stuck
    }
    
    // Scoring
    if (ball.x < 0) {
        score.computer++;
        updateScore();
        resetBall();
        checkWin();
    } else if (ball.x > CANVAS_WIDTH) {
        score.player++;
        updateScore();
        resetBall();
        checkWin();
    }
}

function checkPaddleCollision(ball, paddle) {
    return ball.x - ball.size / 2 < paddle.x + paddle.width &&
           ball.x + ball.size / 2 > paddle.x &&
           ball.y - ball.size / 2 < paddle.y + paddle.height &&
           ball.y + ball.size / 2 > paddle.y;
}

function updateScore() {
    document.getElementById('playerScore').textContent = score.player;
    document.getElementById('computerScore').textContent = score.computer;
}

function checkWin() {
    if (score.player >= WIN_SCORE) {
        alert(`🎉 You Win! Final Score: ${score.player} - ${score.computer}`);
        resetScore();
        gameRunning = false;
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').onclick = startGame;
    } else if (score.computer >= WIN_SCORE) {
        alert(`💻 Computer Wins! Final Score: ${score.player} - ${score.computer}`);
        resetScore();
        gameRunning = false;
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').onclick = startGame;
    }
}

// Drawing Functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff5252';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawCenter() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw center line
    drawCenter();
    
    // Draw paddles
    drawPaddle(paddlePlayer);
    drawPaddle(paddleComputer);
    
    // Draw ball
    drawBall();
    
    // Draw status
    if (!gameRunning) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

// Main Game Loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
