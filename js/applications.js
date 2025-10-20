// Application Management System
class ApplicationManager {
    constructor(webOS) {
        this.webOS = webOS;
        this.applications = new Map();
        this.init();
    }

    init() {
        this.registerApplications();
        this.setupAppEventListeners();
    }

    registerApplications() {
        // Register all available applications
        this.registerApp('file-manager', FileManagerApp);
        this.registerApp('browser', BrowserApp);
        this.registerApp('text-editor', TextEditorApp);
        this.registerApp('code-editor', CodeEditorApp);
        this.registerApp('terminal', TerminalApp);
        this.registerApp('paint', PaintApp);
        this.registerApp('video-editor', VideoEditorApp);
        this.registerApp('games', GamesApp);
        this.registerApp('settings', SettingsApp);
    }

    registerApp(name, AppClass) {
        this.applications.set(name, AppClass);
    }

    setupAppEventListeners() {
        // Handle app-specific events
        document.addEventListener('click', (e) => {
            const appButton = e.target.closest('[data-app]');
            if (appButton) {
                const appName = appButton.dataset.app;
                this.launchApp(appName);
            }
        });
    }

    launchApp(appName, options = {}) {
        const AppClass = this.applications.get(appName);
        if (!AppClass) {
            this.webOS.showNotification('Error', `Application ${appName} not found`);
            return;
        }

        const app = new AppClass(this.webOS, options);
        return app;
    }
}

// Base Application Class
class BaseApp {
    constructor(webOS, options = {}) {
        this.webOS = webOS;
        this.options = options;
        this.window = null;
        this.isRunning = false;
        this.init();
    }

    init() {
        this.createWindow();
        this.setupEventListeners();
        this.isRunning = true;
    }

    createWindow() {
        const config = this.getConfig();
        this.window = this.webOS.createWindow({
            ...config,
            ...this.options
        });
    }

    getConfig() {
        return {
            title: 'Application',
            content: '<div>Application content</div>',
            width: '800px',
            height: '600px'
        };
    }

    setupEventListeners() {
        // Override in subclasses
    }

    close() {
        if (this.window) {
            this.webOS.closeWindow(this.window);
        }
        this.isRunning = false;
    }

    focus() {
        if (this.window) {
            this.webOS.focusWindow(this.window);
        }
    }
}

// File Manager Application
class FileManagerApp extends BaseApp {
    getConfig() {
        return {
            title: 'File Manager',
            content: this.getFileManagerHTML(),
            width: '900px',
            height: '600px',
            app: 'file-manager'
        };
    }

