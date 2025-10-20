// Main WebOS Application Entry Point
class WebOSMain {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeWebOS();
        });
    }

    initializeWebOS() {
        if (this.isInitialized) return;
        
        console.log('Initializing WebOS...');
        
        // Initialize core systems
        this.initializeCore();
        
        // Initialize applications
        this.initializeApplications();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Setup system tray
        this.setupSystemTray();
        
        // Setup notifications
        this.setupNotifications();
        
        // Setup theme system
        this.setupThemeSystem();
        
        // Setup settings
        this.setupSettings();
        
        this.isInitialized = true;
        console.log('WebOS initialized successfully!');
        
        // Show welcome notification
        this.showWelcomeNotification();
    }

    initializeCore() {
        // Core systems are already initialized in their respective files
        console.log('Core systems initialized');
    }

    initializeApplications() {
        // Applications are initialized in their respective files
        console.log('Applications initialized');
    }

    setupGlobalEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Global mouse events
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        // Global context menu
        document.addEventListener('contextmenu', (e) => {
            this.handleGlobalContextMenu(e);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Before unload
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
    }

    handleGlobalKeyboard(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey && e.key === 'q') {
            e.preventDefault();
            this.showShutdownDialog();
        }

        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            this.showHelp();
        }

        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.showSettings();
        }

        if (e.key === 'F11') {
            e.preventDefault();
            this.toggleFullscreen();
        }

        if (e.key === 'F12') {
            e.preventDefault();
            this.openDevTools();
        }
    }

    handleGlobalClick(e) {
        // Handle global click events
        const target = e.target;
        
        // Close dropdowns and menus when clicking outside
        if (!target.closest('.start-menu') && !target.closest('#start-button')) {
            this.closeStartMenu();
        }
        
        if (!target.closest('.context-menu')) {
            this.closeContextMenu();
        }
    }

    handleGlobalContextMenu(e) {
        // Handle global context menu
        e.preventDefault();
        this.showGlobalContextMenu(e.clientX, e.clientY);
    }

    handleWindowResize() {
        // Handle window resize
        this.updateLayout();
    }

    handleBeforeUnload() {
        // Save state before leaving
        this.saveApplicationState();
    }

    setupSystemTray() {
        const trayIcons = document.querySelectorAll('.tray-icon');
        trayIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.handleTrayIconClick(e.target);
            });
        });
    }

    handleTrayIconClick(icon) {
        const iconText = icon.textContent;
        
        switch (iconText) {
            case '🔊':
                this.showVolumeControl();
                break;
            case '🌐':
                this.showNetworkStatus();
                break;
            case '🔋':
                this.showBatteryStatus();
                break;
            case '📅':
                this.showDateTime();
                break;
        }
    }

    setupNotifications() {
        // Notification system is handled by the core WebOS class
        console.log('Notification system initialized');
    }

    setupThemeSystem() {
        // Load saved theme
        const savedTheme = localStorage.getItem('webos-theme') || 'light';
        this.setTheme(savedTheme);
        
        // Setup theme toggle
        this.setupThemeToggle();
    }

    setTheme(theme) {
        document.body.className = `theme-${theme}`;
        localStorage.setItem('webos-theme', theme);
    }

    setupThemeToggle() {
        // Theme toggle functionality
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.className.includes('dark') ? 'light' : 'dark';
            this.setTheme(currentTheme);
            themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        });
        
        const taskbarRight = document.querySelector('.taskbar-right');
        if (taskbarRight) {
            taskbarRight.appendChild(themeToggle);
        }
    }

    setupSettings() {
        // Load settings
        this.loadSettings();
        
        // Setup settings panel
        this.setupSettingsPanel();
    }

    loadSettings() {
        const settings = {
            theme: 'light',
            wallpaper: 'default',
            soundEnabled: true,
            animationsEnabled: true,
            autoSave: true,
            language: 'en'
        };
        
        const savedSettings = localStorage.getItem('webos-settings');
        if (savedSettings) {
            Object.assign(settings, JSON.parse(savedSettings));
        }
        
        this.settings = settings;
        this.applySettings();
    }

    saveSettings() {
        localStorage.setItem('webos-settings', JSON.stringify(this.settings));
    }

    applySettings() {
        // Apply theme
        this.setTheme(this.settings.theme);
        
        // Apply wallpaper
        this.setWallpaper(this.settings.wallpaper);
        
        // Apply other settings
        if (!this.settings.animationsEnabled) {
            document.body.classList.add('no-animations');
        }
    }

    setWallpaper(wallpaper) {
        const desktop = document.querySelector('.desktop');
        if (desktop) {
            desktop.style.background = wallpaper === 'default' ? 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                `url(${wallpaper}) center/cover`;
        }
    }

    setupSettingsPanel() {
        // Settings panel is handled by the SettingsApp class
        console.log('Settings panel initialized');
    }

    showWelcomeNotification() {
        if (window.webOS) {
            window.webOS.showNotification(
                'Welcome to WebOS',
                'Your Windows 11 replica is ready! Click the Start button to begin.'
            );
        }
    }

    showShutdownDialog() {
        if (confirm('Are you sure you want to shutdown WebOS?')) {
            this.shutdown();
        }
    }

    shutdown() {
        // Save all data
        this.saveApplicationState();
        
        // Show shutdown message
        if (window.webOS) {
            window.webOS.showNotification('WebOS', 'Shutting down...');
        }
        
        // Close all windows
        setTimeout(() => {
            window.close();
        }, 1000);
    }

    showHelp() {
        const helpContent = `
WebOS - Windows 11 Replica

Keyboard Shortcuts:
- Windows Key: Open Start Menu
- Alt + Tab: Switch between windows
- Ctrl + Q: Shutdown
- Ctrl + H: Show this help
- Ctrl + S: Open Settings
- F11: Toggle fullscreen
- F12: Open Developer Tools

Applications:
- File Manager: Manage your files
- Browser: Surf the web
- Text Editor: Edit text files
- Code Editor: Write code with syntax highlighting
- Terminal: Command line interface
- Paint: Draw and edit images
- Video Editor: Edit videos
- Games: Play built-in games

Features:
- Window management with drag, resize, minimize, maximize
- Taskbar with running applications
- Start menu with all applications
- Desktop with icons
- System tray with status indicators
- Notifications system
- Theme support (Light/Dark)
- Settings panel
- File management
- Web browser
- Code editor with syntax highlighting
- Terminal with Python support
- Paint application
- Video editor
- Games collection
- And much more!

Enjoy your WebOS experience!
        `;
        
        if (window.webOS) {
            window.webOS.showNotification('WebOS Help', helpContent);
        } else {
            alert(helpContent);
        }
    }

    showSettings() {
        if (window.webOS) {
            window.webOS.openApplication('settings');
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    openDevTools() {
        // Open browser developer tools
        console.log('Opening Developer Tools...');
        // This would open the browser's developer tools
    }

    closeStartMenu() {
        if (window.webOS) {
            window.webOS.closeStartMenu();
        }
    }

    closeContextMenu() {
        if (window.webOS) {
            window.webOS.closeContextMenu();
        }
    }

    showGlobalContextMenu(x, y) {
        if (window.webOS) {
            window.webOS.showDesktopContextMenu(x, y);
        }
    }

    updateLayout() {
        // Update layout on window resize
        console.log('Layout updated');
    }

    saveApplicationState() {
        // Save application state
        const state = {
            windows: Array.from(window.webOS.windows.entries()),
            settings: this.settings,
            timestamp: Date.now()
        };
        
        localStorage.setItem('webos-state', JSON.stringify(state));
    }

    loadApplicationState() {
        const savedState = localStorage.getItem('webos-state');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.settings = state.settings || this.settings;
            this.applySettings();
        }
    }

    showVolumeControl() {
        if (window.webOS) {
            window.webOS.showNotification('Volume', 'Volume control coming soon!');
        }
    }

    showNetworkStatus() {
        if (window.webOS) {
            window.webOS.showNotification('Network', 'Connected to Internet');
        }
    }

    showBatteryStatus() {
        if (window.webOS) {
            window.webOS.showNotification('Battery', 'Battery: 100%');
        }
    }

    showDateTime() {
        const now = new Date();
        const dateTime = now.toLocaleString();
        if (window.webOS) {
            window.webOS.showNotification('Date & Time', dateTime);
        }
    }

    // Utility methods
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString();
    }

    // Error handling
    handleError(error) {
        console.error('WebOS Error:', error);
        if (window.webOS) {
            window.webOS.showNotification('Error', error.message || 'An error occurred');
        }
    }

    // Performance monitoring
    monitorPerformance() {
        setInterval(() => {
            const memory = performance.memory;
            if (memory) {
                console.log('Memory Usage:', {
                    used: this.formatBytes(memory.usedJSHeapSize),
                    total: this.formatBytes(memory.totalJSHeapSize),
                    limit: this.formatBytes(memory.jsHeapSizeLimit)
                });
            }
        }, 30000); // Every 30 seconds
    }
}

// Initialize WebOS Main
window.webOSMain = new WebOSMain();

// Global error handling
window.addEventListener('error', (e) => {
    if (window.webOSMain) {
        window.webOSMain.handleError(e.error);
    }
});

// Global unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    if (window.webOSMain) {
        window.webOSMain.handleError(e.reason);
    }
});

// Start performance monitoring
if (window.webOSMain) {
    window.webOSMain.monitorPerformance();
}