// Main WebOS Application
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
        this.updateTime();
        this.setupDesktopIcons();
        this.setupContextMenu();
        
        // Initialize apps
        this.apps = {
            'browser': new BrowserApp(),
            'file-manager': new FileManagerApp(),
            'code-editor': new CodeEditorApp(),
            'terminal': new TerminalApp(),
            'paint': new PaintApp(),
            'video-editor': new VideoEditorApp(),
            'games': new GamesApp(),
            'settings': new SettingsApp()
        };
    }

    setupEventListeners() {
        // Start menu toggle
        document.getElementById('start-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
                this.closeStartMenu();
            }
        });

        // Desktop context menu
        document.getElementById('desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Close context menu
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Window management
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-header')) {
                this.startWindowDrag(e);
            }
        });
    }

    setupDesktopIcons() {
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                const appName = icon.dataset.app;
                this.openApp(appName);
            });
        });
    }

    setupContextMenu() {
        document.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleContextAction(item.textContent);
                this.hideContextMenu();
            });
        });
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        this.startMenuOpen = !this.startMenuOpen;
        
        if (this.startMenuOpen) {
            startMenu.classList.remove('hidden');
            startMenu.classList.add('fade-in');
        } else {
            startMenu.classList.add('hidden');
        }
    }

    closeStartMenu() {
        if (this.startMenuOpen) {
            this.startMenuOpen = false;
            document.getElementById('start-menu').classList.add('hidden');
        }
    }

    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.remove('hidden');
        this.contextMenuOpen = true;
    }

    hideContextMenu() {
        if (this.contextMenuOpen) {
            document.getElementById('context-menu').classList.add('hidden');
            this.contextMenuOpen = false;
        }
    }

    handleContextAction(action) {
        switch (action) {
            case 'New':
                this.createNewFile();
                break;
            case 'Refresh':
                this.refreshDesktop();
                break;
            case 'View':
                this.toggleViewMode();
                break;
            default:
                console.log('Context action:', action);
        }
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        // Simple search implementation
        const results = [];
        Object.keys(this.apps).forEach(appName => {
            if (appName.toLowerCase().includes(query.toLowerCase())) {
                results.push({ type: 'app', name: appName, title: this.getAppTitle(appName) });
            }
        });
        
        console.log('Search results:', results);
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    this.openApp('file-manager');
                    break;
                case 't':
                    e.preventDefault();
                    this.openApp('terminal');
                    break;
                case 'b':
                    e.preventDefault();
                    this.openApp('browser');
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.closeStartMenu();
            this.hideContextMenu();
        }
    }

    openApp(appName) {
        if (!this.apps[appName]) {
            console.error('App not found:', appName);
            return;
        }

        // Check if app is already open
        const existingWindow = Array.from(this.windows.values()).find(w => w.appName === appName);
        if (existingWindow) {
            this.focusWindow(existingWindow.id);
            return;
        }

        const windowId = ++this.windowIdCounter;
        const window = this.createWindow(windowId, appName);
        
        this.windows.set(windowId, window);
        this.focusWindow(windowId);
        
        // Add to taskbar
        this.addToTaskbar(windowId, appName);
        
        // Close start menu
        this.closeStartMenu();
    }

    createWindow(id, appName) {
        const template = document.getElementById('window-template');
        const windowElement = template.content.cloneNode(true);
        const windowDiv = windowElement.querySelector('.window');
        
        windowDiv.dataset.app = appName;
        windowDiv.dataset.windowId = id;
        
        // Set window title
        const title = windowDiv.querySelector('.window-title');
        title.textContent = this.getAppTitle(appName);
        
        // Set window content
        const content = windowDiv.querySelector('.window-content');
        const app = this.apps[appName];
        content.innerHTML = app.getHTML();
        
        // Add to desktop
        document.getElementById('windows-container').appendChild(windowDiv);
        
        // Setup window controls
        this.setupWindowControls(windowDiv, id);
        
        // Initialize app
        app.init(content, id);
        
        return {
            id,
            appName,
            element: windowDiv,
            app: app
        };
    }

    setupWindowControls(windowElement, windowId) {
        const minimizeBtn = windowElement.querySelector('.window-minimize');
        const maximizeBtn = windowElement.querySelector('.window-maximize');
        const closeBtn = windowElement.querySelector('.window-close');
        
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
        maximizeBtn.addEventListener('click', () => this.maximizeWindow(windowId));
        closeBtn.addEventListener('click', () => this.closeWindow(windowId));
        
        // Make window draggable
        const header = windowElement.querySelector('.window-header');
        header.addEventListener('mousedown', (e) => this.startWindowDrag(e, windowId));
    }

    startWindowDrag(e, windowId) {
        const window = this.windows.get(windowId);
        if (!window) return;
        
        const windowElement = window.element;
        const rect = windowElement.getBoundingClientRect();
        
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        
        const handleMouseMove = (e) => {
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            
            windowElement.style.left = Math.max(0, newX) + 'px';
            windowElement.style.top = Math.max(0, newY) + 'px';
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        this.focusWindow(windowId);
    }

    focusWindow(windowId) {
        // Remove active class from all windows
        this.windows.forEach(window => {
            window.element.classList.remove('active');
        });
        
        // Add active class to focused window
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.add('active');
            window.element.style.zIndex = 1000;
            this.activeWindow = window;
            
            // Update taskbar
            this.updateTaskbarActive(windowId);
        }
    }

    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.toggle('minimized');
            this.updateTaskbarMinimized(windowId, window.element.classList.contains('minimized'));
        }
    }

    maximizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.toggle('maximized');
        }
    }

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.remove();
            this.windows.delete(windowId);
            this.removeFromTaskbar(windowId);
            
            if (this.activeWindow && this.activeWindow.id === windowId) {
                this.activeWindow = null;
            }
        }
    }

    addToTaskbar(windowId, appName) {
        const taskbarApps = document.querySelector('.taskbar-apps');
        const appButton = document.createElement('button');
        appButton.className = 'taskbar-app';
        appButton.dataset.windowId = windowId;
        appButton.innerHTML = `<div class="app-icon">${this.getAppIcon(appName)}</div>`;
        
        appButton.addEventListener('click', () => {
            const window = this.windows.get(windowId);
            if (window.element.classList.contains('minimized')) {
                this.minimizeWindow(windowId);
            } else {
                this.focusWindow(windowId);
            }
        });
        
        taskbarApps.appendChild(appButton);
    }

    removeFromTaskbar(windowId) {
        const appButton = document.querySelector(`[data-window-id="${windowId}"]`);
        if (appButton) {
            appButton.remove();
        }
    }

    updateTaskbarActive(windowId) {
        document.querySelectorAll('.taskbar-app').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-window-id="${windowId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateTaskbarMinimized(windowId, minimized) {
        const btn = document.querySelector(`[data-window-id="${windowId}"]`);
        if (btn) {
            btn.style.opacity = minimized ? '0.5' : '1';
        }
    }

    getAppTitle(appName) {
        const titles = {
            'browser': 'Browser',
            'file-manager': 'File Manager',
            'code-editor': 'Code Editor',
            'terminal': 'Terminal',
            'paint': 'Paint',
            'video-editor': 'Video Editor',
            'games': 'Games',
            'settings': 'Settings'
        };
        return titles[appName] || appName;
    }

    getAppIcon(appName) {
        const icons = {
            'browser': '🌐',
            'file-manager': '📁',
            'code-editor': '💻',
            'terminal': '⚡',
            'paint': '🎨',
            'video-editor': '🎬',
            'games': '🎮',
            'settings': '⚙️'
        };
        return icons[appName] || '📄';
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        document.getElementById('time-display').textContent = timeString;
        
        setTimeout(() => this.updateTime(), 1000);
    }

    createNewFile() {
        // Create a new text file on desktop
        const desktopIcons = document.getElementById('desktop-icons');
        const newFile = document.createElement('div');
        newFile.className = 'desktop-icon';
        newFile.innerHTML = `
            <div class="icon">📄</div>
            <span>New Document.txt</span>
        `;
        desktopIcons.appendChild(newFile);
    }

    refreshDesktop() {
        // Refresh desktop icons
        console.log('Refreshing desktop...');
    }

    toggleViewMode() {
        // Toggle between grid and list view
        console.log('Toggling view mode...');
    }
}

// Initialize WebOS when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.webOS = new WebOS();
    
    // Setup start menu app tiles
    document.querySelectorAll('.app-tile').forEach(tile => {
        tile.addEventListener('click', (e) => {
            const appName = tile.dataset.app;
            window.webOS.openApp(appName);
        });
    });
});