    getFileManagerHTML() {
        return `
            <div class="file-manager">
                <div class="file-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-title">Quick Access</div>
                        <div class="sidebar-item active" data-path="home">
                            <span class="icon">🏠</span>Home
                        </div>
                        <div class="sidebar-item" data-path="documents">
                            <span class="icon">📁</span>Documents
                        </div>
                        <div class="sidebar-item" data-path="pictures">
                            <span class="icon">🖼️</span>Pictures
                        </div>
                        <div class="sidebar-item" data-path="music">
                            <span class="icon">🎵</span>Music
                        </div>
                        <div class="sidebar-item" data-path="videos">
                            <span class="icon">🎬</span>Videos
                        </div>
                        <div class="sidebar-item" data-path="downloads">
                            <span class="icon">💾</span>Downloads
                        </div>
                    </div>
                    <div class="sidebar-section">
                        <div class="sidebar-title">This PC</div>
                        <div class="sidebar-item" data-path="c">
                            <span class="icon">💿</span>Local Disk (C:)
                        </div>
                        <div class="sidebar-item" data-path="d">
                            <span class="icon">💿</span>Local Disk (D:)
                        </div>
                    </div>
                </div>
                <div class="file-content">
                    <div class="file-toolbar">
                        <button class="toolbar-button" data-action="back">← Back</button>
                        <button class="toolbar-button" data-action="forward">Forward →</button>
                        <button class="toolbar-button" data-action="up">↑ Up</button>
                        <div class="toolbar-separator"></div>
                        <button class="toolbar-button" data-action="new-folder">📁 New Folder</button>
                        <button class="toolbar-button" data-action="new-file">📄 New File</button>
                        <div class="toolbar-separator"></div>
                        <button class="toolbar-button" data-action="view-grid">⊞ Grid View</button>
                        <button class="toolbar-button" data-action="view-list">☰ List View</button>
                    </div>
                    <div class="file-path">
                        <div class="path-item">🏠</div>
                        <div class="path-separator">></div>
                        <div class="path-item">Home</div>
                    </div>
                    <div class="file-grid" id="file-grid">
                        <!-- Files will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            // Sidebar navigation
            content.addEventListener('click', (e) => {
                const sidebarItem = e.target.closest('.sidebar-item');
                if (sidebarItem) {
                    this.navigateToPath(sidebarItem.dataset.path);
                }
            });
            
            // Toolbar actions
            content.addEventListener('click', (e) => {
                const button = e.target.closest('.toolbar-button');
                if (button) {
                    this.handleToolbarAction(button.dataset.action);
                }
            });
            
            // File grid interactions
            content.addEventListener('click', (e) => {
                const fileItem = e.target.closest('.file-item');
                if (fileItem) {
                    this.handleFileClick(fileItem);
                }
            });
        }
    }

    navigateToPath(path) {
        this.currentPath = path;
        this.loadDirectory(path);
        this.updateSidebarSelection(path);
    }

    loadDirectory(path) {
        const fileGrid = this.window.querySelector('#file-grid');
        const files = this.getFilesForPath(path);
        
        fileGrid.innerHTML = files.map(file => `
            <div class="file-item" data-type="${file.type}" data-name="${file.name}">
                <div class="file-icon">${file.icon}</div>
                <div class="file-name">${file.name}</div>
            </div>
        `).join('');
    }

    getFilesForPath(path) {
        const fileData = {
            home: [
                { name: 'Documents', type: 'folder', icon: '📁' },
                { name: 'Pictures', type: 'folder', icon: '🖼️' },
                { name: 'Music', type: 'folder', icon: '🎵' },
                { name: 'Videos', type: 'folder', icon: '🎬' },
                { name: 'Downloads', type: 'folder', icon: '💾' },
                { name: 'Desktop', type: 'folder', icon: '🖥️' },
                { name: 'readme.txt', type: 'file', icon: '📄' },
                { name: 'notes.md', type: 'file', icon: '📝' }
            ],
            documents: [
                { name: 'Work', type: 'folder', icon: '📁' },
                { name: 'Personal', type: 'folder', icon: '📁' },
                { name: 'report.pdf', type: 'file', icon: '📄' },
                { name: 'presentation.pptx', type: 'file', icon: '📊' }
            ],
            pictures: [
                { name: 'Vacation', type: 'folder', icon: '📁' },
                { name: 'Screenshots', type: 'folder', icon: '📁' },
                { name: 'photo1.jpg', type: 'file', icon: '🖼️' },
                { name: 'photo2.png', type: 'file', icon: '🖼️' }
            ]
        };
        
        return fileData[path] || [];
    }

    updateSidebarSelection(path) {
        const sidebarItems = this.window.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.path === path) {
                item.classList.add('active');
            }
        });
    }

    handleToolbarAction(action) {
        switch (action) {
            case 'back':
                this.webOS.showNotification('File Manager', 'Back button clicked');
                break;
            case 'forward':
                this.webOS.showNotification('File Manager', 'Forward button clicked');
                break;
            case 'up':
                this.webOS.showNotification('File Manager', 'Up button clicked');
                break;
            case 'new-folder':
                this.createNewFolder();
                break;
            case 'new-file':
                this.createNewFile();
                break;
            case 'view-grid':
                this.setViewMode('grid');
                break;
            case 'view-list':
                this.setViewMode('list');
                break;
        }
    }

    handleFileClick(fileItem) {
        const type = fileItem.dataset.type;
        const name = fileItem.dataset.name;
        
        if (type === 'folder') {
            this.navigateToPath(name.toLowerCase());
        } else {
            this.openFile(name);
        }
    }

    createNewFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            this.webOS.showNotification('File Manager', `Created folder: ${name}`);
        }
    }

    createNewFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.webOS.showNotification('File Manager', `Created file: ${name}`);
        }
    }

    openFile(filename) {
        this.webOS.showNotification('File Manager', `Opening file: ${filename}`);
    }

    setViewMode(mode) {
        const fileGrid = this.window.querySelector('#file-grid');
        fileGrid.className = `file-grid view-${mode}`;
    }
}

// Browser Application
class BrowserApp extends BaseApp {
    getConfig() {
        return {
            title: 'Browser',
            content: this.getBrowserHTML(),
            width: '1000px',
            height: '700px',
            app: 'browser'
        };
    }

    getBrowserHTML() {
        return `
            <div class="browser-content">
                <div class="browser-toolbar">
                    <div class="browser-nav">
                        <button class="nav-button" data-action="back" title="Back">←</button>
                        <button class="nav-button" data-action="forward" title="Forward">→</button>
                        <button class="nav-button" data-action="refresh" title="Refresh">↻</button>
                        <button class="nav-button" data-action="home" title="Home">🏠</button>
                    </div>
                    <input type="text" class="browser-address" placeholder="Search or enter address" value="https://www.google.com">
                    <button class="nav-button" data-action="go" title="Go">→</button>
                </div>
                <iframe class="browser-view" src="https://www.google.com"></iframe>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const button = e.target.closest('.nav-button');
                if (button) {
                    this.handleNavigation(button.dataset.action);
                }
            });
            
            const addressBar = content.querySelector('.browser-address');
            addressBar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.navigateToAddress(addressBar.value);
                }
            });
        }
    }

    handleNavigation(action) {
        const iframe = this.window.querySelector('.browser-view');
        
        switch (action) {
            case 'back':
                iframe.contentWindow.history.back();
                break;
            case 'forward':
                iframe.contentWindow.history.forward();
                break;
            case 'refresh':
                iframe.src = iframe.src;
                break;
            case 'home':
                this.navigateToAddress('https://www.google.com');
                break;
            case 'go':
                const addressBar = this.window.querySelector('.browser-address');
                this.navigateToAddress(addressBar.value);
                break;
        }
    }

    navigateToAddress(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const iframe = this.window.querySelector('.browser-view');
        iframe.src = url;
        
        const addressBar = this.window.querySelector('.browser-address');
        addressBar.value = url;
    }
}

