// Advanced Games System
class GamesManager {
    constructor() {
        this.games = new Map();
        this.currentGame = null;
        this.scores = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.registerGames();
        this.loadScores();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeGames();
        });
    }

    initializeGames() {
        const gamesContainer = document.querySelector('.games-content');
        if (!gamesContainer) return;

        // Setup game card events
        this.setupGameCardEvents();
    }

    setupGameCardEvents() {
        const gamesGrid = document.querySelector('.games-grid');
        if (!gamesGrid) return;

        gamesGrid.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game-card');
            if (gameCard) {
                const gameName = gameCard.dataset.game;
                this.launchGame(gameName);
            }
        });
    }

    registerGames() {
        this.registerGame('snake', SnakeGame);
        this.registerGame('tetris', TetrisGame);
        this.registerGame('pong', PongGame);
        this.registerGame('memory', MemoryGame);
        this.registerGame('breakout', BreakoutGame);
        this.registerGame('pacman', PacmanGame);
    }

    registerGame(name, GameClass) {
        this.games.set(name, GameClass);
    }

    launchGame(gameName) {
        const GameClass = this.games.get(gameName);
        if (!GameClass) {
            this.showNotification('Games', `Game ${gameName} not found`);
            return;
        }

        // Close current game if any
        if (this.currentGame) {
            this.currentGame.destroy();
        }

        // Create new game instance
        this.currentGame = new GameClass();
        this.currentGame.start();
    }

    loadScores() {
        const saved = localStorage.getItem('games-scores');
        if (saved) {
            this.scores = new Map(JSON.parse(saved));
        }
    }

    saveScores() {
        localStorage.setItem('games-scores', JSON.stringify([...this.scores]));
    }

    updateScore(gameName, score) {
        const currentScore = this.scores.get(gameName) || 0;
        if (score > currentScore) {
            this.scores.set(gameName, score);
            this.saveScores();
            this.showNotification('Games', `New high score for ${gameName}: ${score}`);
        }
    }

    showNotification(title, message) {
        if (window.webOS) {
            window.webOS.showNotification(title, message);
        } else {
            console.log(`${title}: ${message}`);
        }
    }
}

// Base Game Class
class BaseGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
    }

    start() {
        this.createGameWindow();
        this.setupCanvas();
        this.setupEventListeners();
        this.isRunning = true;
        this.gameLoop();
    }

    createGameWindow() {
        const window = window.webOS.createWindow({
            title: this.getGameName(),
            content: this.getGameHTML(),
            width: '800px',
            height: '600px',
            app: 'games'
        });
        
        this.window = window;
    }

    getGameHTML() {
        return `
            <div class="game-container">
                <div class="game-header">
                    <div class="game-score">Score: <span id="score">0</span></div>
                    <div class="game-level">Level: <span id="level">1</span></div>
                    <div class="game-lives">Lives: <span id="lives">3</span></div>
                </div>
                <div class="game-canvas-container">
                    <canvas id="game-canvas" width="800" height="500"></canvas>
                </div>
                <div class="game-controls">
                    <button id="pause-btn">Pause</button>
                    <button id="restart-btn">Restart</button>
                    <button id="close-btn">Close</button>
                </div>
            </div>
        `;
    }

    setupCanvas() {
        this.canvas = this.window.querySelector('#game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        // Game controls
        const pauseBtn = this.window.querySelector('#pause-btn');
        const restartBtn = this.window.querySelector('#restart-btn');
        const closeBtn = this.window.querySelector('#close-btn');

        pauseBtn.addEventListener('click', () => this.togglePause());
        restartBtn.addEventListener('click', () => this.restart());
        closeBtn.addEventListener('click', () => this.destroy());

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(e) {
        // Override in subclasses
    }

    togglePause() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.gameLoop();
        }
    }

    restart() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.isRunning = true;
        this.updateDisplay();
        this.gameLoop();
    }

    destroy() {
        this.isRunning = false;
        if (this.window) {
            window.webOS.closeWindow(this.window);
        }
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Override in subclasses
    }

    draw() {
        // Override in subclasses
    }

    updateDisplay() {
        const scoreElement = this.window.querySelector('#score');
        const levelElement = this.window.querySelector('#level');
        const livesElement = this.window.querySelector('#lives');

        if (scoreElement) scoreElement.textContent = this.score;
        if (levelElement) levelElement.textContent = this.level;
        if (livesElement) livesElement.textContent = this.lives;
    }

    getGameName() {
        return 'Game';
    }
}

