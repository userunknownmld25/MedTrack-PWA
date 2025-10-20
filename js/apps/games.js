// Games Application
class GamesApp {
    constructor() {
        this.name = 'Games';
        this.icon = '🎮';
        this.currentGame = null;
        this.gameCanvas = null;
        this.gameCtx = null;
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="game-container">
                    <div class="game-title">WebOS Games</div>
                    <div class="game-grid">
                        <div class="game-card" data-game="snake">
                            <div class="game-card-icon">🐍</div>
                            <div class="game-card-title">Snake</div>
                            <div class="game-card-desc">Classic snake game</div>
                        </div>
                        <div class="game-card" data-game="tetris">
                            <div class="game-card-icon">🧩</div>
                            <div class="game-card-title">Tetris</div>
                            <div class="game-card-desc">Block stacking puzzle</div>
                        </div>
                        <div class="game-card" data-game="pong">
                            <div class="game-card-icon">🏓</div>
                            <div class="game-card-title">Pong</div>
                            <div class="game-card-desc">Classic paddle game</div>
                        </div>
                        <div class="game-card" data-game="breakout">
                            <div class="game-card-icon">🧱</div>
                            <div class="game-card-title">Breakout</div>
                            <div class="game-card-desc">Brick breaking game</div>
                        </div>
                        <div class="game-card" data-game="memory">
                            <div class="game-card-icon">🧠</div>
                            <div class="game-card-title">Memory</div>
                            <div class="game-card-desc">Card matching game</div>
                        </div>
                        <div class="game-card" data-game="minesweeper">
                            <div class="game-card-icon">💣</div>
                            <div class="game-card-title">Minesweeper</div>
                            <div class="game-card-desc">Mine detection puzzle</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.container.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const gameName = e.currentTarget.dataset.game;
                this.startGame(gameName);
            });
        });
    }

    startGame(gameName) {
        this.currentGame = gameName;
        this.showGameCanvas();
        this.loadGame(gameName);
    }

    showGameCanvas() {
        this.container.innerHTML = `
            <div class="app-content">
                <div class="app-toolbar">
                    <button class="toolbar-button" id="back-btn" title="Back to Games">←</button>
                    <button class="toolbar-button" id="restart-btn" title="Restart Game">🔄</button>
                    <button class="toolbar-button" id="pause-btn" title="Pause Game">⏸️</button>
                    <div class="toolbar-separator"></div>
                    <div class="game-score" id="game-score">Score: 0</div>
                    <div class="game-level" id="game-level">Level: 1</div>
                </div>
                <div class="game-canvas-container">
                    <canvas id="game-canvas" width="800" height="600"></canvas>
                    <div class="game-overlay" id="game-overlay">
                        <div class="game-instructions" id="game-instructions"></div>
                    </div>
                </div>
            </div>
        `;

        this.gameCanvas = this.container.querySelector('#game-canvas');
        this.gameCtx = this.gameCanvas.getContext('2d');
        
        this.setupGameEventListeners();
    }

    setupGameEventListeners() {
        this.container.querySelector('#back-btn').addEventListener('click', () => this.backToGames());
        this.container.querySelector('#restart-btn').addEventListener('click', () => this.restartGame());
        this.container.querySelector('#pause-btn').addEventListener('click', () => this.togglePause());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleGameKeyDown(e));
    }

    loadGame(gameName) {
        switch (gameName) {
            case 'snake':
                this.loadSnakeGame();
                break;
            case 'tetris':
                this.loadTetrisGame();
                break;
            case 'pong':
                this.loadPongGame();
                break;
            case 'breakout':
                this.loadBreakoutGame();
                break;
            case 'memory':
                this.loadMemoryGame();
                break;
            case 'minesweeper':
                this.loadMinesweeperGame();
                break;
        }
    }

    loadSnakeGame() {
        this.snakeGame = {
            snake: [{x: 10, y: 10}],
            direction: {x: 0, y: 0},
            food: {x: 15, y: 15},
            score: 0,
            gameLoop: null,
            paused: false
        };
        
        this.container.querySelector('#game-instructions').textContent = 
            'Use arrow keys to move. Eat the red food to grow and increase your score!';
        
        this.startSnakeGame();
    }

    startSnakeGame() {
        this.drawSnakeGame();
        this.snakeGame.gameLoop = setInterval(() => {
            if (!this.snakeGame.paused) {
                this.updateSnakeGame();
                this.drawSnakeGame();
            }
        }, 150);
    }

    updateSnakeGame() {
        const head = {...this.snakeGame.snake[0]};
        head.x += this.snakeGame.direction.x;
        head.y += this.snakeGame.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 30) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snakeGame.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.snakeGame.food.x && head.y === this.snakeGame.food.y) {
            this.snakeGame.score += 10;
            this.generateFood();
        } else {
            this.snakeGame.snake.pop();
        }
        
        this.updateScore();
    }

    drawSnakeGame() {
        this.gameCtx.fillStyle = '#000';
        this.gameCtx.fillRect(0, 0, 800, 600);
        
        // Draw snake
        this.gameCtx.fillStyle = '#0f0';
        this.snakeGame.snake.forEach(segment => {
            this.gameCtx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
        });
        
        // Draw food
        this.gameCtx.fillStyle = '#f00';
        this.gameCtx.fillRect(this.snakeGame.food.x * 20, this.snakeGame.food.y * 20, 18, 18);
    }

    generateFood() {
        this.snakeGame.food = {
            x: Math.floor(Math.random() * 40),
            y: Math.floor(Math.random() * 30)
        };
    }

    loadTetrisGame() {
        this.tetrisGame = {
            board: Array(20).fill().map(() => Array(10).fill(0)),
            currentPiece: null,
            score: 0,
            level: 1,
            gameLoop: null,
            paused: false
        };
        
        this.container.querySelector('#game-instructions').textContent = 
            'Use arrow keys to move and rotate pieces. Press space to drop. Fill rows to clear them!';
        
        this.startTetrisGame();
    }

    startTetrisGame() {
        this.spawnTetrisPiece();
        this.drawTetrisGame();
        this.tetrisGame.gameLoop = setInterval(() => {
            if (!this.tetrisGame.paused) {
                this.updateTetrisGame();
                this.drawTetrisGame();
            }
        }, 500);
    }

    spawnTetrisPiece() {
        const pieces = [
            {shape: [[1,1,1,1]], color: '#0ff'},
            {shape: [[1,1],[1,1]], color: '#ff0'},
            {shape: [[0,1,0],[1,1,1]], color: '#800'},
            {shape: [[0,1,1],[1,1,0]], color: '#0f0'},
            {shape: [[1,1,0],[0,1,1]], color: '#f00'},
            {shape: [[1,1,1],[0,1,0]], color: '#f0f'},
            {shape: [[1,1,1],[1,0,0]], color: '#0f0'}
        ];
        
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        this.tetrisGame.currentPiece = {
            shape: piece.shape,
            color: piece.color,
            x: 3,
            y: 0
        };
    }

    updateTetrisGame() {
        if (this.tetrisGame.currentPiece) {
            this.tetrisGame.currentPiece.y++;
            
            if (this.checkTetrisCollision()) {
                this.tetrisGame.currentPiece.y--;
                this.placeTetrisPiece();
                this.clearTetrisLines();
                this.spawnTetrisPiece();
            }
        }
    }

    checkTetrisCollision() {
        const piece = this.tetrisGame.currentPiece;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x;
                    const newY = piece.y + y;
                    
                    if (newX < 0 || newX >= 10 || newY >= 20 || 
                        (newY >= 0 && this.tetrisGame.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    placeTetrisPiece() {
        const piece = this.tetrisGame.currentPiece;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x;
                    const newY = piece.y + y;
                    if (newY >= 0) {
                        this.tetrisGame.board[newY][newX] = piece.color;
                    }
                }
            }
        }
    }

    clearTetrisLines() {
        for (let y = 0; y < 20; y++) {
            if (this.tetrisGame.board[y].every(cell => cell !== 0)) {
                this.tetrisGame.board.splice(y, 1);
                this.tetrisGame.board.unshift(Array(10).fill(0));
                this.tetrisGame.score += 100;
                this.updateScore();
            }
        }
    }

    drawTetrisGame() {
        this.gameCtx.fillStyle = '#000';
        this.gameCtx.fillRect(0, 0, 800, 600);
        
        // Draw board
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 10; x++) {
                if (this.tetrisGame.board[y][x]) {
                    this.gameCtx.fillStyle = this.tetrisGame.board[y][x];
                    this.gameCtx.fillRect(x * 40, y * 30, 38, 28);
                }
            }
        }
        
        // Draw current piece
        if (this.tetrisGame.currentPiece) {
            const piece = this.tetrisGame.currentPiece;
            this.gameCtx.fillStyle = piece.color;
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        this.gameCtx.fillRect((piece.x + x) * 40, (piece.y + y) * 30, 38, 28);
                    }
                }
            }
        }
    }

    loadPongGame() {
        this.pongGame = {
            ball: {x: 400, y: 300, vx: 5, vy: 3},
            paddle1: {x: 50, y: 250, width: 20, height: 100},
            paddle2: {x: 730, y: 250, width: 20, height: 100},
            score1: 0,
            score2: 0,
            gameLoop: null,
            paused: false
        };
        
        this.container.querySelector('#game-instructions').textContent = 
            'Player 1: W/S keys. Player 2: Arrow Up/Down keys. First to 5 points wins!';
        
        this.startPongGame();
    }

    startPongGame() {
        this.drawPongGame();
        this.pongGame.gameLoop = setInterval(() => {
            if (!this.pongGame.paused) {
                this.updatePongGame();
                this.drawPongGame();
            }
        }, 16);
    }

    updatePongGame() {
        // Update ball position
        this.pongGame.ball.x += this.pongGame.ball.vx;
        this.pongGame.ball.y += this.pongGame.ball.vy;
        
        // Ball collision with top/bottom walls
        if (this.pongGame.ball.y <= 0 || this.pongGame.ball.y >= 580) {
            this.pongGame.ball.vy = -this.pongGame.ball.vy;
        }
        
        // Ball collision with paddles
        if (this.pongGame.ball.x <= 70 && this.pongGame.ball.y >= this.pongGame.paddle1.y && 
            this.pongGame.ball.y <= this.pongGame.paddle1.y + 100) {
            this.pongGame.ball.vx = -this.pongGame.ball.vx;
        }
        
        if (this.pongGame.ball.x >= 710 && this.pongGame.ball.y >= this.pongGame.paddle2.y && 
            this.pongGame.ball.y <= this.pongGame.paddle2.y + 100) {
            this.pongGame.ball.vx = -this.pongGame.ball.vx;
        }
        
        // Ball out of bounds
        if (this.pongGame.ball.x < 0) {
            this.pongGame.score2++;
            this.resetPongBall();
        } else if (this.pongGame.ball.x > 800) {
            this.pongGame.score1++;
            this.resetPongBall();
        }
        
        this.updateScore();
    }

    resetPongBall() {
        this.pongGame.ball = {x: 400, y: 300, vx: 5, vy: 3};
    }

    drawPongGame() {
        this.gameCtx.fillStyle = '#000';
        this.gameCtx.fillRect(0, 0, 800, 600);
        
        // Draw paddles
        this.gameCtx.fillStyle = '#fff';
        this.gameCtx.fillRect(this.pongGame.paddle1.x, this.pongGame.paddle1.y, 20, 100);
        this.gameCtx.fillRect(this.pongGame.paddle2.x, this.pongGame.paddle2.y, 20, 100);
        
        // Draw ball
        this.gameCtx.fillStyle = '#fff';
        this.gameCtx.beginPath();
        this.gameCtx.arc(this.pongGame.ball.x, this.pongGame.ball.y, 10, 0, Math.PI * 2);
        this.gameCtx.fill();
        
        // Draw score
        this.gameCtx.fillStyle = '#fff';
        this.gameCtx.font = '48px Arial';
        this.gameCtx.fillText(this.pongGame.score1, 200, 100);
        this.gameCtx.fillText(this.pongGame.score2, 600, 100);
    }

    loadBreakoutGame() {
        this.breakoutGame = {
            paddle: {x: 350, y: 550, width: 100, height: 20},
            ball: {x: 400, y: 300, vx: 3, vy: -3},
            bricks: [],
            score: 0,
            gameLoop: null,
            paused: false
        };
        
        this.container.querySelector('#game-instructions').textContent = 
            'Use mouse to move paddle. Break all bricks to win!';
        
        this.initBreakoutBricks();
        this.startBreakoutGame();
    }

    initBreakoutBricks() {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                this.breakoutGame.bricks.push({
                    x: col * 80,
                    y: row * 30 + 50,
                    width: 75,
                    height: 25,
                    color: `hsl(${row * 60}, 70%, 50%)`
                });
            }
        }
    }

    startBreakoutGame() {
        this.drawBreakoutGame();
        this.breakoutGame.gameLoop = setInterval(() => {
            if (!this.breakoutGame.paused) {
                this.updateBreakoutGame();
                this.drawBreakoutGame();
            }
        }, 16);
    }

    updateBreakoutGame() {
        // Update ball position
        this.breakoutGame.ball.x += this.breakoutGame.ball.vx;
        this.breakoutGame.ball.y += this.breakoutGame.ball.vy;
        
        // Ball collision with walls
        if (this.breakoutGame.ball.x <= 0 || this.breakoutGame.ball.x >= 780) {
            this.breakoutGame.ball.vx = -this.breakoutGame.ball.vx;
        }
        if (this.breakoutGame.ball.y <= 0) {
            this.breakoutGame.ball.vy = -this.breakoutGame.ball.vy;
        }
        
        // Ball collision with paddle
        if (this.breakoutGame.ball.y >= 550 && this.breakoutGame.ball.x >= this.breakoutGame.paddle.x && 
            this.breakoutGame.ball.x <= this.breakoutGame.paddle.x + 100) {
            this.breakoutGame.ball.vy = -this.breakoutGame.ball.vy;
        }
        
        // Ball collision with bricks
        this.breakoutGame.bricks = this.breakoutGame.bricks.filter(brick => {
            if (this.breakoutGame.ball.x >= brick.x && this.breakoutGame.ball.x <= brick.x + brick.width &&
                this.breakoutGame.ball.y >= brick.y && this.breakoutGame.ball.y <= brick.y + brick.height) {
                this.breakoutGame.ball.vy = -this.breakoutGame.ball.vy;
                this.breakoutGame.score += 10;
                this.updateScore();
                return false;
            }
            return true;
        });
        
        // Game over
        if (this.breakoutGame.ball.y > 600) {
            this.gameOver();
        }
        
        // Win condition
        if (this.breakoutGame.bricks.length === 0) {
            this.gameWin();
        }
    }

    drawBreakoutGame() {
        this.gameCtx.fillStyle = '#000';
        this.gameCtx.fillRect(0, 0, 800, 600);
        
        // Draw paddle
        this.gameCtx.fillStyle = '#fff';
        this.gameCtx.fillRect(this.breakoutGame.paddle.x, this.breakoutGame.paddle.y, 100, 20);
        
        // Draw ball
        this.gameCtx.fillStyle = '#fff';
        this.gameCtx.beginPath();
        this.gameCtx.arc(this.breakoutGame.ball.x, this.breakoutGame.ball.y, 8, 0, Math.PI * 2);
        this.gameCtx.fill();
        
        // Draw bricks
        this.breakoutGame.bricks.forEach(brick => {
            this.gameCtx.fillStyle = brick.color;
            this.gameCtx.fillRect(brick.x, brick.y, brick.width, brick.height);
        });
    }

    loadMemoryGame() {
        this.memoryGame = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            score: 0,
            gameLoop: null,
            paused: false
        };
        
        this.container.querySelector('#game-instructions').textContent = 
            'Click cards to flip them. Match pairs to win!';
        
        this.initMemoryCards();
        this.drawMemoryGame();
    }

    initMemoryCards() {
        const symbols = ['🎈', '🎂', '🎄', '🎁', '🎪', '🎨', '🎭', '🎯'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < 16; i++) {
            this.memoryGame.cards.push({
                id: i,
                symbol: cards[i],
                flipped: false,
                matched: false
            });
        }
    }

    drawMemoryGame() {
        this.gameCtx.fillStyle = '#2c3e50';
        this.gameCtx.fillRect(0, 0, 800, 600);
        
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const x = col * 200 + 10;
            const y = row * 150 + 10;
            
            this.gameCtx.fillStyle = this.memoryGame.cards[i].flipped ? '#ecf0f1' : '#34495e';
            this.gameCtx.fillRect(x, y, 180, 130);
            
            if (this.memoryGame.cards[i].flipped) {
                this.gameCtx.fillStyle = '#2c3e50';
                this.gameCtx.font = '48px Arial';
                this.gameCtx.textAlign = 'center';
                this.gameCtx.fillText(this.memoryGame.cards[i].symbol, x + 90, y + 80);
            }
        }
    }

    loadMinesweeperGame() {
        this.minesweeperGame = {
            board: [],
            revealed: [],
            flagged: [],
            mines: 20,
            gameOver: false,
            won: false,
            score: 0
        };
        
        this.container.querySelector('#game-instructions').textContent = 
            'Left click to reveal, right click to flag. Find all mines!';
        
        this.initMinesweeperBoard();
        this.drawMinesweeperGame();
    }

    initMinesweeperBoard() {
        const size = 16;
        this.minesweeperGame.board = Array(size).fill().map(() => Array(size).fill(0));
        this.minesweeperGame.revealed = Array(size).fill().map(() => Array(size).fill(false));
        this.minesweeperGame.flagged = Array(size).fill().map(() => Array(size).fill(false));
        
        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < this.minesweeperGame.mines) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            if (this.minesweeperGame.board[y][x] !== -1) {
                this.minesweeperGame.board[y][x] = -1;
                minesPlaced++;
            }
        }
        
        // Calculate numbers
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (this.minesweeperGame.board[y][x] !== -1) {
                    let count = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (ny >= 0 && ny < size && nx >= 0 && nx < size && 
                                this.minesweeperGame.board[ny][nx] === -1) {
                                count++;
                            }
                        }
                    }
                    this.minesweeperGame.board[y][x] = count;
                }
            }
        }
    }

    drawMinesweeperGame() {
        const size = 16;
        const cellSize = 40;
        
        this.gameCtx.fillStyle = '#2c3e50';
        this.gameCtx.fillRect(0, 0, 800, 600);
        
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                
                if (this.minesweeperGame.revealed[y][x]) {
                    this.gameCtx.fillStyle = '#ecf0f1';
                    this.gameCtx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);
                    
                    if (this.minesweeperGame.board[y][x] === -1) {
                        this.gameCtx.fillStyle = '#e74c3c';
                        this.gameCtx.fillRect(cellX + 5, cellY + 5, cellSize - 11, cellSize - 11);
                    } else if (this.minesweeperGame.board[y][x] > 0) {
                        this.gameCtx.fillStyle = '#2c3e50';
                        this.gameCtx.font = '20px Arial';
                        this.gameCtx.textAlign = 'center';
                        this.gameCtx.fillText(this.minesweeperGame.board[y][x], cellX + cellSize/2, cellY + cellSize/2 + 7);
                    }
                } else {
                    this.gameCtx.fillStyle = this.minesweeperGame.flagged[y][x] ? '#f39c12' : '#34495e';
                    this.gameCtx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);
                    
                    if (this.minesweeperGame.flagged[y][x]) {
                        this.gameCtx.fillStyle = '#2c3e50';
                        this.gameCtx.font = '20px Arial';
                        this.gameCtx.textAlign = 'center';
                        this.gameCtx.fillText('🚩', cellX + cellSize/2, cellY + cellSize/2 + 7);
                    }
                }
            }
        }
    }

    handleGameKeyDown(e) {
        if (!this.currentGame) return;
        
        switch (this.currentGame) {
            case 'snake':
                this.handleSnakeKeyDown(e);
                break;
            case 'tetris':
                this.handleTetrisKeyDown(e);
                break;
            case 'pong':
                this.handlePongKeyDown(e);
                break;
        }
    }

    handleSnakeKeyDown(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (this.snakeGame.direction.y === 0) {
                    this.snakeGame.direction = {x: 0, y: -1};
                }
                break;
            case 'ArrowDown':
                if (this.snakeGame.direction.y === 0) {
                    this.snakeGame.direction = {x: 0, y: 1};
                }
                break;
            case 'ArrowLeft':
                if (this.snakeGame.direction.x === 0) {
                    this.snakeGame.direction = {x: -1, y: 0};
                }
                break;
            case 'ArrowRight':
                if (this.snakeGame.direction.x === 0) {
                    this.snakeGame.direction = {x: 1, y: 0};
                }
                break;
        }
    }

    handleTetrisKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                this.moveTetrisPiece(-1, 0);
                break;
            case 'ArrowRight':
                this.moveTetrisPiece(1, 0);
                break;
            case 'ArrowDown':
                this.moveTetrisPiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotateTetrisPiece();
                break;
            case ' ':
                this.dropTetrisPiece();
                break;
        }
    }

    moveTetrisPiece(dx, dy) {
        if (this.tetrisGame.currentPiece) {
            this.tetrisGame.currentPiece.x += dx;
            this.tetrisGame.currentPiece.y += dy;
            
            if (this.checkTetrisCollision()) {
                this.tetrisGame.currentPiece.x -= dx;
                this.tetrisGame.currentPiece.y -= dy;
            }
        }
    }

    rotateTetrisPiece() {
        if (this.tetrisGame.currentPiece) {
            const rotated = this.tetrisGame.currentPiece.shape[0].map((_, i) => 
                this.tetrisGame.currentPiece.shape.map(row => row[i]).reverse()
            );
            const originalShape = this.tetrisGame.currentPiece.shape;
            this.tetrisGame.currentPiece.shape = rotated;
            
            if (this.checkTetrisCollision()) {
                this.tetrisGame.currentPiece.shape = originalShape;
            }
        }
    }

    dropTetrisPiece() {
        if (this.tetrisGame.currentPiece) {
            while (!this.checkTetrisCollision()) {
                this.tetrisGame.currentPiece.y++;
            }
            this.tetrisGame.currentPiece.y--;
        }
    }

    handlePongKeyDown(e) {
        switch (e.key) {
            case 'w':
                this.pongGame.paddle1.y = Math.max(0, this.pongGame.paddle1.y - 20);
                break;
            case 's':
                this.pongGame.paddle1.y = Math.min(500, this.pongGame.paddle1.y + 20);
                break;
            case 'ArrowUp':
                this.pongGame.paddle2.y = Math.max(0, this.pongGame.paddle2.y - 20);
                break;
            case 'ArrowDown':
                this.pongGame.paddle2.y = Math.min(500, this.pongGame.paddle2.y + 20);
                break;
        }
    }

    updateScore() {
        let score = 0;
        let level = 1;
        
        switch (this.currentGame) {
            case 'snake':
                score = this.snakeGame.score;
                break;
            case 'tetris':
                score = this.tetrisGame.score;
                level = this.tetrisGame.level;
                break;
            case 'pong':
                score = this.pongGame.score1;
                break;
            case 'breakout':
                score = this.breakoutGame.score;
                break;
        }
        
        this.container.querySelector('#game-score').textContent = `Score: ${score}`;
        this.container.querySelector('#game-level').textContent = `Level: ${level}`;
    }

    togglePause() {
        if (this.currentGame === 'snake') {
            this.snakeGame.paused = !this.snakeGame.paused;
        } else if (this.currentGame === 'tetris') {
            this.tetrisGame.paused = !this.tetrisGame.paused;
        } else if (this.currentGame === 'pong') {
            this.pongGame.paused = !this.pongGame.paused;
        } else if (this.currentGame === 'breakout') {
            this.breakoutGame.paused = !this.breakoutGame.paused;
        }
    }

    restartGame() {
        if (this.currentGame) {
            this.loadGame(this.currentGame);
        }
    }

    gameOver() {
        alert('Game Over!');
        this.stopGame();
    }

    gameWin() {
        alert('You Win!');
        this.stopGame();
    }

    stopGame() {
        if (this.snakeGame && this.snakeGame.gameLoop) {
            clearInterval(this.snakeGame.gameLoop);
        }
        if (this.tetrisGame && this.tetrisGame.gameLoop) {
            clearInterval(this.tetrisGame.gameLoop);
        }
        if (this.pongGame && this.pongGame.gameLoop) {
            clearInterval(this.pongGame.gameLoop);
        }
        if (this.breakoutGame && this.breakoutGame.gameLoop) {
            clearInterval(this.breakoutGame.gameLoop);
        }
    }

    backToGames() {
        this.stopGame();
        this.currentGame = null;
        this.container.innerHTML = this.getHTML();
        this.setupEventListeners();
    }

    cleanup() {
        this.stopGame();
        console.log('Games cleanup');
    }
}