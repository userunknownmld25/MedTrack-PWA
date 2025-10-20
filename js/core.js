// Core WebOS functionality
class WebOS {
    constructor() {
        this.windows = new Map();
        this.windowIdCounter = 0;
        this.activeWindow = null;
        this.startMenuOpen = false;
        this.contextMenuOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDesktop();
        this.setupTaskbar();
        this.setupStartMenu();
        this.setupContextMenu();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Desktop click to close menus
        document.getElementById('desktop').addEventListener('click', (e) => {
            if (e.target.id === 'desktop') {
                this.closeStartMenu();
                this.closeContextMenu();
            }
        });

        // Window focus management
        document.addEventListener('click', (e) => {
            const window = e.target.closest('.window');
            if (window) {
                this.focusWindow(window);
            }
        });

        // Prevent context menu on desktop
        document.getElementById('desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showDesktopContextMenu(e.clientX, e.clientY);
        });
    }

    setupDesktop() {
        const desktop = document.getElementById('desktop');
        
        // Desktop icon click handlers
        desktop.addEventListener('click', (e) => {
            const icon = e.target.closest('.desktop-icon');
            if (icon) {
                const appName = icon.dataset.app;
                this.openApplication(appName);
            }
        });
    }

    setupTaskbar() {
        const startButton = document.getElementById('start-button');
        const searchInput = document.getElementById('search-input');

        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
    }

    setupStartMenu() {
        const startMenu = document.getElementById('start-menu');
        
        // App click handlers
        startMenu.addEventListener('click', (e) => {
            const appItem = e.target.closest('.app-item, .app-list-item');
            if (appItem) {
                const appName = appItem.dataset.app;
                this.openApplication(appName);
                this.closeStartMenu();
            }
        });
    }

    setupContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        
        // Context menu item handlers
        contextMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-item');
            if (item) {
                this.handleContextAction(item.textContent);
                this.closeContextMenu();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + Tab for window switching
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                this.switchWindow();
            }
            
            // Windows key for start menu
            if (e.key === 'Meta' || e.key === 'Super') {
                e.preventDefault();
                this.toggleStartMenu();
            }
            
            // Escape to close menus
            if (e.key === 'Escape') {
                this.closeStartMenu();
                this.closeContextMenu();
            }
        });
    }

    // Window Management
    createWindow(options) {
        const windowId = ++this.windowIdCounter;
        const window = document.createElement('div');
        window.className = 'window';
        window.id = `window-${windowId}`;
        window.dataset.windowId = windowId;
        
        // Set initial position and size
        window.style.left = options.x || '100px';
        window.style.top = options.y || '100px';
        window.style.width = options.width || '800px';
        window.style.height = options.height || '600px';
        
        // Create window header
        const header = document.createElement('div');
        header.className = 'window-header';
        header.innerHTML = `
            <div class="window-title">${options.title || 'Untitled'}</div>
            <div class="window-controls">
                <div class="window-control minimize" title="Minimize">−</div>
                <div class="window-control maximize" title="Maximize">□</div>
                <div class="window-control close" title="Close">×</div>
            </div>
        `;
        
        // Create window content
        const content = document.createElement('div');
        content.className = 'window-content';
        content.innerHTML = options.content || '';
        
        window.appendChild(header);
        window.appendChild(content);
        
        // Add window to container
        document.getElementById('windows-container').appendChild(window);
        
        // Store window reference
        this.windows.set(windowId, {
            element: window,
            title: options.title || 'Untitled',
            app: options.app || 'unknown',
            maximized: false,
            minimized: false
        });
        
        // Setup window controls
        this.setupWindowControls(window);
        
        // Focus the new window
        this.focusWindow(window);
        
        // Add to taskbar
        this.addToTaskbar(windowId, options.title, options.app);
        
        return window;
    }

    setupWindowControls(window) {
        const header = window.querySelector('.window-header');
        const controls = window.querySelectorAll('.window-control');
        
        // Make header draggable
        this.makeDraggable(header, window);
        
        // Control buttons
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.classList[1];
                this.handleWindowControl(window, action);
            });
        });
        
        // Make window resizable
        this.makeResizable(window);
    }

    makeDraggable(header, window) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(window.style.left) || 0;
            startTop = parseInt(window.style.top) || 0;
            
            window.style.cursor = 'move';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            window.style.left = (startLeft + deltaX) + 'px';
            window.style.top = (startTop + deltaY) + 'px';
        };
        
        const handleMouseUp = () => {
            isDragging = false;
            window.style.cursor = 'default';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }

    makeResizable(window) {
        const resizeHandles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        
        resizeHandles.forEach(handle => {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = `window-resize-handle ${handle}`;
            window.appendChild(resizeHandle);
            
            this.setupResizeHandle(resizeHandle, window, handle);
        });
    }

    setupResizeHandle(handle, window, direction) {
        let isResizing = false;
        let startX, startY, startWidth, startHeight, startLeft, startTop;
        
        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(window.style.width) || 800;
            startHeight = parseInt(window.style.height) || 600;
            startLeft = parseInt(window.style.left) || 0;
            startTop = parseInt(window.style.top) || 0;
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;
            
            if (direction.includes('e')) {
                newWidth = Math.max(300, startWidth + deltaX);
            }
            if (direction.includes('w')) {
                newWidth = Math.max(300, startWidth - deltaX);
                newLeft = startLeft + deltaX;
            }
            if (direction.includes('s')) {
                newHeight = Math.max(200, startHeight + deltaY);
            }
            if (direction.includes('n')) {
                newHeight = Math.max(200, startHeight - deltaY);
                newTop = startTop + deltaY;
            }
            
            window.style.width = newWidth + 'px';
            window.style.height = newHeight + 'px';
            window.style.left = newLeft + 'px';
            window.style.top = newTop + 'px';
        };
        
        const handleMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }

    handleWindowControl(window, action) {
        const windowId = parseInt(window.dataset.windowId);
        const windowData = this.windows.get(windowId);
        
        switch (action) {
            case 'minimize':
                this.minimizeWindow(window);
                break;
            case 'maximize':
                this.toggleMaximizeWindow(window);
                break;
            case 'close':
                this.closeWindow(window);
                break;
        }
    }

    minimizeWindow(window) {
        window.classList.add('minimized');
        const windowId = parseInt(window.dataset.windowId);
        const windowData = this.windows.get(windowId);
        windowData.minimized = true;
        
        // Update taskbar
        this.updateTaskbarApp(windowId, { minimized: true });
    }

    toggleMaximizeWindow(window) {
        const windowId = parseInt(window.dataset.windowId);
        const windowData = this.windows.get(windowId);
        
        if (windowData.maximized) {
            window.classList.remove('maximized');
            windowData.maximized = false;
        } else {
            window.classList.add('maximized');
            windowData.maximized = true;
        }
    }

    closeWindow(window) {
        const windowId = parseInt(window.dataset.windowId);
        
        // Remove from taskbar
        this.removeFromTaskbar(windowId);
        
        // Remove from windows map
        this.windows.delete(windowId);
        
        // Remove from DOM
        window.remove();
    }

    focusWindow(window) {
        // Remove focus from all windows
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('focused');
        });
        
        // Focus the selected window
        window.classList.add('focused');
        this.activeWindow = window;
        
        // Bring to front
        window.style.zIndex = '200';
        
        // Update taskbar
        const windowId = parseInt(window.dataset.windowId);
        this.updateTaskbarApp(windowId, { active: true });
    }

    switchWindow() {
        const windowList = Array.from(this.windows.values());
        if (windowList.length === 0) return;
        
        const currentIndex = windowList.findIndex(w => w.element === this.activeWindow);
        const nextIndex = (currentIndex + 1) % windowList.length;
        const nextWindow = windowList[nextIndex].element;
        
        this.focusWindow(nextWindow);
    }

    // Application Management
    openApplication(appName, options = {}) {
        const appConfig = this.getAppConfig(appName);
        if (!appConfig) return;
        
        const windowOptions = {
            title: appConfig.title,
            app: appName,
            content: appConfig.content,
            width: appConfig.width || '800px',
            height: appConfig.height || '600px',
            ...options
        };
        
        return this.createWindow(windowOptions);
    }

    getAppConfig(appName) {
        const configs = {
            'file-manager': {
                title: 'File Manager',
                content: '<div class="file-manager"><div class="file-sidebar"><div class="sidebar-section"><div class="sidebar-title">Quick Access</div><div class="sidebar-item active"><span class="icon">🏠</span>Home</div><div class="sidebar-item"><span class="icon">📁</span>Documents</div><div class="sidebar-item"><span class="icon">🖼️</span>Pictures</div><div class="sidebar-item"><span class="icon">🎵</span>Music</div><div class="sidebar-item"><span class="icon">🎬</span>Videos</div><div class="sidebar-item"><span class="icon">💾</span>Downloads</div></div></div><div class="file-content"><div class="file-path"><div class="path-item">🏠</div><div class="path-separator">></div><div class="path-item">Home</div></div><div class="file-grid"><div class="file-item"><div class="file-icon">📁</div><div class="file-name">Documents</div></div><div class="file-item"><div class="file-icon">📁</div><div class="file-name">Pictures</div></div><div class="file-item"><div class="file-icon">📁</div><div class="file-name">Music</div></div><div class="file-item"><div class="file-icon">📁</div><div class="file-name">Videos</div></div><div class="file-item"><div class="file-icon">📄</div><div class="file-name">readme.txt</div></div><div class="file-item"><div class="file-icon">📄</div><div class="file-name">notes.md</div></div></div></div></div>',
                width: '900px',
                height: '600px'
            },
            'browser': {
                title: 'Browser',
                content: '<div class="browser-content"><div class="browser-toolbar"><div class="browser-nav"><button class="nav-button" title="Back">←</button><button class="nav-button" title="Forward">→</button><button class="nav-button" title="Refresh">↻</button></div><input type="text" class="browser-address" placeholder="Search or enter address" value="https://www.google.com"></div><iframe class="browser-view" src="https://www.google.com"></iframe></div>',
                width: '1000px',
                height: '700px'
            },
            'text-editor': {
                title: 'Text Editor',
                content: '<div class="text-editor-content"><div class="editor-toolbar"><button class="toolbar-button">📄 New</button><button class="toolbar-button">📂 Open</button><button class="toolbar-button">💾 Save</button><div class="toolbar-separator"></div><button class="toolbar-button">↶ Undo</button><button class="toolbar-button">↷ Redo</button><div class="toolbar-separator"></div><button class="toolbar-button">✂️ Cut</button><button class="toolbar-button">📋 Copy</button><button class="toolbar-button">📌 Paste</button></div><textarea class="editor-textarea" placeholder="Start typing..."></textarea></div>',
                width: '800px',
                height: '600px'
            },
            'code-editor': {
                title: 'Code Editor',
                content: '<div class="code-editor-content"><div class="code-toolbar"><button class="toolbar-button">📄 New</button><button class="toolbar-button">📂 Open</button><button class="toolbar-button">💾 Save</button><div class="toolbar-separator"></div><select class="language-selector"><option value="javascript">JavaScript</option><option value="python">Python</option><option value="html">HTML</option><option value="css">CSS</option><option value="json">JSON</option></select><div class="toolbar-separator"></div><button class="toolbar-button">▶️ Run</button></div><div class="code-editor"><div class="code-line-numbers"></div><textarea class="code-textarea" placeholder="// Start coding..."></textarea></div></div>',
                width: '1000px',
                height: '700px'
            },
            'terminal': {
                title: 'Terminal',
                content: '<div class="terminal-content"><div class="terminal-header"><div class="terminal-tabs"><div class="terminal-tab active">Terminal</div></div></div><div class="terminal-body"><div class="terminal-line"><span class="terminal-prompt">user@webos:~$ </span><span class="terminal-input-line">Welcome to WebOS Terminal</span></div><div class="terminal-line"><span class="terminal-prompt">user@webos:~$ </span><span class="terminal-input-line">Type commands to get started</span></div><div class="terminal-line"><span class="terminal-prompt">user@webos:~$ </span><input type="text" class="terminal-input" autofocus></div></div></div>',
                width: '800px',
                height: '500px'
            },
            'paint': {
                title: 'Paint',
                content: '<div class="paint-content"><div class="paint-toolbar"><div class="tool-group"><button class="tool-button active" data-tool="brush">🖌️</button><button class="tool-button" data-tool="eraser">🧽</button><button class="tool-button" data-tool="line">📏</button><button class="tool-button" data-tool="rectangle">⬜</button><button class="tool-button" data-tool="circle">⭕</button></div><div class="tool-group"><input type="color" class="color-picker" value="#000000"><input type="range" class="size-slider" min="1" max="20" value="3"></div><div class="tool-group"><button class="tool-button">↶ Undo</button><button class="tool-button">↷ Redo</button><button class="tool-button">🗑️ Clear</button></div></div><div class="paint-canvas-container"><canvas class="paint-canvas" width="800" height="500"></canvas></div></div>',
                width: '900px',
                height: '700px'
            },
            'video-editor': {
                title: 'Video Editor',
                content: '<div class="video-editor-content"><div class="video-toolbar"><button class="toolbar-button">📁 Import</button><button class="toolbar-button">▶️ Play</button><button class="toolbar-button">⏸️ Pause</button><button class="toolbar-button">⏹️ Stop</button><div class="toolbar-separator"></div><button class="toolbar-button">✂️ Cut</button><button class="toolbar-button">📋 Copy</button><button class="toolbar-button">📌 Paste</button><div class="toolbar-separator"></div><button class="toolbar-button">💾 Export</button></div><div class="video-preview">Video Preview Area</div><div class="timeline"><div class="timeline-track"><div class="timeline-clip" style="left: 0; width: 100px;"></div></div><div class="timeline-track"><div class="timeline-clip" style="left: 50px; width: 150px;"></div></div></div></div>',
                width: '1200px',
                height: '800px'
            },
            'games': {
                title: 'Games',
                content: '<div class="games-content"><div class="games-header">🎮 Games</div><div class="games-grid"><div class="game-card" data-game="snake"><div class="game-icon">🐍</div><div class="game-title">Snake</div><div class="game-description">Classic snake game</div></div><div class="game-card" data-game="tetris"><div class="game-icon">🧩</div><div class="game-title">Tetris</div><div class="game-description">Block stacking puzzle</div></div><div class="game-card" data-game="pong"><div class="game-icon">🏓</div><div class="game-title">Pong</div><div class="game-description">Classic paddle game</div></div><div class="game-card" data-game="memory"><div class="game-icon">🧠</div><div class="game-title">Memory</div><div class="game-description">Card matching game</div></div></div></div>',
                width: '1000px',
                height: '700px'
            },
            'settings': {
                title: 'Settings',
                content: '<div class="settings-content"><h2>System Settings</h2><p>Settings panel coming soon...</p></div>',
                width: '800px',
                height: '600px'
            }
        };
        
        return configs[appName];
    }

    // Taskbar Management
    addToTaskbar(windowId, title, app) {
        const taskbarApps = document.querySelector('.taskbar-apps');
        if (!taskbarApps) return;
        
        const appElement = document.createElement('div');
        appElement.className = 'taskbar-app';
        appElement.dataset.windowId = windowId;
        appElement.dataset.app = app;
        appElement.innerHTML = `<div class="taskbar-app-icon">${this.getAppIcon(app)}</div>`;
        
        appElement.addEventListener('click', () => {
            const window = document.getElementById(`window-${windowId}`);
            if (window) {
                if (window.classList.contains('minimized')) {
                    this.restoreWindow(window);
                } else {
                    this.focusWindow(window);
                }
            }
        });
        
        taskbarApps.appendChild(appElement);
    }

    removeFromTaskbar(windowId) {
        const appElement = document.querySelector(`.taskbar-app[data-window-id="${windowId}"]`);
        if (appElement) {
            appElement.remove();
        }
    }

    updateTaskbarApp(windowId, updates) {
        const appElement = document.querySelector(`.taskbar-app[data-window-id="${windowId}"]`);
        if (!appElement) return;
        
        if (updates.active) {
            document.querySelectorAll('.taskbar-app').forEach(app => {
                app.classList.remove('active');
            });
            appElement.classList.add('active');
        }
        
        if (updates.minimized) {
            appElement.classList.add('minimized');
        } else {
            appElement.classList.remove('minimized');
        }
    }

    restoreWindow(window) {
        window.classList.remove('minimized');
        const windowId = parseInt(window.dataset.windowId);
        const windowData = this.windows.get(windowId);
        windowData.minimized = false;
        this.focusWindow(window);
        this.updateTaskbarApp(windowId, { minimized: false });
    }

    getAppIcon(app) {
        const icons = {
            'file-manager': '📁',
            'browser': '🌐',
            'text-editor': '📝',
            'code-editor': '💻',
            'terminal': '⚡',
            'paint': '🎨',
            'video-editor': '🎬',
            'games': '🎮',
            'settings': '⚙️'
        };
        return icons[app] || '📄';
    }

    // Menu Management
    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        this.startMenuOpen = !this.startMenuOpen;
        
        if (this.startMenuOpen) {
            startMenu.classList.add('show');
        } else {
            startMenu.classList.remove('show');
        }
    }

    closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.remove('show');
        this.startMenuOpen = false;
    }

    showDesktopContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.add('show');
        this.contextMenuOpen = true;
    }

    closeContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.classList.remove('show');
        this.contextMenuOpen = false;
    }

    handleContextAction(action) {
        switch (action) {
            case 'New Folder':
                this.showNotification('New Folder', 'Folder creation feature coming soon!');
                break;
            case 'New File':
                this.showNotification('New File', 'File creation feature coming soon!');
                break;
            case 'Paste':
                this.showNotification('Paste', 'Paste feature coming soon!');
                break;
            case 'Properties':
                this.showNotification('Properties', 'Properties panel coming soon!');
                break;
        }
    }

    // Search
    performSearch(query) {
        if (!query.trim()) return;
        
        this.showNotification('Search', `Searching for "${query}"...`);
        // Implement search functionality
    }

    // Notifications
    showNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <div class="notification-close">×</div>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize WebOS when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.webOS = new WebOS();
});