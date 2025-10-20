// Windows 11 Web OS - Main Application
class WebOS {
    constructor() {
        this.windows = new Map();
        this.windowZIndex = 100;
        this.activeWindow = null;
        this.fileSystem = this.initFileSystem();
        this.pyodide = null;
        this.monacoEditor = null;
        this.init();
    }

    async init() {
        // Show loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 2000);

        // Initialize event listeners
        this.initEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Initialize Pyodide for Python support
        this.initPyodide();
    }

    async initPyodide() {
        try {
            this.pyodide = await loadPyodide();
            console.log('Pyodide initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Pyodide:', error);
        }
    }

    initFileSystem() {
        const stored = localStorage.getItem('webos-filesystem');
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            'Documents': {
                'welcome.txt': 'Welcome to Windows 11 Web OS!',
                'readme.md': '# Windows 11 Web OS\n\nA fully functional web-based operating system.'
            },
            'Pictures': {},
            'Videos': {},
            'Downloads': {},
            'Desktop': {}
        };
    }

    saveFileSystem() {
        localStorage.setItem('webos-filesystem', JSON.stringify(this.fileSystem));
    }

    initEventListeners() {
        // Start menu
        document.getElementById('start-button').addEventListener('click', () => {
            this.toggleStartMenu();
        });

        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                this.openApp(icon.dataset.app);
            });
        });

        // App tiles in start menu
        document.querySelectorAll('.app-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                this.openApp(tile.dataset.app);
                this.toggleStartMenu();
            });
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            const startMenu = document.getElementById('start-menu');
            const startButton = document.getElementById('start-button');
            if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                startMenu.classList.add('hidden');
            }
        });

        // Search functionality
        document.getElementById('start-search').addEventListener('input', (e) => {
            this.searchApps(e.target.value);
        });
    }

    toggleStartMenu() {
        document.getElementById('start-menu').classList.toggle('hidden');
    }

    updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        
        const clockElement = document.querySelector('.clock');
        clockElement.querySelector('.time').textContent = time;
        clockElement.querySelector('.date').textContent = date;
    }

    searchApps(query) {
        const tiles = document.querySelectorAll('.app-tile');
        tiles.forEach(tile => {
            const appName = tile.querySelector('span').textContent.toLowerCase();
            if (appName.includes(query.toLowerCase())) {
                tile.style.display = 'flex';
            } else {
                tile.style.display = 'none';
            }
        });
    }

    openApp(appName) {
        const apps = {
            'file-manager': () => this.createFileManager(),
            'text-editor': () => this.createTextEditor(),
            'code-editor': () => this.createCodeEditor(),
            'terminal': () => this.createTerminal(),
            'browser': () => this.createBrowser(),
            'paint': () => this.createPaint(),
            'video-editor': () => this.createVideoEditor(),
            'media-player': () => this.createMediaPlayer(),
            'game-center': () => this.createGameCenter(),
            'calculator': () => this.createCalculator(),
            'settings': () => this.createSettings(),
            'app-store': () => this.createAppStore()
        };

        if (apps[appName]) {
            apps[appName]();
        }
    }

    createWindow(title, icon, content, width = 800, height = 600) {
        const windowId = `window-${Date.now()}`;
        const window = document.createElement('div');
        window.className = 'window';
        window.id = windowId;
        window.style.width = `${width}px`;
        window.style.height = `${height}px`;
        window.style.left = `${Math.random() * 200 + 100}px`;
        window.style.top = `${Math.random() * 100 + 50}px`;
        window.style.zIndex = this.windowZIndex++;

        window.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">
                    <i class="${icon}"></i>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <button class="minimize"><i class="fas fa-minus"></i></button>
                    <button class="maximize"><i class="far fa-square"></i></button>
                    <button class="close"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        document.getElementById('windows-container').appendChild(window);
        this.windows.set(windowId, { element: window, title, minimized: false });

        // Add window controls
        this.addWindowControls(windowId);
        this.addTaskbarItem(windowId, title, icon);
        this.focusWindow(windowId);

        return window;
    }

    addWindowControls(windowId) {
        const window = this.windows.get(windowId).element;
        const titlebar = window.querySelector('.window-titlebar');
        const minimizeBtn = window.querySelector('.minimize');
        const maximizeBtn = window.querySelector('.maximize');
        const closeBtn = window.querySelector('.close');

        // Dragging
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target === titlebar || e.target.closest('.window-title')) {
                isDragging = true;
                initialX = e.clientX - window.offsetLeft;
                initialY = e.clientY - window.offsetTop;
                this.focusWindow(windowId);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && !window.classList.contains('maximized')) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                window.style.left = `${currentX}px`;
                window.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Double click to maximize
        titlebar.addEventListener('dblclick', () => {
            this.toggleMaximize(windowId);
        });

        // Window controls
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
        maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowId));
        closeBtn.addEventListener('click', () => this.closeWindow(windowId));

        // Focus on click
        window.addEventListener('mousedown', () => this.focusWindow(windowId));
    }

    focusWindow(windowId) {
        this.activeWindow = windowId;
        this.windows.forEach((win, id) => {
            win.element.style.zIndex = id === windowId ? this.windowZIndex++ : win.element.style.zIndex;
        });
        this.updateTaskbar();
    }

    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        window.element.classList.add('minimized');
        window.minimized = true;
        this.updateTaskbar();
    }

    toggleMaximize(windowId) {
        const window = this.windows.get(windowId).element;
        window.classList.toggle('maximized');
    }

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        window.element.remove();
        this.windows.delete(windowId);
        this.removeTaskbarItem(windowId);
    }

    addTaskbarItem(windowId, title, icon) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const button = document.createElement('button');
        button.className = 'taskbar-button';
        button.id = `taskbar-${windowId}`;
        button.innerHTML = `<i class="${icon}"></i><span>${title}</span>`;
        button.addEventListener('click', () => {
            const window = this.windows.get(windowId);
            if (window.minimized) {
                window.element.classList.remove('minimized');
                window.minimized = false;
                this.focusWindow(windowId);
            } else if (this.activeWindow === windowId) {
                this.minimizeWindow(windowId);
            } else {
                this.focusWindow(windowId);
            }
        });
        taskbarApps.appendChild(button);
        this.updateTaskbar();
    }

    removeTaskbarItem(windowId) {
        const button = document.getElementById(`taskbar-${windowId}`);
        if (button) button.remove();
    }

    updateTaskbar() {
        document.querySelectorAll('.taskbar-button[id^="taskbar-"]').forEach(btn => {
            btn.classList.remove('active');
        });
        if (this.activeWindow) {
            const activeBtn = document.getElementById(`taskbar-${this.activeWindow}`);
            if (activeBtn) activeBtn.classList.add('active');
        }
    }

    // Application: Text Editor
    createTextEditor() {
        const content = `
            <div class="text-editor-toolbar">
                <button class="toolbar-button" onclick="webOS.execCommand('bold')">
                    <i class="fas fa-bold"></i> Bold
                </button>
                <button class="toolbar-button" onclick="webOS.execCommand('italic')">
                    <i class="fas fa-italic"></i> Italic
                </button>
                <button class="toolbar-button" onclick="webOS.execCommand('underline')">
                    <i class="fas fa-underline"></i> Underline
                </button>
                <select class="toolbar-button" onchange="webOS.execCommand('fontSize', this.value)">
                    <option value="3" selected>Font Size</option>
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Huge</option>
                </select>
                <button class="toolbar-button" onclick="webOS.saveText()">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="toolbar-button" onclick="webOS.loadText()">
                    <i class="fas fa-folder-open"></i> Open
                </button>
            </div>
            <div class="text-editor-content">
                <div contenteditable="true" id="text-content" style="width: 100%; min-height: 400px; padding: 16px; outline: none; font-family: var(--font-primary); font-size: 14px; line-height: 1.6;">
                    Start typing here...
                </div>
            </div>
        `;
        this.createWindow('Text Editor', 'fas fa-file-alt', content);
    }

    execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    saveText() {
        const content = document.getElementById('text-content')?.innerHTML || '';
        const filename = prompt('Enter filename:', 'document.txt');
        if (filename) {
            this.fileSystem.Documents[filename] = content;
            this.saveFileSystem();
            alert('File saved successfully!');
        }
    }

    loadText() {
        const filename = prompt('Enter filename to open:');
        if (filename && this.fileSystem.Documents[filename]) {
            const content = document.getElementById('text-content');
            if (content) content.innerHTML = this.fileSystem.Documents[filename];
        } else {
            alert('File not found!');
        }
    }

    // Application: Terminal with Python Support
    createTerminal() {
        const content = `
            <div class="terminal-content" id="terminal-output">
                <div class="terminal-output">Windows 11 Web OS Terminal [Version 1.0.0]</div>
                <div class="terminal-output">(c) Windows 11 Web OS. All rights reserved.</div>
                <div class="terminal-output"></div>
                <div class="terminal-output">Type 'help' for available commands or 'python' to enter Python mode.</div>
                <div class="terminal-output"></div>
                <div class="terminal-input">
                    <span class="terminal-prompt">C:\\Users\\User></span>
                    <input type="text" id="terminal-input" autocomplete="off">
                </div>
            </div>
        `;
        const window = this.createWindow('Terminal', 'fas fa-terminal', content);
        
        setTimeout(() => {
            const input = document.getElementById('terminal-input');
            if (input) {
                input.focus();
                input.addEventListener('keydown', (e) => this.handleTerminalInput(e));
            }
        }, 100);
    }

    async handleTerminalInput(e) {
        if (e.key === 'Enter') {
            const input = e.target;
            const command = input.value.trim();
            const output = document.getElementById('terminal-output');
            
            // Display command
            const cmdDiv = document.createElement('div');
            cmdDiv.className = 'terminal-output';
            cmdDiv.innerHTML = `<span class="terminal-prompt">C:\\Users\\User></span> ${command}`;
            output.insertBefore(cmdDiv, output.querySelector('.terminal-input'));
            
            // Process command
            await this.processTerminalCommand(command, output);
            
            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    }

    async processTerminalCommand(command, output) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'terminal-output';
        
        switch (cmd) {
            case 'help':
                resultDiv.innerHTML = `
                    Available commands:<br>
                    help - Show this help message<br>
                    clear - Clear the terminal<br>
                    echo - Echo text<br>
                    dir - List directory contents<br>
                    date - Show current date<br>
                    time - Show current time<br>
                    python - Enter Python interactive mode<br>
                    calc - Basic calculator (e.g., calc 2 + 2)<br>
                `;
                break;
            case 'clear':
                while (output.firstChild && output.firstChild !== output.querySelector('.terminal-input')) {
                    output.removeChild(output.firstChild);
                }
                return;
            case 'echo':
                resultDiv.textContent = args.join(' ');
                break;
            case 'dir':
                const folders = Object.keys(this.fileSystem);
                resultDiv.innerHTML = folders.map(f => `<div>${f}/</div>`).join('');
                break;
            case 'date':
                resultDiv.textContent = new Date().toLocaleDateString();
                break;
            case 'time':
                resultDiv.textContent = new Date().toLocaleTimeString();
                break;
            case 'python':
                if (this.pyodide) {
                    const code = args.join(' ');
                    if (code) {
                        try {
                            const result = await this.pyodide.runPythonAsync(code);
                            resultDiv.textContent = result !== undefined ? String(result) : '';
                        } catch (error) {
                            resultDiv.textContent = `Error: ${error.message}`;
                            resultDiv.style.color = '#ff6b6b';
                        }
                    } else {
                        resultDiv.innerHTML = 'Python mode. Use: python &lt;code&gt;<br>Example: python print("Hello World")';
                    }
                } else {
                    resultDiv.textContent = 'Python is still loading... Please wait.';
                }
                break;
            case 'calc':
                try {
                    const expression = args.join(' ');
                    const result = eval(expression);
                    resultDiv.textContent = `= ${result}`;
                } catch (error) {
                    resultDiv.textContent = 'Invalid expression';
                }
                break;
            default:
                resultDiv.textContent = `'${cmd}' is not recognized as a command. Type 'help' for available commands.`;
                break;
        }
        
        output.insertBefore(resultDiv, output.querySelector('.terminal-input'));
    }

    // Application: Code Editor with Monaco
    createCodeEditor() {
        const content = `
            <div class="code-editor-toolbar">
                <select class="language-selector" id="language-selector">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="typescript">TypeScript</option>
                    <option value="json">JSON</option>
                </select>
                <button class="toolbar-button" onclick="webOS.runCode()">
                    <i class="fas fa-play"></i> Run
                </button>
                <button class="toolbar-button" onclick="webOS.saveCode()">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
            <div id="monaco-editor" style="height: calc(100% - 48px);"></div>
        `;
        const window = this.createWindow('Code Editor', 'fas fa-code', content, 1000, 700);
        
        setTimeout(() => {
            this.initMonaco();
        }, 100);
    }

    initMonaco() {
        if (typeof monaco !== 'undefined') {
            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
            require(['vs/editor/editor.main'], () => {
                this.monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
                    value: '// Write your code here\nconsole.log("Hello, World!");',
                    language: 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    minimap: { enabled: true }
                });
                
                const selector = document.getElementById('language-selector');
                if (selector) {
                    selector.addEventListener('change', (e) => {
                        monaco.editor.setModelLanguage(this.monacoEditor.getModel(), e.target.value);
                    });
                }
            });
        }
    }

    async runCode() {
        if (!this.monacoEditor) return;
        
        const code = this.monacoEditor.getValue();
        const language = document.getElementById('language-selector')?.value || 'javascript';
        
        if (language === 'javascript') {
            try {
                const result = eval(code);
                console.log('Result:', result);
                alert(`Code executed! Check console for output.`);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        } else if (language === 'python' && this.pyodide) {
            try {
                const result = await this.pyodide.runPythonAsync(code);
                alert(`Result: ${result !== undefined ? result : 'Code executed successfully'}`);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        } else {
            alert(`Running ${language} code is not supported yet.`);
        }
    }

    saveCode() {
        if (!this.monacoEditor) return;
        const code = this.monacoEditor.getValue();
        const filename = prompt('Enter filename:', 'script.js');
        if (filename) {
            this.fileSystem.Documents[filename] = code;
            this.saveFileSystem();
            alert('Code saved successfully!');
        }
    }

    // Application: File Manager
    createFileManager() {
        const content = `
            <div class="file-manager-toolbar">
                <button class="toolbar-button" onclick="webOS.createNewFolder()">
                    <i class="fas fa-folder-plus"></i> New Folder
                </button>
                <button class="toolbar-button" onclick="webOS.createNewFile()">
                    <i class="fas fa-file-plus"></i> New File
                </button>
                <button class="toolbar-button" onclick="webOS.refreshFileManager()">
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>
            <div class="file-manager-content">
                <div class="file-sidebar">
                    <div style="padding: 8px; font-weight: 600; border-bottom: 1px solid var(--border);">Quick Access</div>
                    ${Object.keys(this.fileSystem).map(folder => `
                        <div class="file-item" onclick="webOS.openFolder('${folder}')" style="flex-direction: row; padding: 8px;">
                            <i class="fas fa-folder" style="font-size: 16px; margin-right: 8px;"></i>
                            <span style="font-size: 13px;">${folder}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="file-main" id="file-main-content">
                    <h3 style="margin-bottom: 16px;">Quick Access</h3>
                    <div class="file-grid" id="file-grid">
                        ${this.renderFileGrid()}
                    </div>
                </div>
            </div>
        `;
        this.createWindow('File Manager', 'fas fa-folder', content, 900, 600);
    }

    renderFileGrid() {
        let html = '';
        for (const [folder, contents] of Object.entries(this.fileSystem)) {
            html += `
                <div class="file-item" ondblclick="webOS.openFolder('${folder}')">
                    <i class="fas fa-folder"></i>
                    <span>${folder}</span>
                </div>
            `;
        }
        return html;
    }

    openFolder(folderName) {
        const mainContent = document.getElementById('file-main-content');
        if (!mainContent) return;
        
        const contents = this.fileSystem[folderName];
        let filesHtml = '';
        
        for (const [filename, content] of Object.entries(contents)) {
            filesHtml += `
                <div class="file-item" ondblclick="webOS.openFile('${folderName}', '${filename}')">
                    <i class="fas fa-file-alt"></i>
                    <span>${filename}</span>
                </div>
            `;
        }
        
        mainContent.innerHTML = `
            <div style="margin-bottom: 16px;">
                <button class="toolbar-button" onclick="webOS.refreshFileManager()">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
                <h3 style="display: inline; margin-left: 16px;">${folderName}</h3>
            </div>
            <div class="file-grid">
                ${filesHtml || '<p>This folder is empty.</p>'}
            </div>
        `;
    }

    openFile(folder, filename) {
        const content = this.fileSystem[folder][filename];
        alert(`Opening ${filename}\n\nContent:\n${content.substring(0, 200)}${content.length > 200 ? '...' : ''}`);
    }

    createNewFolder() {
        const name = prompt('Enter folder name:');
        if (name && !this.fileSystem[name]) {
            this.fileSystem[name] = {};
            this.saveFileSystem();
            this.refreshFileManager();
        }
    }

    createNewFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.fileSystem.Documents[name] = '';
            this.saveFileSystem();
            alert('File created in Documents folder!');
        }
    }

    refreshFileManager() {
        const fileGrid = document.getElementById('file-grid');
        const mainContent = document.getElementById('file-main-content');
        if (fileGrid && mainContent) {
            mainContent.innerHTML = `
                <h3 style="margin-bottom: 16px;">Quick Access</h3>
                <div class="file-grid" id="file-grid">
                    ${this.renderFileGrid()}
                </div>
            `;
        }
    }

    // Application: Browser
    createBrowser() {
        const content = `
            <div class="browser-toolbar">
                <button class="toolbar-button" onclick="webOS.browserBack()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <button class="toolbar-button" onclick="webOS.browserForward()">
                    <i class="fas fa-arrow-right"></i>
                </button>
                <button class="toolbar-button" onclick="webOS.browserRefresh()">
                    <i class="fas fa-sync"></i>
                </button>
                <input type="text" class="browser-url" id="browser-url" placeholder="Enter URL or search..." value="https://www.example.com">
                <button class="toolbar-button" onclick="webOS.browserGo()">
                    <i class="fas fa-arrow-right"></i> Go
                </button>
            </div>
            <div class="browser-content">
                <iframe id="browser-frame" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;
        const window = this.createWindow('Browser', 'fas fa-globe', content, 1000, 700);
        
        setTimeout(() => {
            const urlInput = document.getElementById('browser-url');
            if (urlInput) {
                urlInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.browserGo();
                });
            }
        }, 100);
    }

    browserGo() {
        const url = document.getElementById('browser-url')?.value;
        const frame = document.getElementById('browser-frame');
        if (url && frame) {
            try {
                let finalUrl = url;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    finalUrl = 'https://' + url;
                }
                frame.src = finalUrl;
            } catch (error) {
                alert('Failed to load URL: ' + error.message);
            }
        }
    }

    browserBack() {
        const frame = document.getElementById('browser-frame');
        if (frame && frame.contentWindow) {
            frame.contentWindow.history.back();
        }
    }

    browserForward() {
        const frame = document.getElementById('browser-frame');
        if (frame && frame.contentWindow) {
            frame.contentWindow.history.forward();
        }
    }

    browserRefresh() {
        const frame = document.getElementById('browser-frame');
        if (frame) {
            frame.src = frame.src;
        }
    }

    // Application: Paint
    createPaint() {
        const content = `
            <div class="paint-toolbar">
                <button class="toolbar-button" onclick="webOS.setPaintTool('brush')">
                    <i class="fas fa-paint-brush"></i> Brush
                </button>
                <button class="toolbar-button" onclick="webOS.setPaintTool('eraser')">
                    <i class="fas fa-eraser"></i> Eraser
                </button>
                <input type="color" class="color-picker" id="paint-color" value="#000000">
                <input type="range" class="brush-size" id="brush-size" min="1" max="50" value="5">
                <button class="toolbar-button" onclick="webOS.clearCanvas()">
                    <i class="fas fa-trash"></i> Clear
                </button>
                <button class="toolbar-button" onclick="webOS.saveCanvas()">
                    <i class="fas fa-save"></i> Save
                </button>
            </div>
            <canvas class="paint-canvas" id="paint-canvas" width="800" height="500"></canvas>
        `;
        const window = this.createWindow('Paint', 'fas fa-paint-brush', content, 850, 650);
        
        setTimeout(() => {
            this.initPaint();
        }, 100);
    }

    initPaint() {
        const canvas = document.getElementById('paint-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentTool = 'brush';
        
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const color = document.getElementById('paint-color')?.value || '#000000';
            const size = document.getElementById('brush-size')?.value || 5;
            
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : color;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        });
        
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });
        
        this.paintContext = { ctx, currentTool: 'brush' };
    }

    setPaintTool(tool) {
        if (this.paintContext) {
            this.paintContext.currentTool = tool;
        }
    }

    clearCanvas() {
        const canvas = document.getElementById('paint-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    saveCanvas() {
        const canvas = document.getElementById('paint-canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'painting.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    }

    // Application: Video Editor
    createVideoEditor() {
        const content = `
            <div class="video-editor-toolbar">
                <button class="toolbar-button" onclick="webOS.importVideo()">
                    <i class="fas fa-file-import"></i> Import
                </button>
                <button class="toolbar-button" onclick="webOS.playVideo()">
                    <i class="fas fa-play"></i> Play
                </button>
                <button class="toolbar-button" onclick="webOS.pauseVideo()">
                    <i class="fas fa-pause"></i> Pause
                </button>
                <button class="toolbar-button" onclick="webOS.addVideoEffect()">
                    <i class="fas fa-magic"></i> Add Effect
                </button>
                <button class="toolbar-button" onclick="webOS.exportVideo()">
                    <i class="fas fa-file-export"></i> Export
                </button>
            </div>
            <div style="display: flex; flex-direction: column; height: calc(100% - 48px);">
                <div class="video-preview">
                    <video id="video-preview" style="max-width: 100%; max-height: 100%;" controls>
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div class="video-timeline">
                    <div class="timeline-tracks">
                        <div class="timeline-track">
                            <div class="timeline-clip" style="left: 0; width: 30%;">Video Clip 1</div>
                        </div>
                        <div class="timeline-track">
                            <div class="timeline-clip" style="left: 10%; width: 40%; background: var(--accent);">Audio Track</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.createWindow('Video Editor', 'fas fa-film', content, 1000, 700);
    }

    importVideo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const video = document.getElementById('video-preview');
                if (video) video.src = url;
            }
        };
        input.click();
    }

    playVideo() {
        const video = document.getElementById('video-preview');
        if (video) video.play();
    }

    pauseVideo() {
        const video = document.getElementById('video-preview');
        if (video) video.pause();
    }

    addVideoEffect() {
        alert('Video effects: Blur, Brightness, Contrast, Saturation\n(Demo mode - effects not implemented)');
    }

    exportVideo() {
        alert('Video will be exported as MP4\n(Demo mode - export not implemented)');
    }

    // Application: Media Player
    createMediaPlayer() {
        const content = `
            <div class="media-player-content">
                <div class="media-display">
                    <video id="media-video" style="max-width: 100%; max-height: 100%; display: none;"></video>
                    <audio id="media-audio" style="display: none;"></audio>
                    <div id="media-placeholder" style="color: white; font-size: 64px;">
                        <i class="fas fa-music"></i>
                    </div>
                </div>
                <div class="media-controls">
                    <button onclick="webOS.openMedia()"><i class="fas fa-folder-open"></i></button>
                    <button onclick="webOS.playMedia()"><i class="fas fa-play"></i></button>
                    <button onclick="webOS.pauseMedia()"><i class="fas fa-pause"></i></button>
                    <button onclick="webOS.stopMedia()"><i class="fas fa-stop"></i></button>
                    <div class="media-progress" onclick="webOS.seekMedia(event)">
                        <div class="media-progress-bar" id="media-progress-bar"></div>
                    </div>
                    <button onclick="webOS.toggleMute()"><i class="fas fa-volume-up"></i></button>
                </div>
            </div>
        `;
        this.createWindow('Media Player', 'fas fa-play-circle', content, 800, 600);
    }

    openMedia() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,audio/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const isVideo = file.type.startsWith('video');
                const video = document.getElementById('media-video');
                const audio = document.getElementById('media-audio');
                const placeholder = document.getElementById('media-placeholder');
                
                if (isVideo && video) {
                    video.src = url;
                    video.style.display = 'block';
                    if (audio) audio.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'none';
                } else if (audio) {
                    audio.src = url;
                    audio.style.display = 'block';
                    if (video) video.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'flex';
                }
            }
        };
        input.click();
    }

    playMedia() {
        const video = document.getElementById('media-video');
        const audio = document.getElementById('media-audio');
        if (video && video.src) video.play();
        else if (audio && audio.src) audio.play();
    }

    pauseMedia() {
        const video = document.getElementById('media-video');
        const audio = document.getElementById('media-audio');
        if (video) video.pause();
        if (audio) audio.pause();
    }

    stopMedia() {
        const video = document.getElementById('media-video');
        const audio = document.getElementById('media-audio');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    seekMedia(event) {
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        
        const video = document.getElementById('media-video');
        const audio = document.getElementById('media-audio');
        
        if (video && video.duration) {
            video.currentTime = video.duration * percent;
        } else if (audio && audio.duration) {
            audio.currentTime = audio.duration * percent;
        }
    }

    toggleMute() {
        const video = document.getElementById('media-video');
        const audio = document.getElementById('media-audio');
        if (video) video.muted = !video.muted;
        if (audio) audio.muted = !audio.muted;
    }

    // Application: Game Center
    createGameCenter() {
        const content = `
            <div style="padding: 24px;">
                <h2 style="margin-bottom: 24px;">Game Center</h2>
                <div class="game-grid">
                    <div class="game-card" onclick="webOS.playGame('snake')">
                        <i class="fas fa-gamepad"></i>
                        <h3>Snake</h3>
                        <p>Classic snake game</p>
                    </div>
                    <div class="game-card" onclick="webOS.playGame('pong')">
                        <i class="fas fa-table-tennis"></i>
                        <h3>Pong</h3>
                        <p>Retro pong game</p>
                    </div>
                    <div class="game-card" onclick="webOS.playGame('tetris')">
                        <i class="fas fa-th"></i>
                        <h3>Tetris</h3>
                        <p>Block puzzle game</p>
                    </div>
                    <div class="game-card" onclick="webOS.playGame('memory')">
                        <i class="fas fa-brain"></i>
                        <h3>Memory</h3>
                        <p>Card matching game</p>
                    </div>
                </div>
            </div>
        `;
        this.createWindow('Game Center', 'fas fa-gamepad', content, 700, 500);
    }

    playGame(gameName) {
        const games = {
            'snake': this.createSnakeGame(),
            'pong': this.createPongGame(),
            'tetris': alert('Tetris - Coming Soon!'),
            'memory': alert('Memory Game - Coming Soon!')
        };
    }

    createSnakeGame() {
        const content = `
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px; background: #000;">
                <div style="color: white; margin-bottom: 10px; font-size: 20px;">
                    Score: <span id="snake-score">0</span>
                </div>
                <canvas id="snake-canvas" width="400" height="400" style="border: 2px solid white;"></canvas>
                <div style="color: white; margin-top: 10px;">Use Arrow Keys to Move</div>
            </div>
        `;
        const window = this.createWindow('Snake Game', 'fas fa-gamepad', content, 500, 550);
        
        setTimeout(() => {
            this.initSnakeGame();
        }, 100);
    }

    initSnakeGame() {
        const canvas = document.getElementById('snake-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const box = 20;
        let snake = [{ x: 10 * box, y: 10 * box }];
        let direction = 'RIGHT';
        let food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        let score = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
            else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
            else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
            else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
        });
        
        const gameLoop = setInterval(() => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw snake
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = i === 0 ? '#00ff00' : '#00cc00';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
            }
            
            // Draw food
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(food.x, food.y, box, box);
            
            // Move snake
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;
            
            if (direction === 'LEFT') snakeX -= box;
            if (direction === 'UP') snakeY -= box;
            if (direction === 'RIGHT') snakeX += box;
            if (direction === 'DOWN') snakeY += box;
            
            // Check if snake eats food
            if (snakeX === food.x && snakeY === food.y) {
                score++;
                const scoreEl = document.getElementById('snake-score');
                if (scoreEl) scoreEl.textContent = score;
                food = {
                    x: Math.floor(Math.random() * 19 + 1) * box,
                    y: Math.floor(Math.random() * 19 + 1) * box
                };
            } else {
                snake.pop();
            }
            
            const newHead = { x: snakeX, y: snakeY };
            
            // Check collision
            if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || 
                snake.some(segment => segment.x === snakeX && segment.y === snakeY)) {
                clearInterval(gameLoop);
                alert(`Game Over! Your score: ${score}`);
                return;
            }
            
            snake.unshift(newHead);
        }, 100);
    }

    createPongGame() {
        const content = `
            <div style="display: flex; flex-direction: column; align-items: center; padding: 20px; background: #000;">
                <div style="color: white; margin-bottom: 10px; font-size: 20px;">
                    Player: <span id="pong-score-player">0</span> | CPU: <span id="pong-score-cpu">0</span>
                </div>
                <canvas id="pong-canvas" width="600" height="400" style="border: 2px solid white;"></canvas>
                <div style="color: white; margin-top: 10px;">Use Mouse to Move Paddle</div>
            </div>
        `;
        const window = this.createWindow('Pong Game', 'fas fa-table-tennis', content, 700, 550);
        
        setTimeout(() => {
            this.initPongGame();
        }, 100);
    }

    initPongGame() {
        const canvas = document.getElementById('pong-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const paddle = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80 };
        const cpuPaddle = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80 };
        const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 7, dx: 4, dy: 4 };
        let playerScore = 0;
        let cpuScore = 0;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            paddle.y = e.clientY - rect.top - paddle.height / 2;
        });
        
        const gameLoop = setInterval(() => {
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw center line
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw paddles
            ctx.fillStyle = '#fff';
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
            ctx.fillRect(cpuPaddle.x, cpuPaddle.y, cpuPaddle.width, cpuPaddle.height);
            
            // Draw ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move ball
            ball.x += ball.dx;
            ball.y += ball.dy;
            
            // Ball collision with top/bottom
            if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                ball.dy *= -1;
            }
            
            // Ball collision with paddles
            if (ball.x - ball.radius < paddle.x + paddle.width && 
                ball.y > paddle.y && ball.y < paddle.y + paddle.height) {
                ball.dx *= -1;
            }
            
            if (ball.x + ball.radius > cpuPaddle.x && 
                ball.y > cpuPaddle.y && ball.y < cpuPaddle.y + cpuPaddle.height) {
                ball.dx *= -1;
            }
            
            // Score points
            if (ball.x - ball.radius < 0) {
                cpuScore++;
                document.getElementById('pong-score-cpu').textContent = cpuScore;
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
            }
            
            if (ball.x + ball.radius > canvas.width) {
                playerScore++;
                document.getElementById('pong-score-player').textContent = playerScore;
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
            }
            
            // CPU AI
            if (cpuPaddle.y + cpuPaddle.height / 2 < ball.y) {
                cpuPaddle.y += 3;
            } else {
                cpuPaddle.y -= 3;
            }
        }, 1000 / 60);
    }

    // Application: Calculator
    createCalculator() {
        const content = `
            <div style="background: #f0f0f0;">
                <div class="calculator-display" id="calc-display">0</div>
                <div class="calculator-buttons">
                    ${['C', '÷', '×', '←', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'].map(btn => 
                        `<button class="calculator-button ${['÷', '×', '-', '+', '='].includes(btn) ? 'operator' : ''}" 
                                 onclick="webOS.calculatorInput('${btn}')">${btn}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        this.createWindow('Calculator', 'fas fa-calculator', content, 350, 500);
        this.calcState = { current: '0', previous: '', operator: null };
    }

    calculatorInput(value) {
        if (!this.calcState) this.calcState = { current: '0', previous: '', operator: null };
        
        const display = document.getElementById('calc-display');
        if (!display) return;
        
        if (value === 'C') {
            this.calcState = { current: '0', previous: '', operator: null };
            display.textContent = '0';
        } else if (value === '←') {
            this.calcState.current = this.calcState.current.slice(0, -1) || '0';
            display.textContent = this.calcState.current;
        } else if (['+', '-', '×', '÷'].includes(value)) {
            this.calcState.previous = this.calcState.current;
            this.calcState.current = '0';
            this.calcState.operator = value;
        } else if (value === '=') {
            if (this.calcState.operator && this.calcState.previous) {
                const prev = parseFloat(this.calcState.previous);
                const curr = parseFloat(this.calcState.current);
                let result = 0;
                
                switch (this.calcState.operator) {
                    case '+': result = prev + curr; break;
                    case '-': result = prev - curr; break;
                    case '×': result = prev * curr; break;
                    case '÷': result = prev / curr; break;
                }
                
                this.calcState.current = result.toString();
                this.calcState.previous = '';
                this.calcState.operator = null;
                display.textContent = result;
            }
        } else {
            if (this.calcState.current === '0') {
                this.calcState.current = value;
            } else {
                this.calcState.current += value;
            }
            display.textContent = this.calcState.current;
        }
    }

    // Application: Settings
    createSettings() {
        const content = `
            <div style="padding: 24px;">
                <h2 style="margin-bottom: 24px;">Settings</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="padding: 16px; background: rgba(255,255,255,0.8); border-radius: 8px;">
                        <h3 style="margin-bottom: 12px;">Display</h3>
                        <label style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <input type="checkbox" onchange="webOS.toggleDarkMode(this.checked)">
                            <span>Dark Mode</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px;">
                            <span>Wallpaper:</span>
                            <input type="color" value="#667eea" onchange="webOS.changeWallpaper(this.value)">
                        </label>
                    </div>
                    <div style="padding: 16px; background: rgba(255,255,255,0.8); border-radius: 8px;">
                        <h3 style="margin-bottom: 12px;">System</h3>
                        <p style="font-size: 13px; color: var(--text-secondary);">Windows 11 Web OS v1.0.0</p>
                        <p style="font-size: 13px; color: var(--text-secondary);">© 2024 Web OS Project</p>
                    </div>
                    <div style="padding: 16px; background: rgba(255,255,255,0.8); border-radius: 8px;">
                        <h3 style="margin-bottom: 12px;">Storage</h3>
                        <button class="toolbar-button" onclick="webOS.clearStorage()">
                            <i class="fas fa-trash"></i> Clear All Data
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.createWindow('Settings', 'fas fa-cog', content, 600, 500);
    }

    toggleDarkMode(enabled) {
        if (enabled) {
            document.documentElement.style.setProperty('--background', '#1F1F1F');
            document.documentElement.style.setProperty('--window-bg', 'rgba(31, 31, 31, 0.95)');
            document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
        } else {
            document.documentElement.style.setProperty('--background', '#F3F3F3');
            document.documentElement.style.setProperty('--window-bg', 'rgba(243, 243, 243, 0.95)');
            document.documentElement.style.setProperty('--text-primary', '#1F1F1F');
        }
    }

    changeWallpaper(color) {
        document.getElementById('desktop').style.background = `linear-gradient(135deg, ${color} 0%, #764ba2 100%)`;
    }

    clearStorage() {
        if (confirm('This will clear all your files and settings. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }

    // Application: App Store
    createAppStore() {
        const content = `
            <div class="app-store-content" style="padding: 24px;">
                <h2 class="app-store-header">App Store</h2>
                <div class="app-store-grid">
                    <div class="store-app-card">
                        <div class="store-app-header">
                            <div class="store-app-icon"><i class="fab fa-microsoft"></i></div>
                            <div class="store-app-info">
                                <h3>VS Code (Web)</h3>
                                <p>Microsoft Corporation</p>
                            </div>
                        </div>
                        <p class="store-app-description">
                            Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.
                        </p>
                        <button class="store-download-button" onclick="window.open('https://vscode.dev', '_blank')">
                            Open VS Code Web
                        </button>
                    </div>
                    
                    <div class="store-app-card">
                        <div class="store-app-header">
                            <div class="store-app-icon"><i class="fab fa-python"></i></div>
                            <div class="store-app-info">
                                <h3>Python.org</h3>
                                <p>Python Software Foundation</p>
                            </div>
                        </div>
                        <p class="store-app-description">
                            Download and install the official Python programming language from python.org.
                        </p>
                        <button class="store-download-button" onclick="window.open('https://www.python.org/downloads/', '_blank')">
                            Visit Python.org
                        </button>
                    </div>
                    
                    <div class="store-app-card">
                        <div class="store-app-header">
                            <div class="store-app-icon"><i class="fas fa-code"></i></div>
                            <div class="store-app-info">
                                <h3>PyCharm</h3>
                                <p>JetBrains</p>
                            </div>
                        </div>
                        <p class="store-app-description">
                            The Python IDE for Professional Developers. Download PyCharm from JetBrains official website.
                        </p>
                        <button class="store-download-button" onclick="window.open('https://www.jetbrains.com/pycharm/download/', '_blank')">
                            Visit JetBrains
                        </button>
                    </div>
                    
                    <div class="store-app-card">
                        <div class="store-app-header">
                            <div class="store-app-icon"><i class="fab fa-github"></i></div>
                            <div class="store-app-info">
                                <h3>GitHub Desktop</h3>
                                <p>GitHub, Inc.</p>
                            </div>
                        </div>
                        <p class="store-app-description">
                            Focus on what matters instead of fighting with Git. Whether you're new to Git or a seasoned user, GitHub Desktop simplifies your development workflow.
                        </p>
                        <button class="store-download-button" onclick="window.open('https://desktop.github.com/', '_blank')">
                            Visit GitHub
                        </button>
                    </div>
                    
                    <div class="store-app-card">
                        <div class="store-app-header">
                            <div class="store-app-icon"><i class="fab fa-node-js"></i></div>
                            <div class="store-app-info">
                                <h3>Node.js</h3>
                                <p>OpenJS Foundation</p>
                            </div>
                        </div>
                        <p class="store-app-description">
                            Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Download from the official website.
                        </p>
                        <button class="store-download-button" onclick="window.open('https://nodejs.org/', '_blank')">
                            Visit Node.js
                        </button>
                    </div>
                    
                    <div class="store-app-card">
                        <div class="store-app-header">
                            <div class="store-app-icon"><i class="fas fa-database"></i></div>
                            <div class="store-app-info">
                                <h3>MongoDB Compass</h3>
                                <p>MongoDB, Inc.</p>
                            </div>
                        </div>
                        <p class="store-app-description">
                            The GUI for MongoDB. Visually explore your data. Run ad hoc queries in seconds.
                        </p>
                        <button class="store-download-button" onclick="window.open('https://www.mongodb.com/products/compass', '_blank')">
                            Visit MongoDB
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.createWindow('App Store', 'fas fa-store', content, 900, 700);
    }
}

// Initialize the Web OS
const webOS = new WebOS();