// Text Editor Application
class TextEditorApp extends BaseApp {
    getConfig() {
        return {
            title: 'Text Editor',
            content: this.getTextEditorHTML(),
            width: '800px',
            height: '600px',
            app: 'text-editor'
        };
    }

    getTextEditorHTML() {
        return `
            <div class="text-editor-content">
                <div class="editor-toolbar">
                    <button class="toolbar-button" data-action="new">📄 New</button>
                    <button class="toolbar-button" data-action="open">📂 Open</button>
                    <button class="toolbar-button" data-action="save">💾 Save</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="undo">↶ Undo</button>
                    <button class="toolbar-button" data-action="redo">↷ Redo</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="cut">✂️ Cut</button>
                    <button class="toolbar-button" data-action="copy">📋 Copy</button>
                    <button class="toolbar-button" data-action="paste">📌 Paste</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="find">🔍 Find</button>
                    <button class="toolbar-button" data-action="replace">🔄 Replace</button>
                </div>
                <textarea class="editor-textarea" placeholder="Start typing..."></textarea>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const button = e.target.closest('.toolbar-button');
                if (button) {
                    this.handleToolbarAction(button.dataset.action);
                }
            });
            
            const textarea = content.querySelector('.editor-textarea');
            textarea.addEventListener('input', () => {
                this.updateDocumentTitle();
            });
        }
    }

    handleToolbarAction(action) {
        const textarea = this.window.querySelector('.editor-textarea');
        
        switch (action) {
            case 'new':
                if (textarea.value && !confirm('Save changes?')) return;
                textarea.value = '';
                this.updateDocumentTitle();
                break;
            case 'open':
                this.openFile();
                break;
            case 'save':
                this.saveFile();
                break;
            case 'undo':
                document.execCommand('undo');
                break;
            case 'redo':
                document.execCommand('redo');
                break;
            case 'cut':
                document.execCommand('cut');
                break;
            case 'copy':
                document.execCommand('copy');
                break;
            case 'paste':
                document.execCommand('paste');
                break;
            case 'find':
                this.showFindDialog();
                break;
            case 'replace':
                this.showReplaceDialog();
                break;
        }
    }

    updateDocumentTitle() {
        const textarea = this.window.querySelector('.editor-textarea');
        const hasContent = textarea.value.trim().length > 0;
        const title = this.window.querySelector('.window-title');
        title.textContent = hasContent ? 'Text Editor *' : 'Text Editor';
    }

    openFile() {
        this.webOS.showNotification('Text Editor', 'Open file dialog coming soon!');
    }

    saveFile() {
        this.webOS.showNotification('Text Editor', 'File saved successfully!');
        this.updateDocumentTitle();
    }

    showFindDialog() {
        const searchTerm = prompt('Find:');
        if (searchTerm) {
            this.webOS.showNotification('Text Editor', `Searching for: ${searchTerm}`);
        }
    }

    showReplaceDialog() {
        const find = prompt('Find:');
        if (find) {
            const replace = prompt('Replace with:');
            this.webOS.showNotification('Text Editor', `Replacing "${find}" with "${replace}"`);
        }
    }
}

// Code Editor Application
class CodeEditorApp extends BaseApp {
    getConfig() {
        return {
            title: 'Code Editor',
            content: this.getCodeEditorHTML(),
            width: '1000px',
            height: '700px',
            app: 'code-editor'
        };
    }

    getCodeEditorHTML() {
        return `
            <div class="code-editor-content">
                <div class="code-toolbar">
                    <button class="toolbar-button" data-action="new">📄 New</button>
                    <button class="toolbar-button" data-action="open">📂 Open</button>
                    <button class="toolbar-button" data-action="save">💾 Save</button>
                    <div class="toolbar-separator"></div>
                    <select class="language-selector" data-action="language">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                    </select>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="run">▶️ Run</button>
                    <button class="toolbar-button" data-action="debug">🐛 Debug</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="format">✨ Format</button>
                    <button class="toolbar-button" data-action="minify">📦 Minify</button>
                </div>
                <div class="code-editor">
                    <div class="code-line-numbers" id="line-numbers">1</div>
                    <textarea class="code-textarea" id="code-textarea" placeholder="// Start coding..."></textarea>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const button = e.target.closest('.toolbar-button');
                if (button) {
                    this.handleToolbarAction(button.dataset.action);
                }
            });
            
            const languageSelector = content.querySelector('.language-selector');
            languageSelector.addEventListener('change', () => {
                this.changeLanguage(languageSelector.value);
            });
            
            const textarea = content.querySelector('#code-textarea');
            textarea.addEventListener('input', () => {
                this.updateLineNumbers();
                this.updateDocumentTitle();
            });
            
            textarea.addEventListener('keydown', (e) => {
                this.handleKeyDown(e);
            });
        }
    }

    handleToolbarAction(action) {
        const textarea = this.window.querySelector('#code-textarea');
        
        switch (action) {
            case 'new':
                if (textarea.value && !confirm('Save changes?')) return;
                textarea.value = '';
                this.updateLineNumbers();
                this.updateDocumentTitle();
                break;
            case 'open':
                this.openFile();
                break;
            case 'save':
                this.saveFile();
                break;
            case 'run':
                this.runCode();
                break;
            case 'debug':
                this.debugCode();
                break;
            case 'format':
                this.formatCode();
                break;
            case 'minify':
                this.minifyCode();
                break;
        }
    }

    changeLanguage(language) {
        const textarea = this.window.querySelector('#code-textarea');
        textarea.className = `code-textarea language-${language}`;
        this.webOS.showNotification('Code Editor', `Language changed to ${language}`);
    }

    updateLineNumbers() {
        const textarea = this.window.querySelector('#code-textarea');
        const lineNumbers = this.window.querySelector('#line-numbers');
        const lines = textarea.value.split('\n').length;
        lineNumbers.textContent = Array.from({length: lines}, (_, i) => i + 1).join('\n');
    }

    updateDocumentTitle() {
        const textarea = this.window.querySelector('#code-textarea');
        const hasContent = textarea.value.trim().length > 0;
        const title = this.window.querySelector('.window-title');
        title.textContent = hasContent ? 'Code Editor *' : 'Code Editor';
    }

    handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            e.target.value = e.target.value.substring(0, start) + '    ' + e.target.value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 4;
        }
    }

    runCode() {
        const textarea = this.window.querySelector('#code-textarea');
        const language = this.window.querySelector('.language-selector').value;
        const code = textarea.value;
        
        this.webOS.showNotification('Code Editor', `Running ${language} code...`);
        // Implement code execution
    }

    debugCode() {
        this.webOS.showNotification('Code Editor', 'Debug mode activated');
    }

    formatCode() {
        this.webOS.showNotification('Code Editor', 'Code formatted');
    }

    minifyCode() {
        this.webOS.showNotification('Code Editor', 'Code minified');
    }

    openFile() {
        this.webOS.showNotification('Code Editor', 'Open file dialog coming soon!');
    }

    saveFile() {
        this.webOS.showNotification('Code Editor', 'File saved successfully!');
        this.updateDocumentTitle();
    }
}

