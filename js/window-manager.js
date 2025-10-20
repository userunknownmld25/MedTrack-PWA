// Window Manager for WebOS
class WindowManager {
    constructor() {
        this.windows = new Map();
        this.windowIdCounter = 0;
        this.activeWindow = null;
        this.zIndexCounter = 1000;
    }

    createWindow(config) {
        const windowId = ++this.windowIdCounter;
        const window = {
            id: windowId,
            title: config.title || 'Untitled',
            app: config.app,
            element: null,
            isMinimized: false,
            isMaximized: false,
            isActive: false,
            position: config.position || { x: 100, y: 100 },
            size: config.size || { width: 800, height: 600 },
            zIndex: this.zIndexCounter++
        };

        this.windows.set(windowId, window);
        this.createWindowElement(window);
        this.focusWindow(windowId);
        
        return windowId;
    }

    createWindowElement(window) {
        const template = document.getElementById('window-template');
        const windowElement = template.content.cloneNode(true);
        const windowDiv = windowElement.querySelector('.window');
        
        windowDiv.dataset.windowId = window.id;
        windowDiv.style.left = window.position.x + 'px';
        windowDiv.style.top = window.position.y + 'px';
        windowDiv.style.width = window.size.width + 'px';
        windowDiv.style.height = window.size.height + 'px';
        windowDiv.style.zIndex = window.zIndex;
        
        // Set window title
        const title = windowDiv.querySelector('.window-title');
        title.textContent = window.title;
        
        // Set window content
        const content = windowDiv.querySelector('.window-content');
        if (window.app && window.app.getHTML) {
            content.innerHTML = window.app.getHTML();
        }
        
        // Add to desktop
        document.getElementById('windows-container').appendChild(windowDiv);
        window.element = windowDiv;
        
        // Setup window controls
        this.setupWindowControls(window);
        
        // Initialize app if available
        if (window.app && window.app.init) {
            window.app.init(content, window.id);
        }
    }

    setupWindowControls(window) {
        const minimizeBtn = window.element.querySelector('.window-minimize');
        const maximizeBtn = window.element.querySelector('.window-maximize');
        const closeBtn = window.element.querySelector('.window-close');
        const header = window.element.querySelector('.window-header');
        
        // Window control buttons
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(window.id);
        });
        
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.maximizeWindow(window.id);
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(window.id);
        });
        
        // Make window draggable
        header.addEventListener('mousedown', (e) => {
            this.startWindowDrag(e, window.id);
        });
        
        // Focus window when clicked
        window.element.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.focusWindow(window.id);
        });
    }

    startWindowDrag(e, windowId) {
        const window = this.windows.get(windowId);
        if (!window || window.isMaximized) return;
        
        const rect = window.element.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;
        
        const handleMouseMove = (e) => {
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            
            // Constrain to viewport
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height - 48; // Account for taskbar
            
            window.position.x = Math.max(0, Math.min(newX, maxX));
            window.position.y = Math.max(0, Math.min(newY, maxY));
            
            window.element.style.left = window.position.x + 'px';
            window.element.style.top = window.position.y + 'px';
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
            window.isActive = false;
        });
        
        // Add active class to focused window
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.add('active');
            window.element.style.zIndex = this.zIndexCounter++;
            window.zIndex = window.element.style.zIndex;
            window.isActive = true;
            this.activeWindow = window;
            
            // Update taskbar
            this.updateTaskbarActive(windowId);
        }
    }

    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.isMinimized = !window.isMinimized;
            window.element.classList.toggle('minimized', window.isMinimized);
            this.updateTaskbarMinimized(windowId, window.isMinimized);
        }
    }

    maximizeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.isMaximized = !window.isMaximized;
            window.element.classList.toggle('maximized', window.isMaximized);
            
            if (window.isMaximized) {
                // Store original position and size
                window.originalPosition = { ...window.position };
                window.originalSize = { ...window.size };
                
                // Maximize
                window.element.style.left = '0';
                window.element.style.top = '0';
                window.element.style.width = '100vw';
                window.element.style.height = 'calc(100vh - 48px)';
            } else {
                // Restore original position and size
                window.element.style.left = window.originalPosition.x + 'px';
                window.element.style.top = window.originalPosition.y + 'px';
                window.element.style.width = window.originalSize.width + 'px';
                window.element.style.height = window.originalSize.height + 'px';
            }
        }
    }

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            // Clean up app if needed
            if (window.app && window.app.cleanup) {
                window.app.cleanup();
            }
            
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
            if (window.isMinimized) {
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

    // Cascade windows
    cascadeWindows() {
        const windows = Array.from(this.windows.values());
        const offset = 30;
        let x = 50;
        let y = 50;
        
        windows.forEach((window, index) => {
            if (!window.isMaximized) {
                window.position.x = x + (index * offset);
                window.position.y = y + (index * offset);
                window.element.style.left = window.position.x + 'px';
                window.element.style.top = window.position.y + 'px';
            }
        });
    }

    // Tile windows
    tileWindows() {
        const windows = Array.from(this.windows.values()).filter(w => !w.isMaximized);
        if (windows.length === 0) return;
        
        const cols = Math.ceil(Math.sqrt(windows.length));
        const rows = Math.ceil(windows.length / cols);
        const windowWidth = window.innerWidth / cols;
        const windowHeight = (window.innerHeight - 48) / rows;
        
        windows.forEach((window, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            window.position.x = col * windowWidth;
            window.position.y = row * windowHeight;
            window.size.width = windowWidth;
            window.size.height = windowHeight;
            
            window.element.style.left = window.position.x + 'px';
            window.element.style.top = window.position.y + 'px';
            window.element.style.width = window.size.width + 'px';
            window.element.style.height = window.size.height + 'px';
        });
    }

    // Get all windows
    getAllWindows() {
        return Array.from(this.windows.values());
    }

    // Get active window
    getActiveWindow() {
        return this.activeWindow;
    }

    // Check if window exists
    hasWindow(windowId) {
        return this.windows.has(windowId);
    }

    // Get window by ID
    getWindow(windowId) {
        return this.windows.get(windowId);
    }
}