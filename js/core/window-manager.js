// Window Management System for Windows 11 Web OS

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndexCounter = 100;
        this.taskbarApps = new Map();
        this.snapZones = {
            left: { x: 0, y: 0, width: 0.5, height: 1 },
            right: { x: 0.5, y: 0, width: 0.5, height: 1 },
            top: { x: 0, y: 0, width: 1, height: 0.5 },
            bottom: { x: 0, y: 0.5, width: 1, height: 0.5 },
            topLeft: { x: 0, y: 0, width: 0.5, height: 0.5 },
            topRight: { x: 0.5, y: 0, width: 0.5, height: 0.5 },
            bottomLeft: { x: 0, y: 0.5, width: 0.5, height: 0.5 },
            bottomRight: { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
            maximize: { x: 0, y: 0, width: 1, height: 1 }
        };
        this.dragState = null;
        this.resizeState = null;
        this.snapIndicator = null;
        
        this.initializeEventListeners();
        this.createSnapIndicator();
    }
    
    // Initialize global event listeners
    initializeEventListeners() {
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Prevent context menu on windows
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.window')) {
                e.preventDefault();
            }
        });
    }
    
    // Create snap indicator
    createSnapIndicator() {
        this.snapIndicator = document.createElement('div');
        this.snapIndicator.className = 'snap-indicator';
        document.body.appendChild(this.snapIndicator);
    }
    
    // Create a new window
    createWindow(options = {}) {
        const windowId = options.id || `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const defaultOptions = {
            title: 'Untitled Window',
            icon: 'fas fa-window-maximize',
            width: 800,
            height: 600,
            x: 100,
            y: 100,
            minWidth: 300,
            minHeight: 200,
            resizable: true,
            maximizable: true,
            minimizable: true,
            closable: true,
            content: '',
            className: '',
            onClose: null,
            onMinimize: null,
            onMaximize: null,
            onRestore: null,
            onFocus: null,
            onBlur: null
        };
        
        const windowOptions = { ...defaultOptions, ...options, id: windowId };
        
        // Create window element
        const windowElement = this.createWindowElement(windowOptions);
        
        // Create window object
        const windowObj = {
            id: windowId,
            element: windowElement,
            options: windowOptions,
            state: 'normal', // normal, minimized, maximized
            originalBounds: null,
            isActive: false,
            taskbarButton: null
        };
        
        // Store window
        this.windows.set(windowId, windowObj);
        
        // Add to DOM
        document.getElementById('windows-container').appendChild(windowElement);
        
        // Create taskbar button
        this.createTaskbarButton(windowObj);
        
        // Position window
        this.positionWindow(windowObj);
        
        // Focus window
        this.focusWindow(windowId);
        
        // Add animation
        windowElement.classList.add('opening');
        setTimeout(() => {
            windowElement.classList.remove('opening');
        }, 250);
        
        return windowId;
    }
    
    // Create window DOM element
    createWindowElement(options) {
        const windowElement = document.createElement('div');
        windowElement.className = `window ${options.className}`;
        windowElement.setAttribute('data-window-id', options.id);
        windowElement.style.width = options.width + 'px';
        windowElement.style.height = options.height + 'px';
        windowElement.style.zIndex = ++this.zIndexCounter;
        
        // Window header
        const header = document.createElement('div');
        header.className = 'window-header';
        
        const icon = document.createElement('div');
        icon.className = 'window-icon';
        icon.innerHTML = `<i class="${options.icon}"></i>`;
        
        const title = document.createElement('div');
        title.className = 'window-title';
        title.textContent = options.title;
        
        const controls = document.createElement('div');
        controls.className = 'window-controls';
        
        if (options.minimizable) {
            const minimizeBtn = document.createElement('button');
            minimizeBtn.className = 'window-control minimize';
            minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            minimizeBtn.addEventListener('click', () => this.minimizeWindow(options.id));
            controls.appendChild(minimizeBtn);
        }
        
        if (options.maximizable) {
            const maximizeBtn = document.createElement('button');
            maximizeBtn.className = 'window-control maximize';
            maximizeBtn.innerHTML = '<i class="fas fa-square"></i>';
            maximizeBtn.addEventListener('click', () => this.toggleMaximizeWindow(options.id));
            controls.appendChild(maximizeBtn);
        }
        
        if (options.closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'window-control close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.addEventListener('click', () => this.closeWindow(options.id));
            controls.appendChild(closeBtn);
        }
        
        header.appendChild(icon);
        header.appendChild(title);
        header.appendChild(controls);
        
        // Window content
        const content = document.createElement('div');
        content.className = 'window-content';
        if (typeof options.content === 'string') {
            content.innerHTML = options.content;
        } else if (options.content instanceof HTMLElement) {
            content.appendChild(options.content);
        }
        
        windowElement.appendChild(header);
        windowElement.appendChild(content);
        
        // Add resize handles if resizable
        if (options.resizable) {
            this.addResizeHandles(windowElement);
        }
        
        // Add event listeners
        this.addWindowEventListeners(windowElement, options);
        
        return windowElement;
    }
    
    // Add resize handles to window
    addResizeHandles(windowElement) {
        const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        
        handles.forEach(handle => {
            const handleElement = document.createElement('div');
            handleElement.className = `resize-handle ${handle}`;
            handleElement.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startResize(windowElement, handle, e);
            });
            windowElement.appendChild(handleElement);
        });
    }
    
    // Add window event listeners
    addWindowEventListeners(windowElement, options) {
        const header = windowElement.querySelector('.window-header');
        
        // Window dragging
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            e.preventDefault();
            this.startDrag(windowElement, e);
        });
        
        // Double-click to maximize
        header.addEventListener('dblclick', (e) => {
            if (e.target.closest('.window-control')) return;
            if (options.maximizable) {
                this.toggleMaximizeWindow(options.id);
            }
        });
        
        // Focus on click
        windowElement.addEventListener('mousedown', () => {
            this.focusWindow(options.id);
        });
        
        // Prevent text selection during drag
        windowElement.addEventListener('selectstart', (e) => {
            if (this.dragState || this.resizeState) {
                e.preventDefault();
            }
        });
    }
    
    // Position window (cascade or center)
    positionWindow(windowObj) {
        const { element, options } = windowObj;
        const container = document.getElementById('windows-container');
        const containerRect = container.getBoundingClientRect();
        
        let x = options.x;
        let y = options.y;
        
        // Auto-position if coordinates are not specified
        if (options.x === undefined || options.y === undefined) {
            const windowCount = this.windows.size;
            const offset = (windowCount - 1) * 30;
            
            x = Math.min(100 + offset, containerRect.width - options.width - 50);
            y = Math.min(100 + offset, containerRect.height - options.height - 100);
        }
        
        // Ensure window is within bounds
        x = Math.max(0, Math.min(x, containerRect.width - options.width));
        y = Math.max(0, Math.min(y, containerRect.height - options.height));
        
        element.style.left = x + 'px';
        element.style.top = y + 'px';
    }
    
    // Create taskbar button
    createTaskbarButton(windowObj) {
        const runningApps = document.getElementById('running-apps');
        const button = document.createElement('div');
        button.className = 'taskbar-app';
        button.setAttribute('data-window-id', windowObj.id);
        
        const icon = document.createElement('div');
        icon.className = 'app-icon';
        icon.innerHTML = `<i class="${windowObj.options.icon}"></i>`;
        
        button.appendChild(icon);
        button.addEventListener('click', () => {
            if (windowObj.state === 'minimized') {
                this.restoreWindow(windowObj.id);
            } else if (windowObj.isActive) {
                this.minimizeWindow(windowObj.id);
            } else {
                this.focusWindow(windowObj.id);
            }
        });
        
        runningApps.appendChild(button);
        windowObj.taskbarButton = button;
        
        // Add tooltip
        this.addTooltip(button, windowObj.options.title);
    }
    
    // Add tooltip to element
    addTooltip(element, text) {
        let tooltip = null;
        
        element.addEventListener('mouseenter', () => {
            tooltip = document.createElement('div');
            tooltip.className = 'taskbar-tooltip';
            tooltip.textContent = text;
            element.appendChild(tooltip);
            
            setTimeout(() => {
                if (tooltip) tooltip.classList.add('show');
            }, 500);
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    }
    
    // Focus window
    focusWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj || windowObj.state === 'minimized') return;
        
        // Blur current active window
        if (this.activeWindow && this.activeWindow !== windowId) {
            const prevWindow = this.windows.get(this.activeWindow);
            if (prevWindow) {
                prevWindow.element.classList.remove('focused');
                prevWindow.isActive = false;
                prevWindow.taskbarButton?.classList.remove('active');
                
                if (prevWindow.options.onBlur) {
                    prevWindow.options.onBlur(prevWindow);
                }
            }
        }
        
        // Focus new window
        windowObj.element.classList.add('focused');
        windowObj.element.style.zIndex = ++this.zIndexCounter;
        windowObj.isActive = true;
        windowObj.taskbarButton?.classList.add('active');
        this.activeWindow = windowId;
        
        if (windowObj.options.onFocus) {
            windowObj.options.onFocus(windowObj);
        }
    }
    
    // Minimize window
    minimizeWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj || windowObj.state === 'minimized') return;
        
        windowObj.element.classList.add('minimized');
        windowObj.state = 'minimized';
        windowObj.isActive = false;
        windowObj.taskbarButton?.classList.remove('active');
        
        if (this.activeWindow === windowId) {
            this.activeWindow = null;
            // Focus next available window
            const nextWindow = Array.from(this.windows.values())
                .find(w => w.state !== 'minimized' && w.id !== windowId);
            if (nextWindow) {
                this.focusWindow(nextWindow.id);
            }
        }
        
        if (windowObj.options.onMinimize) {
            windowObj.options.onMinimize(windowObj);
        }
    }
    
    // Restore window
    restoreWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj) return;
        
        if (windowObj.state === 'minimized') {
            windowObj.element.classList.remove('minimized');
            windowObj.state = 'normal';
            this.focusWindow(windowId);
        } else if (windowObj.state === 'maximized') {
            this.unmaximizeWindow(windowId);
        }
        
        if (windowObj.options.onRestore) {
            windowObj.options.onRestore(windowObj);
        }
    }
    
    // Maximize window
    maximizeWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj || windowObj.state === 'maximized') return;
        
        // Store original bounds
        const element = windowObj.element;
        windowObj.originalBounds = {
            x: parseInt(element.style.left),
            y: parseInt(element.style.top),
            width: parseInt(element.style.width),
            height: parseInt(element.style.height)
        };
        
        element.classList.add('maximized');
        windowObj.state = 'maximized';
        
        // Update maximize button icon
        const maximizeBtn = element.querySelector('.window-control.maximize i');
        if (maximizeBtn) {
            maximizeBtn.className = 'fas fa-window-restore';
        }
        
        if (windowObj.options.onMaximize) {
            windowObj.options.onMaximize(windowObj);
        }
    }
    
    // Unmaximize window
    unmaximizeWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj || windowObj.state !== 'maximized') return;
        
        const element = windowObj.element;
        element.classList.remove('maximized');
        windowObj.state = 'normal';
        
        // Restore original bounds
        if (windowObj.originalBounds) {
            element.style.left = windowObj.originalBounds.x + 'px';
            element.style.top = windowObj.originalBounds.y + 'px';
            element.style.width = windowObj.originalBounds.width + 'px';
            element.style.height = windowObj.originalBounds.height + 'px';
        }
        
        // Update maximize button icon
        const maximizeBtn = element.querySelector('.window-control.maximize i');
        if (maximizeBtn) {
            maximizeBtn.className = 'fas fa-square';
        }
        
        if (windowObj.options.onRestore) {
            windowObj.options.onRestore(windowObj);
        }
    }
    
    // Toggle maximize window
    toggleMaximizeWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj) return;
        
        if (windowObj.state === 'maximized') {
            this.unmaximizeWindow(windowId);
        } else {
            this.maximizeWindow(windowId);
        }
    }
    
    // Close window
    closeWindow(windowId) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj) return;
        
        // Call onClose callback
        if (windowObj.options.onClose) {
            const shouldClose = windowObj.options.onClose(windowObj);
            if (shouldClose === false) return;
        }
        
        // Add closing animation
        windowObj.element.classList.add('closing');
        
        setTimeout(() => {
            // Remove from DOM
            windowObj.element.remove();
            
            // Remove taskbar button
            if (windowObj.taskbarButton) {
                windowObj.taskbarButton.classList.add('closing');
                setTimeout(() => {
                    windowObj.taskbarButton.remove();
                }, 200);
            }
            
            // Remove from windows map
            this.windows.delete(windowId);
            
            // Update active window
            if (this.activeWindow === windowId) {
                this.activeWindow = null;
                // Focus next available window
                const nextWindow = Array.from(this.windows.values())
                    .find(w => w.state !== 'minimized');
                if (nextWindow) {
                    this.focusWindow(nextWindow.id);
                }
            }
        }, 150);
    }
    
    // Start window dragging
    startDrag(windowElement, event) {
        const windowId = windowElement.getAttribute('data-window-id');
        const windowObj = this.windows.get(windowId);
        
        if (!windowObj || windowObj.state === 'maximized') return;
        
        this.dragState = {
            windowId: windowId,
            startX: event.clientX,
            startY: event.clientY,
            startLeft: parseInt(windowElement.style.left),
            startTop: parseInt(windowElement.style.top),
            wasMaximized: false
        };
        
        windowElement.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        
        this.focusWindow(windowId);
    }
    
    // Start window resizing
    startResize(windowElement, handle, event) {
        const windowId = windowElement.getAttribute('data-window-id');
        const windowObj = this.windows.get(windowId);
        
        if (!windowObj || windowObj.state === 'maximized') return;
        
        const rect = windowElement.getBoundingClientRect();
        
        this.resizeState = {
            windowId: windowId,
            handle: handle,
            startX: event.clientX,
            startY: event.clientY,
            startWidth: rect.width,
            startHeight: rect.height,
            startLeft: rect.left,
            startTop: rect.top
        };
        
        windowElement.classList.add('resizing');
        document.body.style.userSelect = 'none';
        
        this.focusWindow(windowId);
    }
    
    // Handle mouse move
    handleMouseMove(event) {
        if (this.dragState) {
            this.handleDragMove(event);
        } else if (this.resizeState) {
            this.handleResizeMove(event);
        }
    }
    
    // Handle drag move
    handleDragMove(event) {
        const windowObj = this.windows.get(this.dragState.windowId);
        if (!windowObj) return;
        
        const deltaX = event.clientX - this.dragState.startX;
        const deltaY = event.clientY - this.dragState.startY;
        
        let newLeft = this.dragState.startLeft + deltaX;
        let newTop = this.dragState.startTop + deltaY;
        
        // Constrain to viewport
        const container = document.getElementById('windows-container');
        const containerRect = container.getBoundingClientRect();
        const windowRect = windowObj.element.getBoundingClientRect();
        
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - windowRect.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - windowRect.height));
        
        windowObj.element.style.left = newLeft + 'px';
        windowObj.element.style.top = newTop + 'px';
        
        // Check for snap zones
        this.checkSnapZones(event, windowObj);
    }
    
    // Handle resize move
    handleResizeMove(event) {
        const windowObj = this.windows.get(this.resizeState.windowId);
        if (!windowObj) return;
        
        const deltaX = event.clientX - this.resizeState.startX;
        const deltaY = event.clientY - this.resizeState.startY;
        const handle = this.resizeState.handle;
        
        let newWidth = this.resizeState.startWidth;
        let newHeight = this.resizeState.startHeight;
        let newLeft = this.resizeState.startLeft;
        let newTop = this.resizeState.startTop;
        
        // Calculate new dimensions based on handle
        if (handle.includes('e')) {
            newWidth = Math.max(windowObj.options.minWidth, this.resizeState.startWidth + deltaX);
        }
        if (handle.includes('w')) {
            newWidth = Math.max(windowObj.options.minWidth, this.resizeState.startWidth - deltaX);
            newLeft = this.resizeState.startLeft + (this.resizeState.startWidth - newWidth);
        }
        if (handle.includes('s')) {
            newHeight = Math.max(windowObj.options.minHeight, this.resizeState.startHeight + deltaY);
        }
        if (handle.includes('n')) {
            newHeight = Math.max(windowObj.options.minHeight, this.resizeState.startHeight - deltaY);
            newTop = this.resizeState.startTop + (this.resizeState.startHeight - newHeight);
        }
        
        // Apply new dimensions
        windowObj.element.style.width = newWidth + 'px';
        windowObj.element.style.height = newHeight + 'px';
        windowObj.element.style.left = newLeft + 'px';
        windowObj.element.style.top = newTop + 'px';
    }
    
    // Check snap zones during drag
    checkSnapZones(event, windowObj) {
        const container = document.getElementById('windows-container');
        const containerRect = container.getBoundingClientRect();
        const snapThreshold = 20;
        
        let snapZone = null;
        
        // Check edges for snapping
        if (event.clientY <= containerRect.top + snapThreshold) {
            if (event.clientX <= containerRect.left + snapThreshold) {
                snapZone = 'topLeft';
            } else if (event.clientX >= containerRect.right - snapThreshold) {
                snapZone = 'topRight';
            } else {
                snapZone = 'maximize';
            }
        } else if (event.clientY >= containerRect.bottom - snapThreshold) {
            if (event.clientX <= containerRect.left + snapThreshold) {
                snapZone = 'bottomLeft';
            } else if (event.clientX >= containerRect.right - snapThreshold) {
                snapZone = 'bottomRight';
            } else {
                snapZone = 'bottom';
            }
        } else if (event.clientX <= containerRect.left + snapThreshold) {
            snapZone = 'left';
        } else if (event.clientX >= containerRect.right - snapThreshold) {
            snapZone = 'right';
        }
        
        // Show snap indicator
        if (snapZone) {
            this.showSnapIndicator(snapZone, containerRect);
        } else {
            this.hideSnapIndicator();
        }
        
        this.dragState.snapZone = snapZone;
    }
    
    // Show snap indicator
    showSnapIndicator(zone, containerRect) {
        const snapZone = this.snapZones[zone];
        if (!snapZone) return;
        
        this.snapIndicator.style.left = (containerRect.left + snapZone.x * containerRect.width) + 'px';
        this.snapIndicator.style.top = (containerRect.top + snapZone.y * containerRect.height) + 'px';
        this.snapIndicator.style.width = (snapZone.width * containerRect.width) + 'px';
        this.snapIndicator.style.height = (snapZone.height * containerRect.height) + 'px';
        this.snapIndicator.classList.add('show');
    }
    
    // Hide snap indicator
    hideSnapIndicator() {
        this.snapIndicator.classList.remove('show');
    }
    
    // Handle mouse up
    handleMouseUp(event) {
        if (this.dragState) {
            this.endDrag(event);
        } else if (this.resizeState) {
            this.endResize(event);
        }
    }
    
    // End window dragging
    endDrag(event) {
        const windowObj = this.windows.get(this.dragState.windowId);
        if (!windowObj) return;
        
        // Apply snap if in snap zone
        if (this.dragState.snapZone) {
            this.snapWindow(this.dragState.windowId, this.dragState.snapZone);
        }
        
        windowObj.element.style.cursor = '';
        document.body.style.userSelect = '';
        this.hideSnapIndicator();
        this.dragState = null;
    }
    
    // End window resizing
    endResize(event) {
        const windowObj = this.windows.get(this.resizeState.windowId);
        if (!windowObj) return;
        
        windowObj.element.classList.remove('resizing');
        document.body.style.userSelect = '';
        this.resizeState = null;
    }
    
    // Snap window to zone
    snapWindow(windowId, zone) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj) return;
        
        if (zone === 'maximize') {
            this.maximizeWindow(windowId);
            return;
        }
        
        const container = document.getElementById('windows-container');
        const containerRect = container.getBoundingClientRect();
        const snapZone = this.snapZones[zone];
        
        if (!snapZone) return;
        
        // Store original bounds if not already stored
        if (!windowObj.originalBounds) {
            windowObj.originalBounds = {
                x: parseInt(windowObj.element.style.left),
                y: parseInt(windowObj.element.style.top),
                width: parseInt(windowObj.element.style.width),
                height: parseInt(windowObj.element.style.height)
            };
        }
        
        // Apply snap dimensions
        windowObj.element.style.left = (snapZone.x * containerRect.width) + 'px';
        windowObj.element.style.top = (snapZone.y * containerRect.height) + 'px';
        windowObj.element.style.width = (snapZone.width * containerRect.width) + 'px';
        windowObj.element.style.height = (snapZone.height * containerRect.height) + 'px';
        
        windowObj.state = 'snapped';
    }
    
    // Handle keyboard shortcuts
    handleKeyDown(event) {
        if (!this.activeWindow) return;
        
        const windowObj = this.windows.get(this.activeWindow);
        if (!windowObj) return;
        
        // Alt + F4 - Close window
        if (event.altKey && event.key === 'F4') {
            event.preventDefault();
            this.closeWindow(this.activeWindow);
        }
        
        // Windows key + Up - Maximize
        if (event.metaKey && event.key === 'ArrowUp') {
            event.preventDefault();
            if (windowObj.options.maximizable) {
                this.maximizeWindow(this.activeWindow);
            }
        }
        
        // Windows key + Down - Minimize/Restore
        if (event.metaKey && event.key === 'ArrowDown') {
            event.preventDefault();
            if (windowObj.state === 'maximized') {
                this.unmaximizeWindow(this.activeWindow);
            } else if (windowObj.options.minimizable) {
                this.minimizeWindow(this.activeWindow);
            }
        }
        
        // Windows key + Left - Snap left
        if (event.metaKey && event.key === 'ArrowLeft') {
            event.preventDefault();
            this.snapWindow(this.activeWindow, 'left');
        }
        
        // Windows key + Right - Snap right
        if (event.metaKey && event.key === 'ArrowRight') {
            event.preventDefault();
            this.snapWindow(this.activeWindow, 'right');
        }
    }
    
    // Get window by ID
    getWindow(windowId) {
        return this.windows.get(windowId);
    }
    
    // Get all windows
    getAllWindows() {
        return Array.from(this.windows.values());
    }
    
    // Get active window
    getActiveWindow() {
        return this.activeWindow ? this.windows.get(this.activeWindow) : null;
    }
    
    // Update window title
    updateWindowTitle(windowId, title) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj) return;
        
        const titleElement = windowObj.element.querySelector('.window-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        windowObj.options.title = title;
    }
    
    // Update window content
    updateWindowContent(windowId, content) {
        const windowObj = this.windows.get(windowId);
        if (!windowObj) return;
        
        const contentElement = windowObj.element.querySelector('.window-content');
        if (contentElement) {
            if (typeof content === 'string') {
                contentElement.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                contentElement.innerHTML = '';
                contentElement.appendChild(content);
            }
        }
    }
    
    // Show task view
    showTaskView() {
        const taskView = document.createElement('div');
        taskView.className = 'task-view show';
        taskView.id = 'task-view';
        
        const grid = document.createElement('div');
        grid.className = 'task-view-grid';
        
        // Add windows to task view
        this.windows.forEach(windowObj => {
            if (windowObj.state === 'minimized') return;
            
            const taskWindow = document.createElement('div');
            taskWindow.className = 'task-view-window';
            
            const header = document.createElement('div');
            header.className = 'task-view-window-header';
            
            const icon = document.createElement('div');
            icon.className = 'task-view-window-icon';
            icon.innerHTML = `<i class="${windowObj.options.icon}"></i>`;
            
            const title = document.createElement('div');
            title.className = 'task-view-window-title';
            title.textContent = windowObj.options.title;
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'task-view-window-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeWindow(windowObj.id);
                this.hideTaskView();
            });
            
            header.appendChild(icon);
            header.appendChild(title);
            header.appendChild(closeBtn);
            
            const content = document.createElement('div');
            content.className = 'task-view-window-content';
            content.textContent = 'Window Preview';
            
            taskWindow.appendChild(header);
            taskWindow.appendChild(content);
            
            taskWindow.addEventListener('click', () => {
                this.focusWindow(windowObj.id);
                this.hideTaskView();
            });
            
            grid.appendChild(taskWindow);
        });
        
        taskView.appendChild(grid);
        
        // Close on click outside
        taskView.addEventListener('click', (e) => {
            if (e.target === taskView) {
                this.hideTaskView();
            }
        });
        
        document.body.appendChild(taskView);
        
        // Close on Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hideTaskView();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    // Hide task view
    hideTaskView() {
        const taskView = document.getElementById('task-view');
        if (taskView) {
            taskView.remove();
        }
    }
    
    // Minimize all windows
    minimizeAllWindows() {
        this.windows.forEach(windowObj => {
            if (windowObj.state !== 'minimized') {
                this.minimizeWindow(windowObj.id);
            }
        });
    }
    
    // Close all windows
    closeAllWindows() {
        const windowIds = Array.from(this.windows.keys());
        windowIds.forEach(windowId => {
            this.closeWindow(windowId);
        });
    }
}

// Global window manager instance
window.windowManager = new WindowManager();