// Snake Game
class SnakeGame extends BaseGame {
    constructor() {
        super();
        this.snake = [{ x: 400, y: 300 }];
        this.direction = { x: 0, y: 0 };
        this.food = { x: 0, y: 0 };
        this.gridSize = 20;
        this.lastMoveTime = 0;
        this.moveInterval = 150;
    }

    getGameName() {
        return 'Snake Game';
    }

    setupCanvas() {
        super.setupCanvas();
        this.generateFood();
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (this.direction.y === 0) {
                    this.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) {
                    this.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) {
                    this.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) {
                    this.direction = { x: 1, y: 0 };
                }
                break;
        }
    }

    update() {
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveInterval) return;

        this.lastMoveTime = now;

        if (this.direction.x === 0 && this.direction.y === 0) return;

        const head = { ...this.snake[0] };
        head.x += this.direction.x * this.gridSize;
        head.y += this.direction.y * this.gridSize;

        // Check wall collision
        if (head.x < 0 || head.x >= this.canvas.width || 
            head.y < 0 || head.y >= this.canvas.height) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.updateDisplay();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#0f0';
        this.snake.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, this.gridSize - 2, this.gridSize - 2);
        });

        // Draw food
        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(this.food.x, this.food.y, this.gridSize - 2, this.gridSize - 2);
    }

    generateFood() {
        this.food.x = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.food.y = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
    }

    gameOver() {
        this.isRunning = false;
        this.showNotification('Snake Game', `Game Over! Final Score: ${this.score}`);
        window.gamesManager.updateScore('snake', this.score);
    }
}

// Tetris Game
class TetrisGame extends BaseGame {
    constructor() {
        super();
        this.board = Array(20).fill().map(() => Array(10).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.pieces = [
            { shape: [[1,1,1,1]], color: '#00f' },
            { shape: [[1,1],[1,1]], color: '#ff0' },
            { shape: [[1,1,1],[0,1,0]], color: '#f0f' },
            { shape: [[1,1,1],[1,0,0]], color: '#0ff' },
            { shape: [[1,1,1],[0,0,1]], color: '#f80' },
            { shape: [[1,1,0],[0,1,1]], color: '#8f0' },
            { shape: [[0,1,1],[1,1,0]], color: '#f08' }
        ];
    }

    getGameName() {
        return 'Tetris Game';
    }

    setupCanvas() {
        super.setupCanvas();
        this.spawnPiece();
    }

    handleKeyDown(e) {
        if (!this.currentPiece) return;

        switch (e.key) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case ' ':
                this.dropPiece();
                break;
        }
    }

