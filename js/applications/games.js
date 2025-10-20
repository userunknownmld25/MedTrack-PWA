// Games Application for Windows 11 Web OS

class GamesApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 800;
        this.defaultHeight = 600;
        this.minWidth = 600;
        this.minHeight = 400;
        
        this.currentGame = null;
        this.gameInstances = new Map();
        
        this.games = {
            snake: {
                name: 'Snake',
                description: 'Classic snake game - eat food and grow longer!',
                icon: 'fas fa-gamepad',
                difficulty: 'Easy',
                category: 'Arcade'
            },
            tetris: {
                name: 'Tetris',
                description: 'Arrange falling blocks to clear lines',
                icon: 'fas fa-th-large',
                difficulty: 'Medium',
                category: 'Puzzle'
            },
            memory: {
                name: 'Memory Game',
                description: 'Match pairs of cards to test your memory',
                icon: 'fas fa-brain',
                difficulty: 'Easy',
                category: 'Memory'
            },
            calculator: {
                name: '2048',
                description: 'Combine tiles to reach 2048',
                icon: 'fas fa-calculator',
                difficulty: 'Hard',
                category: 'Puzzle'
            },
            pong: {
                name: 'Pong',
                description: 'Classic paddle ball game',
                icon: 'fas fa-table-tennis',
                difficulty: 'Easy',
                category: 'Arcade'
            },
            minesweeper: {
                name: 'Minesweeper',
                description: 'Clear the minefield without hitting a mine',
                icon: 'fas fa-bomb',
                difficulty: 'Medium',
                category: 'Logic'
            }
        };
    }
    
    render() {
        return `
            <div class="games-app">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="games-home" title="Home">
                            <i class="fas fa-home"></i>
                            <span>Home</span>
                        </button>
                        <button class="app-button" id="games-favorites" title="Favorites">
                            <i class="fas fa-star"></i>
                            <span>Favorites</span>
                        </button>
                        <button class="app-button" id="games-scores" title="High Scores">
                            <i class="fas fa-trophy"></i>
                            <span>Scores</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <select class="app-select" id="games-category">
                            <option value="all">All Games</option>
                            <option value="arcade">Arcade</option>
                            <option value="puzzle">Puzzle</option>
                            <option value="memory">Memory</option>
                            <option value="logic">Logic</option>
                        </select>
                        <select class="app-select" id="games-difficulty">
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <input type="text" class="app-input" id="games-search" placeholder="Search games..." style="width: 200px;">
                        <button class="app-button" id="games-search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="games-content" id="games-content">
                    <!-- Game content will be populated here -->
                </div>
                
                <div class="games-status">
                    <div class="status-left">
                        <span id="games-status-text">Ready to play!</span>
                    </div>
                    <div class="status-right">
                        <span id="games-count">${Object.keys(this.games).length} games available</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Toolbar buttons
        content.querySelector('#games-home').addEventListener('click', () => this.showGameLibrary());
        content.querySelector('#games-favorites').addEventListener('click', () => this.showFavorites());
        content.querySelector('#games-scores').addEventListener('click', () => this.showHighScores());
        
        // Filters
        content.querySelector('#games-category').addEventListener('change', () => this.filterGames());
        content.querySelector('#games-difficulty').addEventListener('change', () => this.filterGames());
        
        // Search
        const searchInput = content.querySelector('#games-search');
        searchInput.addEventListener('input', () => this.filterGames());
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.filterGames();
            }
        });
        
        content.querySelector('#games-search-btn').addEventListener('click', () => this.filterGames());
    }
    
    loadData() {
        this.showGameLibrary();
    }
    
    showGameLibrary() {
        const content = this.getContentElement().querySelector('#games-content');
        
        content.innerHTML = `
            <div class="games-library">
                <div class="library-header">
                    <h2>Game Library</h2>
                    <p>Choose from our collection of classic games</p>
                </div>
                
                <div class="games-grid" id="games-grid">
                    ${this.renderGameGrid()}
                </div>
            </div>
        `;
        
        // Add click handlers
        content.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.getAttribute('data-game');
                this.playGame(gameId);
            });
        });
        
        this.updateStatus('Browse and select a game to play');
    }
    
    renderGameGrid() {
        return Object.entries(this.games).map(([gameId, game]) => `
            <div class="game-card" data-game="${gameId}" data-category="${game.category.toLowerCase()}" data-difficulty="${game.difficulty.toLowerCase()}">
                <div class="game-card-image">
                    <i class="${game.icon}"></i>
                </div>
                <div class="game-card-content">
                    <div class="game-card-title">${game.name}</div>
                    <div class="game-card-description">${game.description}</div>
                    <div class="game-card-meta">
                        <span class="game-category">${game.category}</span>
                        <span class="game-difficulty">${game.difficulty}</span>
                    </div>
                    <div class="game-card-actions">
                        <button class="btn btn-primary play-btn" data-game="${gameId}">
                            <i class="fas fa-play"></i>
                            Play
                        </button>
                        <button class="btn btn-ghost favorite-btn" data-game="${gameId}">
                            <i class="fas fa-star"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    filterGames() {
        const category = this.getContentElement().querySelector('#games-category').value;
        const difficulty = this.getContentElement().querySelector('#games-difficulty').value;
        const search = this.getContentElement().querySelector('#games-search').value.toLowerCase();
        
        const gameCards = this.getContentElement().querySelectorAll('.game-card');
        let visibleCount = 0;
        
        gameCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardDifficulty = card.getAttribute('data-difficulty');
            const cardTitle = card.querySelector('.game-card-title').textContent.toLowerCase();
            const cardDescription = card.querySelector('.game-card-description').textContent.toLowerCase();
            
            let show = true;
            
            // Category filter
            if (category !== 'all' && cardCategory !== category) {
                show = false;
            }
            
            // Difficulty filter
            if (difficulty !== 'all' && cardDifficulty !== difficulty) {
                show = false;
            }
            
            // Search filter
            if (search && !cardTitle.includes(search) && !cardDescription.includes(search)) {
                show = false;
            }
            
            card.style.display = show ? 'block' : 'none';
            if (show) visibleCount++;
        });
        
        this.updateStatus(`Showing ${visibleCount} game(s)`);
    }
    
    playGame(gameId) {
        if (!this.games[gameId]) return;
        
        this.currentGame = gameId;
        const content = this.getContentElement().querySelector('#games-content');
        
        switch (gameId) {
            case 'snake':
                this.playSnake(content);
                break;
            case 'tetris':
                this.playTetris(content);
                break;
            case 'memory':
                this.playMemoryGame(content);
                break;
            case 'calculator':
                this.play2048(content);
                break;
            case 'pong':
                this.playPong(content);
                break;
            case 'minesweeper':
                this.playMinesweeper(content);
                break;
        }
        
        this.updateTitle(`${this.games[gameId].name} - Games`);
        this.updateStatus(`Playing: ${this.games[gameId].name}`);
    }
    
    playSnake(container) {
        container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h3>Snake Game</h3>
                    <div class="game-controls">
                        <button class="btn btn-secondary" id="snake-pause">Pause</button>
                        <button class="btn btn-secondary" id="snake-restart">Restart</button>
                        <button class="btn btn-ghost" id="back-to-library">← Back to Library</button>
                    </div>
                </div>
                
                <div class="game-info">
                    <div class="score">Score: <span id="snake-score">0</span></div>
                    <div class="high-score">High Score: <span id="snake-high-score">${this.getHighScore('snake')}</span></div>
                    <div class="instructions">Use arrow keys or WASD to move</div>
                </div>
                
                <div class="game-area">
                    <canvas id="snake-canvas" width="400" height="400"></canvas>
                </div>
                
                <div class="game-status">
                    <div id="snake-status">Press any arrow key to start</div>
                </div>
            </div>
        `;
        
        this.initializeSnakeGame();
    }
    
    initializeSnakeGame() {
        const canvas = this.getContentElement().querySelector('#snake-canvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = this.getContentElement().querySelector('#snake-score');
        const statusElement = this.getContentElement().querySelector('#snake-status');
        
        let snake = [{ x: 200, y: 200 }];
        let food = { x: 100, y: 100 };
        let dx = 0, dy = 0;
        let score = 0;
        let gameRunning = false;
        let gameLoop;
        
        const gridSize = 20;
        
        const drawSnake = () => {
            ctx.fillStyle = '#0078D4';
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);
            });
        };
        
        const drawFood = () => {
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
        };
        
        const moveSnake = () => {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            
            // Check wall collision
            if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
                gameOver();
                return;
            }
            
            // Check self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                gameOver();
                return;
            }
            
            snake.unshift(head);
            
            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                generateFood();
            } else {
                snake.pop();
            }
        };
        
        const generateFood = () => {
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
            };
            
            // Make sure food doesn't spawn on snake
            if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                generateFood();
            }
        };
        
        const gameOver = () => {
            gameRunning = false;
            clearInterval(gameLoop);
            statusElement.textContent = `Game Over! Final Score: ${score}`;
            
            // Update high score
            const currentHigh = this.getHighScore('snake');
            if (score > currentHigh) {
                this.setHighScore('snake', score);
                this.getContentElement().querySelector('#snake-high-score').textContent = score;
                statusElement.textContent += ' - NEW HIGH SCORE!';
            }
        };
        
        const gameStep = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            moveSnake();
            drawSnake();
            drawFood();
        };
        
        const startGame = () => {
            if (!gameRunning) {
                gameRunning = true;
                statusElement.textContent = 'Playing...';
                gameLoop = setInterval(gameStep, 150);
            }
        };
        
        const pauseGame = () => {
            if (gameRunning) {
                gameRunning = false;
                clearInterval(gameLoop);
                statusElement.textContent = 'Paused - Press any arrow key to resume';
            } else {
                startGame();
            }
        };
        
        const restartGame = () => {
            gameRunning = false;
            clearInterval(gameLoop);
            snake = [{ x: 200, y: 200 }];
            dx = 0;
            dy = 0;
            score = 0;
            scoreElement.textContent = score;
            generateFood();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSnake();
            drawFood();
            statusElement.textContent = 'Press any arrow key to start';
        };
        
        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (!this.currentGame === 'snake') return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (dy === 0) { dx = 0; dy = -gridSize; startGame(); }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (dy === 0) { dx = 0; dy = gridSize; startGame(); }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (dx === 0) { dx = -gridSize; dy = 0; startGame(); }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (dx === 0) { dx = gridSize; dy = 0; startGame(); }
                    break;
                case ' ':
                    e.preventDefault();
                    pauseGame();
                    break;
            }
        });
        
        this.getContentElement().querySelector('#snake-pause').addEventListener('click', pauseGame);
        this.getContentElement().querySelector('#snake-restart').addEventListener('click', restartGame);
        this.getContentElement().querySelector('#back-to-library').addEventListener('click', () => {
            clearInterval(gameLoop);
            this.showGameLibrary();
        });
        
        // Initialize
        generateFood();
        drawSnake();
        drawFood();
    }
    
    playMemoryGame(container) {
        container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h3>Memory Game</h3>
                    <div class="game-controls">
                        <button class="btn btn-secondary" id="memory-restart">New Game</button>
                        <button class="btn btn-ghost" id="back-to-library">← Back to Library</button>
                    </div>
                </div>
                
                <div class="game-info">
                    <div class="score">Moves: <span id="memory-moves">0</span></div>
                    <div class="matches">Matches: <span id="memory-matches">0</span></div>
                    <div class="time">Time: <span id="memory-time">00:00</span></div>
                </div>
                
                <div class="game-area">
                    <div id="memory-board" class="memory-board"></div>
                </div>
                
                <div class="game-status">
                    <div id="memory-status">Click cards to find matching pairs</div>
                </div>
            </div>
        `;
        
        this.initializeMemoryGame();
    }
    
    initializeMemoryGame() {
        const board = this.getContentElement().querySelector('#memory-board');
        const movesElement = this.getContentElement().querySelector('#memory-moves');
        const matchesElement = this.getContentElement().querySelector('#memory-matches');
        const timeElement = this.getContentElement().querySelector('#memory-time');
        const statusElement = this.getContentElement().querySelector('#memory-status');
        
        let cards = [];
        let flippedCards = [];
        let moves = 0;
        let matches = 0;
        let gameTime = 0;
        let gameTimer;
        let gameStarted = false;
        
        const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎵'];
        const cardPairs = [...symbols, ...symbols];
        
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };
        
        const createBoard = () => {
            board.innerHTML = '';
            cards = [];
            const shuffledCards = shuffle([...cardPairs]);
            
            shuffledCards.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.dataset.symbol = symbol;
                card.dataset.index = index;
                
                card.innerHTML = `
                    <div class="card-front">?</div>
                    <div class="card-back">${symbol}</div>
                `;
                
                card.addEventListener('click', () => flipCard(card));
                board.appendChild(card);
                cards.push(card);
            });
        };
        
        const flipCard = (card) => {
            if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) {
                return;
            }
            
            if (!gameStarted) {
                startTimer();
                gameStarted = true;
            }
            
            card.classList.add('flipped');
            flippedCards.push(card);
            
            if (flippedCards.length === 2) {
                moves++;
                movesElement.textContent = moves;
                checkMatch();
            }
        };
        
        const checkMatch = () => {
            const [card1, card2] = flippedCards;
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                // Match found
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    matches++;
                    matchesElement.textContent = matches;
                    
                    if (matches === symbols.length) {
                        gameWon();
                    }
                    
                    flippedCards = [];
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        };
        
        const startTimer = () => {
            gameTimer = setInterval(() => {
                gameTime++;
                const minutes = Math.floor(gameTime / 60).toString().padStart(2, '0');
                const seconds = (gameTime % 60).toString().padStart(2, '0');
                timeElement.textContent = `${minutes}:${seconds}`;
            }, 1000);
        };
        
        const gameWon = () => {
            clearInterval(gameTimer);
            statusElement.textContent = `Congratulations! You won in ${moves} moves and ${timeElement.textContent}!`;
            
            // Save score (lower moves and time is better)
            const score = Math.max(1000 - moves * 10 - gameTime, 0);
            const currentHigh = this.getHighScore('memory');
            if (score > currentHigh) {
                this.setHighScore('memory', score);
                statusElement.textContent += ' - NEW HIGH SCORE!';
            }
        };
        
        const restartGame = () => {
            clearInterval(gameTimer);
            moves = 0;
            matches = 0;
            gameTime = 0;
            gameStarted = false;
            flippedCards = [];
            
            movesElement.textContent = '0';
            matchesElement.textContent = '0';
            timeElement.textContent = '00:00';
            statusElement.textContent = 'Click cards to find matching pairs';
            
            createBoard();
        };
        
        // Event listeners
        this.getContentElement().querySelector('#memory-restart').addEventListener('click', restartGame);
        this.getContentElement().querySelector('#back-to-library').addEventListener('click', () => {
            clearInterval(gameTimer);
            this.showGameLibrary();
        });
        
        // Initialize
        createBoard();
    }
    
    showFavorites() {
        const content = this.getContentElement().querySelector('#games-content');
        content.innerHTML = `
            <div class="favorites-page">
                <h2>Favorite Games</h2>
                <p>Your favorite games will appear here</p>
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <p>No favorite games yet</p>
                    <button class="btn btn-primary" onclick="this.closest('.games-app').querySelector('#games-home').click()">
                        Browse Games
                    </button>
                </div>
            </div>
        `;
    }
    
    showHighScores() {
        const content = this.getContentElement().querySelector('#games-content');
        
        const scores = Object.entries(this.games).map(([gameId, game]) => ({
            game: game.name,
            score: this.getHighScore(gameId)
        })).filter(item => item.score > 0);
        
        content.innerHTML = `
            <div class="scores-page">
                <h2>High Scores</h2>
                <div class="scores-list">
                    ${scores.length > 0 ? scores.map(item => `
                        <div class="score-item">
                            <div class="score-game">${item.game}</div>
                            <div class="score-value">${item.score}</div>
                        </div>
                    `).join('') : `
                        <div class="empty-state">
                            <i class="fas fa-trophy"></i>
                            <p>No high scores yet</p>
                            <p>Play some games to set your first high score!</p>
                        </div>
                    `}
                </div>
                <div class="scores-actions">
                    <button class="btn btn-secondary" onclick="this.clearHighScores()">Clear All Scores</button>
                </div>
            </div>
        `;
    }
    
    getHighScore(gameId) {
        try {
            const scores = JSON.parse(localStorage.getItem('games-high-scores') || '{}');
            return scores[gameId] || 0;
        } catch {
            return 0;
        }
    }
    
    setHighScore(gameId, score) {
        try {
            const scores = JSON.parse(localStorage.getItem('games-high-scores') || '{}');
            scores[gameId] = score;
            localStorage.setItem('games-high-scores', JSON.stringify(scores));
        } catch (error) {
            console.error('Failed to save high score:', error);
        }
    }
    
    clearHighScores() {
        if (confirm('Are you sure you want to clear all high scores?')) {
            localStorage.removeItem('games-high-scores');
            this.showHighScores();
        }
    }
    
    updateStatus(message) {
        const statusText = this.getContentElement().querySelector('#games-status-text');
        statusText.textContent = message;
    }
    
    updateTitle(title = 'Games') {
        super.updateTitle(title);
    }
    
    cleanup() {
        super.cleanup();
        
        // Clean up any running game timers
        if (this.gameInstances) {
            this.gameInstances.forEach(instance => {
                if (instance.cleanup) {
                    instance.cleanup();
                }
            });
        }
    }
}

// Register the application
window.GamesApp = GamesApp;