// Terminal Application
class TerminalApp extends BaseApp {
    getConfig() {
        return {
            title: 'Terminal',
            content: this.getTerminalHTML(),
            width: '800px',
            height: '500px',
            app: 'terminal'
        };
    }

    getTerminalHTML() {
        return `
            <div class="terminal-content">
                <div class="terminal-header">
                    <div class="terminal-tabs">
                        <div class="terminal-tab active">Terminal</div>
                        <div class="terminal-tab">+</div>
                    </div>
                </div>
                <div class="terminal-body" id="terminal-body">
                    <div class="terminal-line">
                        <span class="terminal-prompt">user@webos:~$ </span>
                        <span class="terminal-input-line">Welcome to WebOS Terminal</span>
                    </div>
                    <div class="terminal-line">
                        <span class="terminal-prompt">user@webos:~$ </span>
                        <span class="terminal-input-line">Type 'help' for available commands</span>
                    </div>
                    <div class="terminal-line">
                        <span class="terminal-prompt">user@webos:~$ </span>
                        <input type="text" class="terminal-input" id="terminal-input" autofocus>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const input = this.window.querySelector('#terminal-input');
            const terminalBody = this.window.querySelector('#terminal-body');
            
            input.addEventListener('keydown', (e) => {
                this.handleTerminalInput(e);
            });
        }
    }

    handleTerminalInput(e) {
        if (e.key === 'Enter') {
            const input = e.target;
            const command = input.value.trim();
            
            if (command) {
                this.executeCommand(command);
            }
            
            input.value = '';
        }
    }

    executeCommand(command) {
        const terminalBody = this.window.querySelector('#terminal-body');
        const input = this.window.querySelector('#terminal-input');
        
        // Add command to history
        this.addTerminalLine(`user@webos:~$ ${command}`);
        
        // Execute command
        const result = this.processCommand(command);
        if (result) {
            this.addTerminalLine(result);
        }
        
        // Add new input line
        this.addTerminalLine('user@webos:~$ ');
        input.focus();
    }

    addTerminalLine(content) {
        const terminalBody = this.window.querySelector('#terminal-body');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = content;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    processCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        
        switch (cmd) {
            case 'help':
                return `Available commands:
ls - List directory contents
pwd - Print working directory
cd - Change directory
mkdir - Create directory
rm - Remove file/directory
cat - Display file contents
echo - Display text
clear - Clear terminal
python - Start Python interpreter
node - Start Node.js interpreter
exit - Close terminal`;
                
            case 'ls':
                return `Desktop  Documents  Downloads  Music  Pictures  Videos`;
                
            case 'pwd':
                return `/home/user`;
                
            case 'cd':
                return `Directory changed to ${parts[1] || 'home'}`;
                
            case 'mkdir':
                return `Directory '${parts[1] || 'newdir'}' created`;
                
            case 'rm':
                return `Removed '${parts[1] || 'file'}'`;
                
            case 'cat':
                return `File contents of '${parts[1] || 'file'}'`;
                
            case 'echo':
                return parts.slice(1).join(' ');
                
            case 'clear':
                const terminalBody = this.window.querySelector('#terminal-body');
                terminalBody.innerHTML = '';
                return null;
                
            case 'python':
                this.startPythonInterpreter();
                return 'Python interpreter started. Type "exit()" to quit.';
                
            case 'node':
                this.startNodeInterpreter();
                return 'Node.js interpreter started. Type ".exit" to quit.';
                
            case 'exit':
                this.close();
                return null;
                
            default:
                return `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }

