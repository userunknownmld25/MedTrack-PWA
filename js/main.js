// Main Application System for Windows 11 Web OS

class ApplicationManager {
    constructor() {
        this.applications = new Map();
        this.isLoading = true;
        
        this.initializeApplications();
        this.initializeSystem();
    }
    
    // Initialize all applications
    initializeApplications() {
        // Register all available applications
        this.registerApplication('file-manager', {
            name: 'File Manager',
            icon: 'fas fa-folder',
            class: FileManagerApp,
            singleton: false
        });
        
        this.registerApplication('text-editor', {
            name: 'Text Editor',
            icon: 'fas fa-file-alt',
            class: TextEditorApp,
            singleton: false
        });
        
        this.registerApplication('code-editor', {
            name: 'Code Editor',
            icon: 'fas fa-code',
            class: CodeEditorApp,
            singleton: false
        });
        
        this.registerApplication('terminal', {
            name: 'Terminal',
            icon: 'fas fa-terminal',
            class: TerminalApp,
            singleton: false
        });
        
        this.registerApplication('browser', {
            name: 'Web Browser',
            icon: 'fas fa-globe',
            class: BrowserApp,
            singleton: false
        });
        
        this.registerApplication('paint', {
            name: 'Paint',
            icon: 'fas fa-paint-brush',
            class: PaintApp,
            singleton: false
        });
        
        this.registerApplication('video-editor', {
            name: 'Video Editor',
            icon: 'fas fa-video',
            class: VideoEditorApp,
            singleton: false
        });
        
        this.registerApplication('games', {
            name: 'Games',
            icon: 'fas fa-gamepad',
            class: GamesApp,
            singleton: true
        });
        
        this.registerApplication('app-store', {
            name: 'App Store',
            icon: 'fas fa-store',
            class: AppStoreApp,
            singleton: true
        });
        
        this.registerApplication('calculator', {
            name: 'Calculator',
            icon: 'fas fa-calculator',
            class: CalculatorApp,
            singleton: false
        });
        
        this.registerApplication('settings', {
            name: 'Settings',
            icon: 'fas fa-cog',
            class: SettingsApp,
            singleton: true
        });
    }
    
    // Register an application
    registerApplication(id, config) {
        this.applications.set(id, {
            id,
            ...config,
            instances: new Map()
        });
    }
    