    update() {
        const now = Date.now();
        if (now - this.dropTime < this.dropInterval) return;

        this.dropTime = now;
        this.movePiece(0, 1);
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw board
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * 30, y * 30, 28, 28);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        this.ctx.fillRect(
                            (this.currentPiece.x + x) * 30,
                            (this.currentPiece.y + y) * 30,
                            28, 28
                        );
                    }
                });
            });
        }
    }

    spawnPiece() {
        const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        this.currentPiece = {
            ...piece,
            x: Math.floor(this.board[0].length / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return;

        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;

        if (this.isValidPosition(newX, newY, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
        } else if (dy > 0) {
            this.placePiece();
        }
    }

    rotatePiece() {
        if (!this.currentPiece) return;

        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );

        if (this.isValidPosition(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }

    dropPiece() {
        while (this.isValidPosition(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
        }
        this.placePiece();
    }

    isValidPosition(x, y, shape) {
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const newX = x + px;
                    const newY = y + py;

                    if (newX < 0 || newX >= this.board[0].length ||
                        newY >= this.board.length ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece() {
        if (!this.currentPiece) return;

        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.board[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color;
                }
            });
        });

        this.clearLines();
        this.spawnPiece();

        if (!this.isValidPosition(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver();
        }
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = this.board.length - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(10).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }

        if (linesCleared > 0) {
            this.score += linesCleared * 100;
            this.updateDisplay();
        }
    }

    gameOver() {
        this.isRunning = false;
        this.showNotification('Tetris Game', `Game Over! Final Score: ${this.score}`);
        window.gamesManager.updateScore('tetris', this.score);
    }
}

// Pong Game
class PongGame extends BaseGame {
    constructor() {
        super();
        this.ball = { x: 400, y: 300, vx: 5, vy: 5 };
        this.paddle1 = { x: 50, y: 250, width: 20, height: 100 };
        this.paddle2 = { x: 730, y: 250, width: 20, height: 100 };
        this.paddleSpeed = 5;
    }

    getGameName() {
        return 'Pong Game';
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'w':
                this.paddle1.y = Math.max(0, this.paddle1.y - this.paddleSpeed);
                break;
            case 's':
                this.paddle1.y = Math.min(this.canvas.height - this.paddle1.height, this.paddle1.y + this.paddleSpeed);
                break;
            case 'ArrowUp':
                this.paddle2.y = Math.max(0, this.paddle2.y - this.paddleSpeed);
                break;
            case 'ArrowDown':
                this.paddle2.y = Math.min(this.canvas.height - this.paddle2.height, this.paddle2.y + this.paddleSpeed);
                break;
        }
    }

    update() {
        // Move ball
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Ball collision with top/bottom walls
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height - 10) {
            this.ball.vy = -this.ball.vy;
        }

        // Ball collision with paddles
        if (this.ball.x <= this.paddle1.x + this.paddle1.width &&
            this.ball.x >= this.paddle1.x &&
            this.ball.y >= this.paddle1.y &&
            this.ball.y <= this.paddle1.y + this.paddle1.height) {
            this.ball.vx = -this.ball.vx;
            this.score++;
            this.updateDisplay();
        }

        if (this.ball.x >= this.paddle2.x &&
            this.ball.x <= this.paddle2.x + this.paddle2.width &&
            this.ball.y >= this.paddle2.y &&
            this.ball.y <= this.paddle2.y + this.paddle2.height) {
            this.ball.vx = -this.ball.vx;
            this.score++;
            this.updateDisplay();
        }

        // Ball out of bounds
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.gameOver();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
        this.ctx.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle2.height);

        // Draw ball
        this.ctx.fillRect(this.ball.x, this.ball.y, 10, 10);
    }

    gameOver() {
        this.isRunning = false;
        this.showNotification('Pong Game', `Game Over! Final Score: ${this.score}`);
        window.gamesManager.updateScore('pong', this.score);
    }
}

// Memory Game
class MemoryGame extends BaseGame {
    constructor() {
        super();
        this.cards = [];
        this.flippedCards = [];
        this.matches = 0;
        this.totalPairs = 8;
        this.cardSize = 80;
        this.cols = 4;
        this.rows = 4;
    }

    getGameName() {
        return 'Memory Game';
    }

    setupCanvas() {
        super.setupCanvas();
        this.initializeCards();
    }

    initializeCards() {
        const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const cards = [];
        
        // Create pairs
        for (let i = 0; i < this.totalPairs; i++) {
            cards.push({ id: i, symbol: symbols[i], matched: false });
            cards.push({ id: i + this.totalPairs, symbol: symbols[i], matched: false });
        }
        
        // Shuffle
        this.cards = cards.sort(() => Math.random() - 0.5);
    }

    handleKeyDown(e) {
        // Memory game doesn't use keyboard
    }

    update() {
        // Memory game doesn't need continuous updates
    }

    draw() {
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.cards.forEach((card, index) => {
            const x = (index % this.cols) * this.cardSize;
            const y = Math.floor(index / this.cols) * this.cardSize;

            if (card.matched) {
                this.ctx.fillStyle = '#90EE90';
            } else if (this.flippedCards.includes(card)) {
                this.ctx.fillStyle = '#fff';
            } else {
                this.ctx.fillStyle = '#4169E1';
            }

            this.ctx.fillRect(x, y, this.cardSize - 2, this.cardSize - 2);

            if (this.flippedCards.includes(card) || card.matched) {
                this.ctx.fillStyle = '#000';
                this.ctx.font = '24px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(card.symbol, x + this.cardSize / 2, y + this.cardSize / 2 + 8);
            }
        });
    }