    startPythonInterpreter() {
        this.webOS.showNotification('Terminal', 'Python interpreter started');
    }

    startNodeInterpreter() {
        this.webOS.showNotification('Terminal', 'Node.js interpreter started');
    }
}

// Paint Application
class PaintApp extends BaseApp {
    getConfig() {
        return {
            title: 'Paint',
            content: this.getPaintHTML(),
            width: '900px',
            height: '700px',
            app: 'paint'
        };
    }

    getPaintHTML() {
        return `
            <div class="paint-content">
                <div class="paint-toolbar">
                    <div class="tool-group">
                        <button class="tool-button active" data-tool="brush" title="Brush">🖌️</button>
                        <button class="tool-button" data-tool="eraser" title="Eraser">🧽</button>
                        <button class="tool-button" data-tool="line" title="Line">📏</button>
                        <button class="tool-button" data-tool="rectangle" title="Rectangle">⬜</button>
                        <button class="tool-button" data-tool="circle" title="Circle">⭕</button>
                        <button class="tool-button" data-tool="text" title="Text">T</button>
                    </div>
                    <div class="tool-group">
                        <input type="color" class="color-picker" value="#000000" title="Color">
                        <input type="range" class="size-slider" min="1" max="20" value="3" title="Size">
                        <span class="size-label">3px</span>
                    </div>
                    <div class="tool-group">
                        <button class="tool-button" data-action="undo" title="Undo">↶</button>
                        <button class="tool-button" data-action="redo" title="Redo">↷</button>
                        <button class="tool-button" data-action="clear" title="Clear">🗑️</button>
                    </div>
                    <div class="tool-group">
                        <button class="tool-button" data-action="save" title="Save">💾</button>
                        <button class="tool-button" data-action="open" title="Open">📂</button>
                    </div>
                </div>
                <div class="paint-canvas-container">
                    <canvas class="paint-canvas" id="paint-canvas" width="800" height="500"></canvas>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const button = e.target.closest('.tool-button');
                if (button) {
                    if (button.dataset.tool) {
                        this.selectTool(button.dataset.tool);
                    } else if (button.dataset.action) {
                        this.handleAction(button.dataset.action);
                    }
                }
            });
            
            const sizeSlider = content.querySelector('.size-slider');
            sizeSlider.addEventListener('input', (e) => {
                this.updateBrushSize(e.target.value);
            });
            
            const colorPicker = content.querySelector('.color-picker');
            colorPicker.addEventListener('change', (e) => {
                this.updateBrushColor(e.target.value);
            });
            
            this.setupCanvas();
        }
    }

    setupCanvas() {
        const canvas = this.window.querySelector('#paint-canvas');
        const ctx = canvas.getContext('2d');
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.currentSize = 3;
        
        // Canvas event listeners
        canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        canvas.addEventListener('mousemove', (e) => this.draw(e));
        canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        canvas.addEventListener('mouseout', (e) => this.stopDrawing(e));
        
        // Set initial canvas properties
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    selectTool(tool) {
        this.currentTool = tool;
        
        // Update toolbar
        const buttons = this.window.querySelectorAll('.tool-button[data-tool]');
        buttons.forEach(btn => btn.classList.remove('active'));
        this.window.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        
        // Update cursor
        const canvas = this.canvas;
        canvas.style.cursor = tool === 'eraser' ? 'crosshair' : 'crosshair';
    }

    handleAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'clear':
                this.clearCanvas();
                break;
            case 'save':
                this.saveCanvas();
                break;
            case 'open':
                this.openImage();
                break;
        }
    }

    updateBrushSize(size) {
        this.currentSize = parseInt(size);
        const label = this.window.querySelector('.size-label');
        label.textContent = size + 'px';
    }

    updateBrushColor(color) {
        this.currentColor = color;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        
        this.lastX = currentX;
        this.lastY = currentY;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    undo() {
        this.webOS.showNotification('Paint', 'Undo feature coming soon!');
    }

    redo() {
        this.webOS.showNotification('Paint', 'Redo feature coming soon!');
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    saveCanvas() {
        const dataURL = this.canvas.toDataURL();
        const link = document.createElement('a');
        link.download = 'paint-drawing.png';
        link.href = dataURL;
        link.click();
        this.webOS.showNotification('Paint', 'Drawing saved!');
    }

    openImage() {
        this.webOS.showNotification('Paint', 'Open image feature coming soon!');
    }
}

// Video Editor Application
class VideoEditorApp extends BaseApp {
    getConfig() {
        return {
            title: 'Video Editor',
            content: this.getVideoEditorHTML(),
            width: '1200px',
            height: '800px',
            app: 'video-editor'
        };
    }

    getVideoEditorHTML() {
        return `
            <div class="video-editor-content">
                <div class="video-toolbar">
                    <button class="toolbar-button" data-action="import">📁 Import</button>
                    <button class="toolbar-button" data-action="play">▶️ Play</button>
                    <button class="toolbar-button" data-action="pause">⏸️ Pause</button>
                    <button class="toolbar-button" data-action="stop">⏹️ Stop</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="cut">✂️ Cut</button>
                    <button class="toolbar-button" data-action="copy">📋 Copy</button>
                    <button class="toolbar-button" data-action="paste">📌 Paste</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="add-text">T Add Text</button>
                    <button class="toolbar-button" data-action="add-effect">✨ Add Effect</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" data-action="export">💾 Export</button>
                </div>
                <div class="video-preview">
                    <div class="preview-placeholder">
                        <div class="preview-icon">🎬</div>
                        <div class="preview-text">Video Preview</div>
                        <div class="preview-subtext">Import a video to start editing</div>
                    </div>
                </div>
                <div class="timeline">
                    <div class="timeline-header">
                        <div class="timeline-title">Timeline</div>
                        <div class="timeline-controls">
                            <button class="timeline-button" data-action="zoom-in">🔍+</button>
                            <button class="timeline-button" data-action="zoom-out">🔍-</button>
                        </div>
                    </div>
                    <div class="timeline-tracks">
                        <div class="timeline-track">
                            <div class="track-label">Video 1</div>
                            <div class="track-content">
                                <div class="timeline-clip" style="left: 0; width: 100px; background: #0078D4;">
                                    <div class="clip-label">Clip 1</div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-track">
                            <div class="track-label">Audio 1</div>
                            <div class="track-content">
                                <div class="timeline-clip" style="left: 50px; width: 150px; background: #107C10;">
                                    <div class="clip-label">Audio 1</div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-track">
                            <div class="track-label">Text</div>
                            <div class="track-content">
                                <div class="timeline-clip" style="left: 100px; width: 80px; background: #FF8C00;">
                                    <div class="clip-label">Title</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const button = e.target.closest('.toolbar-button, .timeline-button');
                if (button) {
                    this.handleAction(button.dataset.action);
                }
            });
        }
    }

    handleAction(action) {
        switch (action) {
            case 'import':
                this.importVideo();
                break;
            case 'play':
                this.playVideo();
                break;
            case 'pause':
                this.pauseVideo();
                break;
            case 'stop':
                this.stopVideo();
                break;
            case 'cut':
                this.cutClip();
                break;
            case 'copy':
                this.copyClip();
                break;
            case 'paste':
                this.pasteClip();
                break;
            case 'add-text':
                this.addText();
                break;
            case 'add-effect':
                this.addEffect();
                break;
            case 'export':
                this.exportVideo();
                break;
            case 'zoom-in':
                this.zoomTimeline(1.2);
                break;
            case 'zoom-out':
                this.zoomTimeline(0.8);
                break;
        }
    }

    importVideo() {
        this.webOS.showNotification('Video Editor', 'Import video feature coming soon!');
    }

    playVideo() {
        this.webOS.showNotification('Video Editor', 'Playing video...');
    }

    pauseVideo() {
        this.webOS.showNotification('Video Editor', 'Video paused');
    }

    stopVideo() {
        this.webOS.showNotification('Video Editor', 'Video stopped');
    }

    cutClip() {
        this.webOS.showNotification('Video Editor', 'Clip cut');
    }

    copyClip() {
        this.webOS.showNotification('Video Editor', 'Clip copied');
    }

    pasteClip() {
        this.webOS.showNotification('Video Editor', 'Clip pasted');
    }

    addText() {
        this.webOS.showNotification('Video Editor', 'Add text feature coming soon!');
    }

    addEffect() {
        this.webOS.showNotification('Video Editor', 'Add effect feature coming soon!');
    }

    exportVideo() {
        this.webOS.showNotification('Video Editor', 'Export video feature coming soon!');
    }

    zoomTimeline(factor) {
        this.webOS.showNotification('Video Editor', `Timeline zoomed ${factor > 1 ? 'in' : 'out'}`);
    }
}