    // Open an application
    openApplication(appId, options = {}) {
        const appConfig = this.applications.get(appId);
        if (!appConfig) {
            console.error(`Application ${appId} not found`);
            return null;
        }
        
        // Check if singleton and already running
        if (appConfig.singleton && appConfig.instances.size > 0) {
            const existingInstance = Array.from(appConfig.instances.values())[0];
            if (window.windowManager) {
                window.windowManager.focusWindow(existingInstance.windowId);
            }
            return existingInstance;
        }
        
        try {
            // Create application instance
            const appInstance = new appConfig.class(options);
            const instanceId = `${appId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Create window for the application
            const windowId = window.windowManager.createWindow({
                id: `window-${instanceId}`,
                title: appConfig.name,
                icon: appConfig.icon,
                width: appInstance.defaultWidth || 800,
                height: appInstance.defaultHeight || 600,
                minWidth: appInstance.minWidth || 300,
                minHeight: appInstance.minHeight || 200,
                content: appInstance.render(),
                className: `app-${appId}`,
                onClose: () => this.closeApplication(appId, instanceId),
                onFocus: () => appInstance.onFocus && appInstance.onFocus(),
                onBlur: () => appInstance.onBlur && appInstance.onBlur()
            });
            
            // Store instance
            const instance = {
                id: instanceId,
                app: appInstance,
                windowId: windowId,
                appId: appId
            };
            
            appConfig.instances.set(instanceId, instance);
            
            // Initialize the application
            if (appInstance.initialize) {
                appInstance.initialize(windowId, instanceId);
            }
            
            return instance;
            
        } catch (error) {
            console.error(`Failed to open application ${appId}:`, error);
            return null;
        }
    }
    
    // Close an application instance
    closeApplication(appId, instanceId) {
        const appConfig = this.applications.get(appId);
        if (!appConfig) return;
        
        const instance = appConfig.instances.get(instanceId);
        if (!instance) return;
        
        // Call cleanup if available
        if (instance.app.cleanup) {
            instance.app.cleanup();
        }
        
        // Remove instance
        appConfig.instances.delete(instanceId);
        
        return true;
    }
    
    // Get application instance
    getApplicationInstance(appId, instanceId) {
        const appConfig = this.applications.get(appId);
        if (!appConfig) return null;
        
        return appConfig.instances.get(instanceId);
    }
    
    // Get all instances of an application
    getApplicationInstances(appId) {
        const appConfig = this.applications.get(appId);
        if (!appConfig) return [];
        
        return Array.from(appConfig.instances.values());
    }
    
    // Initialize the system
    initializeSystem() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.startSystem();
            });
        } else {
            this.startSystem();
        }
    }
    
    // Start the system
    startSystem() {
        // Show loading screen initially
        this.showLoadingScreen();
        
        // Initialize system components
        this.initializeSystemComponents();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showWelcomeNotification();
        }, 2000);
    }
    
    // Initialize system components
    initializeSystemComponents() {
        // Initialize desktop
        if (window.desktop) {
            window.desktop.loadDesktopState();
        }
        
        // Add welcome notification
        setTimeout(() => {
            if (window.taskbar) {
                window.taskbar.addNotification(
                    'Welcome to Windows 11 Web OS',
                    'Your desktop environment is ready to use!',
                    'fas fa-info-circle'
                );
            }
        }, 3000);
        
        // Set up periodic system updates
        this.startSystemUpdates();
    }
    
    // Show loading screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    // Hide loading screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
            }, 500);
        }
    }
    
    // Show welcome notification
    showWelcomeNotification() {
        if (window.taskbar) {
            setTimeout(() => {
                window.taskbar.addNotification(
                    'System Ready',
                    'All applications and services are now available.',
                    'fas fa-check-circle'
                );
            }, 1000);
        }
    }
    
    // Start system updates
    startSystemUpdates() {
        // Update system status every minute
        setInterval(() => {
            this.updateSystemStatus();
        }, 60000);
        
        // Save system state every 5 minutes
        setInterval(() => {
            this.saveSystemState();
        }, 300000);
    }
    
    // Update system status
    updateSystemStatus() {
        // Update memory usage
        if (performance.memory) {
            const memoryUsage = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
            
            // Log memory usage (could be displayed in task manager)
            console.log('Memory usage:', memoryUsage);
        }
        
        // Update running applications count
        let totalInstances = 0;
        this.applications.forEach(app => {
            totalInstances += app.instances.size;
        });
        
        console.log(`Running applications: ${totalInstances}`);
    }
    
    // Save system state
    saveSystemState() {
        try {
            const systemState = {
                timestamp: new Date().toISOString(),
                applications: {},
                windows: []
            };
            
            // Save application states
            this.applications.forEach((appConfig, appId) => {
                if (appConfig.instances.size > 0) {
                    systemState.applications[appId] = {
                        instanceCount: appConfig.instances.size,
                        instances: Array.from(appConfig.instances.keys())
                    };
                }
            });
            
            // Save window states
            if (window.windowManager) {
                const windows = window.windowManager.getAllWindows();
                systemState.windows = windows.map(w => ({
                    id: w.id,
                    title: w.options.title,
                    state: w.state,
                    bounds: {
                        x: parseInt(w.element.style.left),
                        y: parseInt(w.element.style.top),
                        width: parseInt(w.element.style.width),
                        height: parseInt(w.element.style.height)
                    }
                }));
            }
            
            localStorage.setItem('systemState', JSON.stringify(systemState));
            
        } catch (error) {
            console.error('Failed to save system state:', error);
        }
    }
    
    // Load system state
    loadSystemState() {
        try {
            const savedState = localStorage.getItem('systemState');
            if (!savedState) return;
            
            const systemState = JSON.parse(savedState);
            console.log('Loaded system state:', systemState);
            
            // Could restore applications and windows here
            
        } catch (error) {
            console.error('Failed to load system state:', error);
        }
    }
    
    // Handle global keyboard shortcuts
    handleGlobalShortcuts(event) {
        // Ctrl+Alt+T - Open Terminal
        if (event.ctrlKey && event.altKey && event.key === 't') {
            event.preventDefault();
            this.openApplication('terminal');
        }
        
        // Ctrl+Alt+F - Open File Manager
        if (event.ctrlKey && event.altKey && event.key === 'f') {
            event.preventDefault();
            this.openApplication('file-manager');
        }
        
        // Ctrl+Alt+B - Open Browser
        if (event.ctrlKey && event.altKey && event.key === 'b') {
            event.preventDefault();
            this.openApplication('browser');
        }
        
        // Ctrl+Alt+C - Open Calculator
        if (event.ctrlKey && event.altKey && event.key === 'c') {
            event.preventDefault();
            this.openApplication('calculator');
        }
        
        // F12 - Developer Tools (Task Manager)
        if (event.key === 'F12') {
            event.preventDefault();
            this.showTaskManager();
        }
    }
    
    // Show task manager
    showTaskManager() {
        const taskManagerContent = this.createTaskManagerContent();
        
        const windowId = window.windowManager.createWindow({
            title: 'Task Manager',
            icon: 'fas fa-tasks',
            width: 600,
            height: 400,
            content: taskManagerContent,
            className: 'task-manager'
        });
        
        // Update task manager content periodically
        const updateInterval = setInterval(() => {
            const window = window.windowManager.getWindow(windowId);
            if (!window) {
                clearInterval(updateInterval);
                return;
            }
            
            const content = window.element.querySelector('.window-content');
            content.innerHTML = this.createTaskManagerContent();
        }, 2000);
    }
    
    // Create task manager content
    createTaskManagerContent() {
        let html = `
            <div class="task-manager-content" style="padding: var(--spacing-md);">
                <h3>Running Applications</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: var(--spacing-md);">
                    <thead>
                        <tr style="background: var(--bg-tertiary);">
                            <th style="padding: var(--spacing-sm); text-align: left; border: 1px solid var(--border-light);">Application</th>
                            <th style="padding: var(--spacing-sm); text-align: left; border: 1px solid var(--border-light);">Instances</th>
                            <th style="padding: var(--spacing-sm); text-align: left; border: 1px solid var(--border-light);">Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        this.applications.forEach((appConfig, appId) => {
            if (appConfig.instances.size > 0) {
                html += `
                    <tr>
                        <td style="padding: var(--spacing-sm); border: 1px solid var(--border-light);">
                            <i class="${appConfig.icon}"></i> ${appConfig.name}
                        </td>
                        <td style="padding: var(--spacing-sm); border: 1px solid var(--border-light);">
                            ${appConfig.instances.size}
                        </td>
                        <td style="padding: var(--spacing-sm); border: 1px solid var(--border-light);">
                            Running
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                    </tbody>
                </table>
                <div style="margin-top: var(--spacing-lg);">
                    <h4>System Information</h4>
                    <div style="margin-top: var(--spacing-sm);">
                        <div>User Agent: ${navigator.userAgent}</div>
                        <div>Platform: ${navigator.platform}</div>
                        <div>Language: ${navigator.language}</div>
                        <div>Online: ${navigator.onLine ? 'Yes' : 'No'}</div>
                        <div>Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    // Get system statistics
    getSystemStats() {
        const stats = {
            applications: {
                total: this.applications.size,
                running: 0,
                instances: 0
            },
            windows: {
                total: 0,
                minimized: 0,
                maximized: 0
            },
            memory: null
        };
        
        // Count running applications
        this.applications.forEach(app => {
            if (app.instances.size > 0) {
                stats.applications.running++;
                stats.applications.instances += app.instances.size;
            }
        });
        
        // Count windows
        if (window.windowManager) {
            const windows = window.windowManager.getAllWindows();
            stats.windows.total = windows.length;
            stats.windows.minimized = windows.filter(w => w.state === 'minimized').length;
            stats.windows.maximized = windows.filter(w => w.state === 'maximized').length;
        }
        
        // Memory information
        if (performance.memory) {
            stats.memory = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        
        return stats;
    }
}

// Base Application Class
class BaseApplication {
    constructor(options = {}) {
        this.options = options;
        this.windowId = null;
        this.instanceId = null;
        this.isInitialized = false;
        
        // Default dimensions
        this.defaultWidth = 800;
        this.defaultHeight = 600;
        this.minWidth = 300;
        this.minHeight = 200;
    }
    
    // Initialize the application
    initialize(windowId, instanceId) {
        this.windowId = windowId;
        this.instanceId = instanceId;
        this.isInitialized = true;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadData();
    }
    
    // Render the application content
    render() {
        return '<div class="app-content">Base Application</div>';
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Override in subclasses
    }
    
    // Load application data
    loadData() {
        // Override in subclasses
    }
    
    // Save application data
    saveData() {
        // Override in subclasses
    }
    
    // Handle focus
    onFocus() {
        // Override in subclasses
    }
    
    // Handle blur
    onBlur() {
        // Override in subclasses
    }
    
    // Cleanup when closing
    cleanup() {
        this.saveData();
        // Override in subclasses for additional cleanup
    }
    
    // Get window element
    getWindowElement() {
        if (!this.windowId || !window.windowManager) return null;
        const windowObj = window.windowManager.getWindow(this.windowId);
        return windowObj ? windowObj.element : null;
    }
    
    // Get content element
    getContentElement() {
        const windowElement = this.getWindowElement();
        return windowElement ? windowElement.querySelector('.window-content') : null;
    }
    
    // Update window title
    updateTitle(title) {
        if (window.windowManager) {
            window.windowManager.updateWindowTitle(this.windowId, title);
        }
    }
    
    // Update window content
    updateContent(content) {
        if (window.windowManager) {
            window.windowManager.updateWindowContent(this.windowId, content);
        }
    }
}

// Initialize the application manager
document.addEventListener('DOMContentLoaded', () => {
    // Create global application manager
    window.applicationManager = new ApplicationManager();
    
    // Set up global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        window.applicationManager.handleGlobalShortcuts(event);
    });
    
    // Handle desktop icon clicks
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        icon.addEventListener('dblclick', (e) => {
            const appName = icon.getAttribute('data-app');
            if (appName) {
                window.applicationManager.openApplication(appName);
            }
        });
    });
    
    // Handle start menu app clicks
    const startApps = document.querySelectorAll('.start-app');
    startApps.forEach(app => {
        app.addEventListener('click', (e) => {
            const appName = app.getAttribute('data-app');
            if (appName) {
                window.applicationManager.openApplication(appName);
            }
        });
    });
});

// Export for use in other modules
window.BaseApplication = BaseApplication;