    // This would be called by mouse events
    flipCard(index) {
        const card = this.cards[index];
        
        if (card.matched || this.flippedCards.includes(card)) return;
        
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
    }

    checkMatch() {
        if (this.flippedCards.length === 2) {
            const [card1, card2] = this.flippedCards;
            
            if (card1.symbol === card2.symbol) {
                card1.matched = true;
                card2.matched = true;
                this.matches++;
                this.score += 10;
                this.updateDisplay();
                
                if (this.matches === this.totalPairs) {
                    this.gameOver();
                }
            }
            
            this.flippedCards = [];
        }
    }

    gameOver() {
        this.isRunning = false;
        this.showNotification('Memory Game', `Congratulations! Final Score: ${this.score}`);
        window.gamesManager.updateScore('memory', this.score);
    }
}

// Breakout Game
class BreakoutGame extends BaseGame {
    constructor() {
        super();
        this.paddle = { x: 350, y: 550, width: 100, height: 20 };
        this.ball = { x: 400, y: 300, vx: 3, vy: -3, radius: 10 };
        this.bricks = [];
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickRows = 5;
        this.brickCols = 10;
        this.initializeBricks();
    }

    getGameName() {
        return 'Breakout Game';
    }

    initializeBricks() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let row = 0; row < this.brickRows; row++) {
            for (let col = 0; col < this.brickCols; col++) {
                this.bricks.push({
                    x: col * (this.brickWidth + 5) + 5,
                    y: row * (this.brickHeight + 5) + 50,
                    width: this.brickWidth,
                    height: this.brickHeight,
                    color: colors[row],
                    destroyed: false
                });
            }
        }
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                this.paddle.x = Math.max(0, this.paddle.x - 20);
                break;
            case 'ArrowRight':
                this.paddle.x = Math.min(this.canvas.width - this.paddle.width, this.paddle.x + 20);
                break;
        }
    }

    update() {
        // Move ball
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Ball collision with walls
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.vx = -this.ball.vx;
        }
        if (this.ball.y <= this.ball.radius) {
            this.ball.vy = -this.ball.vy;
        }

        // Ball collision with paddle
        if (this.ball.y >= this.paddle.y - this.ball.radius &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            this.ball.vy = -this.ball.vy;
        }

        // Ball collision with bricks
        this.bricks.forEach(brick => {
            if (!brick.destroyed &&
                this.ball.x >= brick.x &&
                this.ball.x <= brick.x + brick.width &&
                this.ball.y >= brick.y &&
                this.ball.y <= brick.y + brick.height) {
                brick.destroyed = true;
                this.ball.vy = -this.ball.vy;
                this.score += 10;
                this.updateDisplay();
            }
        });

        // Ball out of bounds
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            this.updateDisplay();
            
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.resetBall();
            }
        }

        // Check win condition
        if (this.bricks.every(brick => brick.destroyed)) {
            this.gameOver();
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw paddle
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();

        // Draw bricks
        this.bricks.forEach(brick => {
            if (!brick.destroyed) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
    }

    resetBall() {
        this.ball.x = 400;
        this.ball.y = 300;
        this.ball.vx = 3;
        this.ball.vy = -3;
    }

    gameOver() {
        this.isRunning = false;
        const message = this.bricks.every(brick => brick.destroyed) ? 
            `You Win! Final Score: ${this.score}` : 
            `Game Over! Final Score: ${this.score}`;
        this.showNotification('Breakout Game', message);
        window.gamesManager.updateScore('breakout', this.score);
    }
}

// Pacman Game
class PacmanGame extends BaseGame {
    constructor() {
        super();
        this.pacman = { x: 10, y: 10, direction: 'right', nextDirection: 'right' };
        this.ghosts = [
            { x: 10, y: 10, color: '#ff0000', direction: 'up' },
            { x: 10, y: 10, color: '#00ff00', direction: 'down' },
            { x: 10, y: 10, color: '#0000ff', direction: 'left' },
            { x: 10, y: 10, color: '#ffff00', direction: 'right' }
        ];
        this.maze = this.generateMaze();
        this.dots = this.generateDots();
        this.gridSize = 20;
    }

    getGameName() {
        return 'Pacman Game';
    }

    generateMaze() {
        // Simple maze generation
        const maze = Array(25).fill().map(() => Array(40).fill(0));
        
        // Add walls
        for (let i = 0; i < 25; i++) {
            maze[i][0] = 1;
            maze[i][39] = 1;
        }
        for (let j = 0; j < 40; j++) {
            maze[0][j] = 1;
            maze[24][j] = 1;
        }
        
        return maze;
    }

    generateDots() {
        const dots = [];
        for (let y = 1; y < this.maze.length - 1; y++) {
            for (let x = 1; x < this.maze[y].length - 1; x++) {
                if (this.maze[y][x] === 0) {
                    dots.push({ x, y, eaten: false });
                }
            }
        }
        return dots;
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                this.pacman.nextDirection = 'up';
                break;
            case 'ArrowDown':
                this.pacman.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                this.pacman.nextDirection = 'left';
                break;
            case 'ArrowRight':
                this.pacman.nextDirection = 'right';
                break;
        }
    }

    update() {
        // Move pacman
        this.movePacman();
        
        // Move ghosts
        this.ghosts.forEach(ghost => this.moveGhost(ghost));
        
        // Check dot collection
        this.dots.forEach(dot => {
            if (!dot.eaten && 
                Math.floor(this.pacman.x / this.gridSize) === dot.x && 
                Math.floor(this.pacman.y / this.gridSize) === dot.y) {
                dot.eaten = true;
                this.score += 10;
                this.updateDisplay();
            }
        });
        
        // Check win condition
        if (this.dots.every(dot => dot.eaten)) {
            this.gameOver();
        }
    }

    movePacman() {
        const newX = this.pacman.x;
        const newY = this.pacman.y;
        
        switch (this.pacman.nextDirection) {
            case 'up':
                if (this.isValidMove(newX, newY - 5)) {
                    this.pacman.direction = 'up';
                    this.pacman.y -= 5;
                }
                break;
            case 'down':
                if (this.isValidMove(newX, newY + 5)) {
                    this.pacman.direction = 'down';
                    this.pacman.y += 5;
                }
                break;
            case 'left':
                if (this.isValidMove(newX - 5, newY)) {
                    this.pacman.direction = 'left';
                    this.pacman.x -= 5;
                }
                break;
            case 'right':
                if (this.isValidMove(newX + 5, newY)) {
                    this.pacman.direction = 'right';
                    this.pacman.x += 5;
                }
                break;
        }
    }

    moveGhost(ghost) {
        // Simple ghost AI
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        let newX = ghost.x;
        let newY = ghost.y;
        
        switch (randomDirection) {
            case 'up':
                newY -= 2;
                break;
            case 'down':
                newY += 2;
                break;
            case 'left':
                newX -= 2;
                break;
            case 'right':
                newX += 2;
                break;
        }
        
        if (this.isValidMove(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
        }
    }

    isValidMove(x, y) {
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        
        return gridY >= 0 && gridY < this.maze.length &&
               gridX >= 0 && gridX < this.maze[gridY].length &&
               this.maze[gridY][gridX] === 0;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.ctx.fillStyle = '#0000ff';
        for (let y = 0; y < this.maze.length; y++) {
            for (let x = 0; x < this.maze[y].length; x++) {
                if (this.maze[y][x] === 1) {
                    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
                }
            }
        }
        
        // Draw dots
        this.ctx.fillStyle = '#ffff00';
        this.dots.forEach(dot => {
            if (!dot.eaten) {
                this.ctx.beginPath();
                this.ctx.arc(
                    dot.x * this.gridSize + this.gridSize / 2,
                    dot.y * this.gridSize + this.gridSize / 2,
                    3, 0, Math.PI * 2
                );
                this.ctx.fill();
            }
        });
        
        // Draw pacman
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(this.pacman.x, this.pacman.y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw ghosts
        this.ghosts.forEach(ghost => {
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(ghost.x, ghost.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    gameOver() {
        this.isRunning = false;
        this.showNotification('Pacman Game', `Game Over! Final Score: ${this.score}`);
        window.gamesManager.updateScore('pacman', this.score);
    }
}

// Initialize games manager
window.gamesManager = new GamesManager();