// Games Application
class GamesApp extends BaseApp {
    getConfig() {
        return {
            title: 'Games',
            content: this.getGamesHTML(),
            width: '1000px',
            height: '700px',
            app: 'games'
        };
    }

    getGamesHTML() {
        return `
            <div class="games-content">
                <div class="games-header">🎮 Games</div>
                <div class="games-grid">
                    <div class="game-card" data-game="snake">
                        <div class="game-icon">🐍</div>
                        <div class="game-title">Snake</div>
                        <div class="game-description">Classic snake game with modern graphics</div>
                    </div>
                    <div class="game-card" data-game="tetris">
                        <div class="game-icon">🧩</div>
                        <div class="game-title">Tetris</div>
                        <div class="game-description">Block stacking puzzle game</div>
                    </div>
                    <div class="game-card" data-game="pong">
                        <div class="game-icon">🏓</div>
                        <div class="game-title">Pong</div>
                        <div class="game-description">Classic paddle game</div>
                    </div>
                    <div class="game-card" data-game="memory">
                        <div class="game-icon">🧠</div>
                        <div class="game-title">Memory</div>
                        <div class="game-description">Card matching memory game</div>
                    </div>
                    <div class="game-card" data-game="breakout">
                        <div class="game-icon">🎯</div>
                        <div class="game-title">Breakout</div>
                        <div class="game-description">Break the bricks game</div>
                    </div>
                    <div class="game-card" data-game="pacman">
                        <div class="game-icon">👻</div>
                        <div class="game-title">Pac-Man</div>
                        <div class="game-description">Maze chase game</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const gameCard = e.target.closest('.game-card');
                if (gameCard) {
                    this.launchGame(gameCard.dataset.game);
                }
            });
        }
    }

    launchGame(gameName) {
        switch (gameName) {
            case 'snake':
                this.launchSnake();
                break;
            case 'tetris':
                this.launchTetris();
                break;
            case 'pong':
                this.launchPong();
                break;
            case 'memory':
                this.launchMemory();
                break;
            case 'breakout':
                this.launchBreakout();
                break;
            case 'pacman':
                this.launchPacman();
                break;
        }
    }

    launchSnake() {
        this.webOS.showNotification('Games', 'Launching Snake game...');
        // Implement Snake game
    }

    launchTetris() {
        this.webOS.showNotification('Games', 'Launching Tetris game...');
        // Implement Tetris game
    }

    launchPong() {
        this.webOS.showNotification('Games', 'Launching Pong game...');
        // Implement Pong game
    }

    launchMemory() {
        this.webOS.showNotification('Games', 'Launching Memory game...');
        // Implement Memory game
    }

    launchBreakout() {
        this.webOS.showNotification('Games', 'Launching Breakout game...');
        // Implement Breakout game
    }

    launchPacman() {
        this.webOS.showNotification('Games', 'Launching Pac-Man game...');
        // Implement Pac-Man game
    }
}

// Settings Application
class SettingsApp extends BaseApp {
    getConfig() {
        return {
            title: 'Settings',
            content: this.getSettingsHTML(),
            width: '800px',
            height: '600px',
            app: 'settings'
        };
    }

    getSettingsHTML() {
        return `
            <div class="settings-content">
                <div class="settings-sidebar">
                    <div class="settings-item active" data-section="system">⚙️ System</div>
                    <div class="settings-item" data-section="appearance">🎨 Appearance</div>
                    <div class="settings-item" data-section="privacy">🔒 Privacy</div>
                    <div class="settings-item" data-section="accounts">👤 Accounts</div>
                    <div class="settings-item" data-section="apps">📱 Apps</div>
                </div>
                <div class="settings-main">
                    <div class="settings-section" id="system-settings">
                        <h2>System Settings</h2>
                        <div class="setting-group">
                            <label>Computer Name</label>
                            <input type="text" value="WebOS-PC" class="setting-input">
                        </div>
                        <div class="setting-group">
                            <label>Language</label>
                            <select class="setting-select">
                                <option>English (United States)</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>Time Zone</label>
                            <select class="setting-select">
                                <option>Pacific Time</option>
                                <option>Mountain Time</option>
                                <option>Central Time</option>
                                <option>Eastern Time</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-section hidden" id="appearance-settings">
                        <h2>Appearance Settings</h2>
                        <div class="setting-group">
                            <label>Theme</label>
                            <select class="setting-select">
                                <option>Light</option>
                                <option>Dark</option>
                                <option>Auto</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label>Accent Color</label>
                            <input type="color" value="#0078D4" class="setting-color">
                        </div>
                        <div class="setting-group">
                            <label>Wallpaper</label>
                            <button class="setting-button">Choose Wallpaper</button>
                        </div>
                    </div>
                    <div class="settings-section hidden" id="privacy-settings">
                        <h2>Privacy Settings</h2>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" checked> Location Services
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" checked> Camera Access
                            </label>
                        </div>
                        <div class="setting-group">
                            <label>
                                <input type="checkbox"> Microphone Access
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        super.setupEventListeners();
        
        if (this.window) {
            const content = this.window.querySelector('.window-content');
            
            content.addEventListener('click', (e) => {
                const settingsItem = e.target.closest('.settings-item');
                if (settingsItem) {
                    this.switchSection(settingsItem.dataset.section);
                }
            });
        }
    }

    switchSection(section) {
        // Update sidebar
        const items = this.window.querySelectorAll('.settings-item');
        items.forEach(item => item.classList.remove('active'));
        this.window.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Update content
        const sections = this.window.querySelectorAll('.settings-section');
        sections.forEach(section => section.classList.add('hidden'));
        this.window.querySelector(`#${section}-settings`).classList.remove('hidden');
    }
}

// Initialize Application Manager
document.addEventListener('DOMContentLoaded', () => {
    if (window.webOS) {
        window.appManager = new ApplicationManager(window.webOS);
    }
});