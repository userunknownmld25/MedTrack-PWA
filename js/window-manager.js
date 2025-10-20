// Advanced Window Management System
class WindowManager {
    constructor(webOS) {
        this.webOS = webOS;
        this.windowStack = [];
        this.snapZones = this.createSnapZones();
        this.init();
    }

    init() {
        this.setupSnapZones();
        this.setupKeyboardShortcuts();
    }

    createSnapZones() {
        return {
            left: { x: 0, y: 0, width: '50vw', height: '100vh' },
            right: { x: '50vw', y: 0, width: '50vw', height: '100vh' },
            top: { x: 0, y: 0, width: '100vw', height: '50vh' },
            bottom: { x: 0, y: '50vh', width: '100vw', height: '50vh' },
            topLeft: { x: 0, y: 0, width: '50vw', height: '50vh' },
            topRight: { x: '50vw', y: 0, width: '50vw', height: '50vh' },
            bottomLeft: { x: 0, y: '50vh', width: '50vw', height: '50vh' },
            bottomRight: { x: '50vw', y: '50vh', width: '50vw', height: '50vh' }
        };
    }

    setupSnapZones() {
        // Create visual snap zone indicators
        const snapZoneContainer = document.createElement('div');
        snapZoneContainer.id = 'snap-zones';
        snapZoneContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 50;
            display: none;
        `;
        
        Object.keys(this.snapZones).forEach(zone => {
            const zoneElement = document.createElement('div');
            zoneElement.className = `snap-zone snap-zone-${zone}`;
            zoneElement.dataset.zone = zone;
            zoneElement.style.cssText = `
                position: absolute;
                background: rgba(0, 120, 212, 0.2);
                border: 2px solid var(--primary);
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;
            snapZoneContainer.appendChild(zoneElement);
        });
        
        document.body.appendChild(snapZoneContainer);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.webOS.activeWindow) return;
            
            const window = this.webOS.activeWindow;
            
            // Alt + F4 to close window
            if (e.altKey && e.key === 'F4') {
                e.preventDefault();
                this.webOS.closeWindow(window);
            }
            
            // Windows + Arrow keys for snapping
            if (e.metaKey || e.key === 'Super') {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.snapWindow(window, 'left');
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.snapWindow(window, 'right');
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.snapWindow(window, 'top');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.snapWindow(window, 'bottom');
                        break;
                }
            }
            
            // F11 for fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen(window);
            }
        });
    }

    snapWindow(window, zone) {
        const snapZone = this.snapZones[zone];
        if (!snapZone) return;
        
        const windowData = this.webOS.windows.get(parseInt(window.dataset.windowId));
        if (!windowData) return;
        
        // Remove maximized state
        window.classList.remove('maximized');
        windowData.maximized = false;
        
        // Apply snap zone dimensions
        window.style.left = snapZone.x;
        window.style.top = snapZone.y;
        window.style.width = snapZone.width;
        window.style.height = snapZone.height;
        
        this.webOS.showNotification('Window Snapped', `Window snapped to ${zone} zone`);
    }

    toggleFullscreen(window) {
        const windowData = this.webOS.windows.get(parseInt(window.dataset.windowId));
        if (!windowData) return;
        
        if (windowData.fullscreen) {
            this.exitFullscreen(window);
        } else {
            this.enterFullscreen(window);
        }
    }

    enterFullscreen(window) {
        const windowData = this.webOS.windows.get(parseInt(window.dataset.windowId));
        if (!windowData) return;
        
        // Store original dimensions
        windowData.originalDimensions = {
            left: window.style.left,
            top: window.style.top,
            width: window.style.width,
            height: window.style.height
        };
        
        // Apply fullscreen
        window.style.left = '0';
        window.style.top = '0';
        window.style.width = '100vw';
        window.style.height = '100vh';
        window.classList.add('fullscreen');
        windowData.fullscreen = true;
        
        this.webOS.showNotification('Fullscreen', 'Window entered fullscreen mode');
    }

    exitFullscreen(window) {
        const windowData = this.webOS.windows.get(parseInt(window.dataset.windowId));
        if (!windowData || !windowData.fullscreen) return;
        
        // Restore original dimensions
        const original = windowData.originalDimensions;
        window.style.left = original.left;
        window.style.top = original.top;
        window.style.width = original.width;
        window.style.height = original.height;
        window.classList.remove('fullscreen');
        windowData.fullscreen = false;
        
        this.webOS.showNotification('Fullscreen', 'Window exited fullscreen mode');
    }

    // Window cascading
    cascadeWindows() {
        const windows = Array.from(this.webOS.windows.values());
        if (windows.length === 0) return;
        
        const offset = 30;
        const startX = 50;
        const startY = 50;
        
        windows.forEach((windowData, index) => {
            const window = windowData.element;
            const x = startX + (index * offset);
            const y = startY + (index * offset);
            
            window.style.left = x + 'px';
            window.style.top = y + 'px';
            window.style.zIndex = (100 + index).toString();
        });
        
        this.webOS.showNotification('Cascade', 'Windows cascaded');
    }

    // Window tiling
    tileWindows() {
        const windows = Array.from(this.webOS.windows.values());
        if (windows.length === 0) return;
        
        const windowCount = windows.length;
        const cols = Math.ceil(Math.sqrt(windowCount));
        const rows = Math.ceil(windowCount / cols);
        
        const windowWidth = (100 / cols) + '%';
        const windowHeight = (100 / rows) + '%';
        
        windows.forEach((windowData, index) => {
            const window = windowData.element;
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            window.style.left = (col * (100 / cols)) + '%';
            window.style.top = (row * (100 / rows)) + '%';
            window.style.width = windowWidth;
            window.style.height = windowHeight;
            window.style.zIndex = (100 + index).toString();
        });
        
        this.webOS.showNotification('Tile', 'Windows tiled');
    }

    // Window grouping
    groupWindows(windows) {
        if (windows.length < 2) return;
        
        const groupId = 'group-' + Date.now();
        
        windows.forEach((window, index) => {
            window.dataset.groupId = groupId;
            window.style.zIndex = (200 + index).toString();
        });
        
        this.webOS.showNotification('Group', `${windows.length} windows grouped`);
    }

    ungroupWindows(groupId) {
        const windows = document.querySelectorAll(`[data-group-id="${groupId}"]`);
        windows.forEach(window => {
            window.removeAttribute('data-group-id');
            window.style.zIndex = '100';
        });
        
        this.webOS.showNotification('Ungroup', 'Windows ungrouped');
    }

    // Window animations
    animateWindow(window, animation, duration = 300) {
        return new Promise((resolve) => {
            window.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            
            switch (animation) {
                case 'fadeIn':
                    window.style.opacity = '0';
                    window.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        window.style.opacity = '1';
                        window.style.transform = 'scale(1)';
                    }, 10);
                    break;
                    
                case 'fadeOut':
                    window.style.opacity = '0';
                    window.style.transform = 'scale(0.9)';
                    break;
                    
                case 'slideIn':
                    window.style.transform = 'translateX(-100%)';
                    setTimeout(() => {
                        window.style.transform = 'translateX(0)';
                    }, 10);
                    break;
                    
                case 'slideOut':
                    window.style.transform = 'translateX(100%)';
                    break;
                    
                case 'bounce':
                    window.style.animation = 'bounce 0.6s ease';
                    break;
            }
            
            setTimeout(() => {
                window.style.transition = '';
                window.style.animation = '';
                resolve();
            }, duration);
        });
    }

    // Window focus management
    bringToFront(window) {
        const maxZ = Math.max(...Array.from(document.querySelectorAll('.window'))
            .map(w => parseInt(w.style.zIndex) || 100));
        
        window.style.zIndex = (maxZ + 1).toString();
        this.webOS.focusWindow(window);
    }

    // Window state persistence
    saveWindowStates() {
        const states = {};
        this.webOS.windows.forEach((windowData, windowId) => {
            const window = windowData.element;
            states[windowId] = {
                x: window.style.left,
                y: window.style.top,
                width: window.style.width,
                height: window.style.height,
                maximized: windowData.maximized,
                minimized: windowData.minimized,
                fullscreen: windowData.fullscreen || false
            };
        });
        
        localStorage.setItem('webos-window-states', JSON.stringify(states));
    }

    restoreWindowStates() {
        const states = JSON.parse(localStorage.getItem('webos-window-states') || '{}');
        return states;
    }

    // Window cleanup
    cleanup() {
        this.saveWindowStates();
    }
}

// Add bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0, -8px, 0);
        }
        70% {
            transform: translate3d(0, -4px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
`;
document.head.appendChild(style);