// Start Menu Management System for Windows 11 Web OS

class StartMenu {
    constructor() {
        this.isVisible = false;
        this.currentView = 'main'; // main, all-apps, search
        this.searchQuery = '';
        this.pinnedApps = [];
        this.recentItems = [];
        this.allApps = [];
        
        this.initializeEventListeners();
        this.initializeApps();
        this.loadUserData();
    }
    
    // Initialize event listeners
    initializeEventListeners() {
        const startMenu = document.getElementById('start-menu');
        
        // Pinned app clicks
        const pinnedApps = startMenu.querySelectorAll('.start-app');
        pinnedApps.forEach(app => {
            app.addEventListener('click', this.handleAppClick.bind(this));
        });
        
        // Power button
        const powerButton = startMenu.querySelector('.power-button');
        powerButton.addEventListener('click', this.showPowerMenu.bind(this));
        
        // Search functionality (if search box exists in start menu)
        const searchBox = startMenu.querySelector('input[type="text"]');
        if (searchBox) {
            searchBox.addEventListener('input', this.handleSearch.bind(this));
            searchBox.addEventListener('keydown', this.handleSearchKeydown.bind(this));
        }
        
        // All apps button (if exists)
        const allAppsButton = startMenu.querySelector('.all-apps-button');
        if (allAppsButton) {
            allAppsButton.addEventListener('click', this.showAllApps.bind(this));
        }
        
        // Back button (if exists)
        const backButton = startMenu.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', this.showMainView.bind(this));
        }
        
        // Clear all notifications
        const clearAllButton = document.querySelector('#notification-center .clear-all');
        if (clearAllButton) {
            clearAllButton.addEventListener('click', this.clearAllNotifications.bind(this));
        }
        
        // Prevent start menu from closing when clicking inside
        startMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
                this.hide();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }
    
    // Initialize applications data
    initializeApps() {
        this.allApps = [
            {
                name: 'File Manager',
                app: 'file-manager',
                icon: 'fas fa-folder',
                category: 'System',
                description: 'Browse and manage files and folders'
            },
            {
                name: 'Text Editor',
                app: 'text-editor',
                icon: 'fas fa-file-alt',
                category: 'Productivity',
                description: 'Create and edit text documents'
            },
            {
                name: 'Code Editor',
                app: 'code-editor',
                icon: 'fas fa-code',
                category: 'Development',
                description: 'Advanced code editor with syntax highlighting'
            },
            {
                name: 'Terminal',
                app: 'terminal',
                icon: 'fas fa-terminal',
                category: 'Development',
                description: 'Command line interface with Python support'
            },
            {
                name: 'Web Browser',
                app: 'browser',
                icon: 'fas fa-globe',
                category: 'Internet',
                description: 'Browse the web with full functionality'
            },
            {
                name: 'Paint',
                app: 'paint',
                icon: 'fas fa-paint-brush',
                category: 'Graphics',
                description: 'Create and edit images and drawings'
            },
            {
                name: 'Video Editor',
                app: 'video-editor',
                icon: 'fas fa-video',
                category: 'Media',
                description: 'Edit videos with timeline and effects'
            },
            {
                name: 'Games',
                app: 'games',
                icon: 'fas fa-gamepad',
                category: 'Entertainment',
                description: 'Collection of built-in games'
            },
            {
                name: 'App Store',
                app: 'app-store',
                icon: 'fas fa-store',
                category: 'System',
                description: 'Download and install applications'
            },
            {
                name: 'Calculator',
                app: 'calculator',
                icon: 'fas fa-calculator',
                category: 'Utilities',
                description: 'Perform mathematical calculations'
            },
            {
                name: 'Settings',
                app: 'settings',
                icon: 'fas fa-cog',
                category: 'System',
                description: 'Configure system settings and preferences'
            },
            {
                name: 'Control Panel',
                app: 'control-panel',
                icon: 'fas fa-sliders-h',
                category: 'System',
                description: 'Advanced system configuration'
            }
        ];
        
        // Set default pinned apps
        this.pinnedApps = [
            'file-manager',
            'text-editor',
            'code-editor',
            'terminal',
            'browser',
            'paint',
            'video-editor',
            'games',
            'app-store'
        ];
        
        // Set recent items
        this.recentItems = [
            {
                name: 'Welcome.txt',
                path: 'Desktop\\Welcome.txt',
                type: 'file',
                icon: 'fas fa-file-alt',
                lastAccessed: new Date()
            }
        ];
    }
    
    // Load user data from localStorage
    loadUserData() {
        try {
            const savedData = localStorage.getItem('startMenuData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.pinnedApps = data.pinnedApps || this.pinnedApps;
                this.recentItems = data.recentItems || this.recentItems;
            }
        } catch (error) {
            console.error('Failed to load start menu data:', error);
        }
    }
    
    // Save user data to localStorage
    saveUserData() {
        try {
            const data = {
                pinnedApps: this.pinnedApps,
                recentItems: this.recentItems
            };
            localStorage.setItem('startMenuData', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save start menu data:', error);
        }
    }
    
    // Show start menu
    show() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.classList.remove('hidden');
        startButton.classList.add('active');
        this.isVisible = true;
        
        // Focus search box if available
        const searchBox = startMenu.querySelector('input[type="text"]');
        if (searchBox) {
            setTimeout(() => searchBox.focus(), 100);
        }
        
        // Update recent items
        this.updateRecentItems();
        
        // Show main view
        this.showMainView();
    }
    
    // Hide start menu
    hide() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.classList.add('hidden');
        startButton.classList.remove('active');
        this.isVisible = false;
        this.currentView = 'main';
        this.searchQuery = '';
        
        // Clear search
        const searchBox = startMenu.querySelector('input[type="text"]');
        if (searchBox) {
            searchBox.value = '';
        }
        
        // Hide search results
        this.hideSearchResults();
    }
    
    // Toggle start menu visibility
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    // Handle app click
    handleAppClick(event) {
        const appElement = event.currentTarget;
        const appName = appElement.getAttribute('data-app');
        
        if (appName) {
            this.openApplication(appName);
            this.addToRecentItems(appName);
            this.hide();
        }
    }
    
    // Handle search input
    handleSearch(event) {
        const query = event.target.value.trim();
        this.searchQuery = query;
        
        if (query.length === 0) {
            this.showMainView();
        } else {
            this.showSearchResults(query);
        }
    }
    
    // Handle search keydown
    handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.executeFirstSearchResult();
        } else if (event.key === 'Escape') {
            event.target.value = '';
            this.showMainView();
        }
    }
    
    // Handle keyboard navigation
    handleKeyboardNavigation(event) {
        if (!this.isVisible) return;
        
        switch (event.key) {
            case 'Escape':
                this.hide();
                break;
            case 'Tab':
                // Handle tab navigation between apps
                event.preventDefault();
                this.navigateApps(event.shiftKey ? -1 : 1);
                break;
            case 'Enter':
                // Open focused app
                const focusedApp = document.querySelector('.start-app:focus');
                if (focusedApp) {
                    focusedApp.click();
                }
                break;
        }
    }
    
    // Navigate between apps with keyboard
    navigateApps(direction) {
        const apps = document.querySelectorAll('.start-app');
        const currentFocus = document.querySelector('.start-app:focus');
        
        let currentIndex = -1;
        if (currentFocus) {
            currentIndex = Array.from(apps).indexOf(currentFocus);
        }
        
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = apps.length - 1;
        if (nextIndex >= apps.length) nextIndex = 0;
        
        apps[nextIndex].focus();
    }
    
    // Show main view
    showMainView() {
        this.currentView = 'main';
        this.hideAllViews();
        
        const mainContent = document.querySelector('.start-menu-content');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        this.hideSearchResults();
        this.hideAllAppsView();
    }
    
    // Show all apps view
    showAllApps() {
        this.currentView = 'all-apps';
        this.hideAllViews();
        
        // Create or show all apps view
        let allAppsView = document.querySelector('.all-apps-view');
        if (!allAppsView) {
            allAppsView = this.createAllAppsView();
        }
        
        allAppsView.classList.add('show');
    }
    
    // Show search results
    showSearchResults(query) {
        this.currentView = 'search';
        this.hideAllViews();
        
        const results = this.searchApps(query);
        this.displaySearchResults(results);
    }
    
    // Hide all views
    hideAllViews() {
        const mainContent = document.querySelector('.start-menu-content');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
        
        this.hideSearchResults();
        this.hideAllAppsView();
    }
    
    // Create all apps view
    createAllAppsView() {
        const startMenu = document.getElementById('start-menu');
        const allAppsView = document.createElement('div');
        allAppsView.className = 'all-apps-view';
        
        // Group apps by category
        const categories = {};
        this.allApps.forEach(app => {
            if (!categories[app.category]) {
                categories[app.category] = [];
            }
            categories[app.category].push(app);
        });
        
        let html = `
            <div class="all-apps-header">
                <button class="back-button">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div class="all-apps-title">All apps</div>
            </div>
        `;
        
        // Add categories
        Object.keys(categories).sort().forEach(category => {
            html += `
                <div class="all-apps-category">
                    <div class="category-title">${category}</div>
                    <div class="category-apps">
            `;
            
            categories[category].forEach(app => {
                html += `
                    <div class="start-app" data-app="${app.app}" tabindex="0">
                        <div class="app-icon">
                            <i class="${app.icon}"></i>
                        </div>
                        <div class="app-name">${app.name}</div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        allAppsView.innerHTML = html;
        
        // Add event listeners
        const backButton = allAppsView.querySelector('.back-button');
        backButton.addEventListener('click', this.showMainView.bind(this));
        
        const apps = allAppsView.querySelectorAll('.start-app');
        apps.forEach(app => {
            app.addEventListener('click', this.handleAppClick.bind(this));
        });
        
        startMenu.appendChild(allAppsView);
        return allAppsView;
    }
    
    // Hide all apps view
    hideAllAppsView() {
        const allAppsView = document.querySelector('.all-apps-view');
        if (allAppsView) {
            allAppsView.classList.remove('show');
        }
    }
    
    // Search apps
    searchApps(query) {
        const results = [];
        
        // Search in all apps
        this.allApps.forEach(app => {
            if (app.name.toLowerCase().includes(query.toLowerCase()) ||
                app.description.toLowerCase().includes(query.toLowerCase()) ||
                app.category.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    ...app,
                    type: 'app',
                    relevance: this.calculateRelevance(app, query)
                });
            }
        });
        
        // Search in files (if file system is available)
        if (window.fileSystem) {
            const fileResults = window.fileSystem.searchFiles(query);
            fileResults.forEach(file => {
                results.push({
                    name: file.name,
                    path: window.fileSystem.getPathString(file.path),
                    type: 'file',
                    icon: window.fileSystem.getFileIcon(file),
                    relevance: file.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 1
                });
            });
        }
        
        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        return results.slice(0, 10); // Limit to 10 results
    }
    
    // Calculate search relevance
    calculateRelevance(app, query) {
        const lowerQuery = query.toLowerCase();
        const lowerName = app.name.toLowerCase();
        
        if (lowerName === lowerQuery) return 5;
        if (lowerName.startsWith(lowerQuery)) return 4;
        if (lowerName.includes(lowerQuery)) return 3;
        if (app.description.toLowerCase().includes(lowerQuery)) return 2;
        if (app.category.toLowerCase().includes(lowerQuery)) return 1;
        
        return 0;
    }
    
    // Display search results
    displaySearchResults(results) {
        let searchResults = document.querySelector('.search-results');
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.className = 'search-results';
            document.getElementById('start-menu').appendChild(searchResults);
        }
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <div>No results found for "${this.searchQuery}"</div>
                </div>
            `;
        } else {
            let html = '<div class="search-results-header">Search Results</div>';
            
            // Group results by type
            const apps = results.filter(r => r.type === 'app');
            const files = results.filter(r => r.type === 'file');
            
            if (apps.length > 0) {
                html += '<div class="search-category"><div class="search-category-title">Apps</div>';
                apps.forEach(app => {
                    html += `
                        <div class="search-result" data-app="${app.app}" data-type="app">
                            <div class="search-result-icon">
                                <i class="${app.icon}"></i>
                            </div>
                            <div class="search-result-info">
                                <div class="search-result-name">${app.name}</div>
                                <div class="search-result-description">${app.description}</div>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            if (files.length > 0) {
                html += '<div class="search-category"><div class="search-category-title">Files</div>';
                files.forEach(file => {
                    html += `
                        <div class="search-result" data-path="${file.path}" data-type="file">
                            <div class="search-result-icon">
                                <i class="${file.icon}"></i>
                            </div>
                            <div class="search-result-info">
                                <div class="search-result-name">${file.name}</div>
                                <div class="search-result-description">${file.path}</div>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
            }
            
            searchResults.innerHTML = html;
            
            // Add click handlers
            const resultElements = searchResults.querySelectorAll('.search-result');
            resultElements.forEach(result => {
                result.addEventListener('click', this.handleSearchResultClick.bind(this));
            });
        }
        
        searchResults.classList.add('show');
    }
    
    // Handle search result click
    handleSearchResultClick(event) {
        const result = event.currentTarget;
        const type = result.getAttribute('data-type');
        
        if (type === 'app') {
            const appName = result.getAttribute('data-app');
            this.openApplication(appName);
            this.addToRecentItems(appName);
        } else if (type === 'file') {
            const filePath = result.getAttribute('data-path');
            this.openFile(filePath);
        }
        
        this.hide();
    }
    
    // Hide search results
    hideSearchResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.classList.remove('show');
        }
    }
    
    // Execute first search result
    executeFirstSearchResult() {
        const firstResult = document.querySelector('.search-result');
        if (firstResult) {
            firstResult.click();
        }
    }
    
    // Open application
    openApplication(appName) {
        if (window.applicationManager) {
            window.applicationManager.openApplication(appName);
        } else {
            console.log('Opening application:', appName);
        }
    }
    
    // Open file
    openFile(filePath) {
        // Determine appropriate application based on file extension
        const extension = filePath.split('.').pop().toLowerCase();
        let appName = 'text-editor'; // default
        
        if (['html', 'css', 'js', 'py', 'json', 'xml'].includes(extension)) {
            appName = 'code-editor';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            appName = 'paint';
        } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) {
            appName = 'video-editor';
        }
        
        // Open application with file
        if (window.applicationManager) {
            window.applicationManager.openApplication(appName, { filePath });
        }
    }
    
    // Add to recent items
    addToRecentItems(appName) {
        const app = this.allApps.find(a => a.app === appName);
        if (!app) return;
        
        const recentItem = {
            name: app.name,
            app: appName,
            type: 'app',
            icon: app.icon,
            lastAccessed: new Date()
        };
        
        // Remove if already exists
        this.recentItems = this.recentItems.filter(item => 
            !(item.type === 'app' && item.app === appName)
        );
        
        // Add to beginning
        this.recentItems.unshift(recentItem);
        
        // Keep only last 10 items
        this.recentItems = this.recentItems.slice(0, 10);
        
        // Save data
        this.saveUserData();
        
        // Update UI
        this.updateRecentItems();
    }
    
    // Update recent items display
    updateRecentItems() {
        const recommendedItems = document.querySelector('.recommended-items');
        if (!recommendedItems || this.recentItems.length === 0) return;
        
        let html = '';
        this.recentItems.slice(0, 5).forEach(item => {
            html += `
                <div class="recommended-item" data-app="${item.app}" data-type="${item.type}">
                    <div class="item-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-path">${item.path || 'Recently used'}</div>
                    </div>
                </div>
            `;
        });
        
        recommendedItems.innerHTML = html;
        
        // Add click handlers
        const items = recommendedItems.querySelectorAll('.recommended-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const appName = item.getAttribute('data-app');
                const type = item.getAttribute('data-type');
                
                if (type === 'app' && appName) {
                    this.openApplication(appName);
                    this.hide();
                }
            });
        });
    }
    
    // Show power menu
    showPowerMenu() {
        // Remove existing power menu
        const existingMenu = document.querySelector('.power-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const powerMenu = document.createElement('div');
        powerMenu.className = 'power-menu';
        powerMenu.innerHTML = `
            <div class="power-menu-item" data-action="sleep">
                <i class="fas fa-moon"></i>
                <span>Sleep</span>
            </div>
            <div class="power-menu-item" data-action="restart">
                <i class="fas fa-redo"></i>
                <span>Restart</span>
            </div>
            <div class="power-menu-item" data-action="shutdown">
                <i class="fas fa-power-off"></i>
                <span>Shut down</span>
            </div>
            <div class="power-menu-item" data-action="signout">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sign out</span>
            </div>
        `;
        
        document.body.appendChild(powerMenu);
        
        // Add click handlers
        const items = powerMenu.querySelectorAll('.power-menu-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                this.handlePowerAction(action);
                powerMenu.remove();
                this.hide();
            });
        });
        
        // Remove on outside click
        setTimeout(() => {
            const handleOutsideClick = (e) => {
                if (!e.target.closest('.power-menu')) {
                    powerMenu.remove();
                    document.removeEventListener('click', handleOutsideClick);
                }
            };
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    }
    
    // Handle power actions
    handlePowerAction(action) {
        switch (action) {
            case 'sleep':
                this.simulateSleep();
                break;
            case 'restart':
                this.simulateRestart();
                break;
            case 'shutdown':
                this.simulateShutdown();
                break;
            case 'signout':
                this.simulateSignOut();
                break;
        }
    }
    
    // Simulate sleep
    simulateSleep() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
        `;
        overlay.innerHTML = '<div>💤 Sleeping... Click to wake up</div>';
        
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            overlay.remove();
        });
    }
    
    // Simulate restart
    simulateRestart() {
        if (confirm('Are you sure you want to restart?')) {
            location.reload();
        }
    }
    
    // Simulate shutdown
    simulateShutdown() {
        if (confirm('Are you sure you want to shut down?')) {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
            `;
            overlay.innerHTML = '<div>🔌 System shut down. Refresh to restart.</div>';
            
            document.body.appendChild(overlay);
        }
    }
    
    // Simulate sign out
    simulateSignOut() {
        if (confirm('Are you sure you want to sign out?')) {
            // Clear user data and reload
            localStorage.removeItem('startMenuData');
            location.reload();
        }
    }
    
    // Clear all notifications
    clearAllNotifications() {
        if (window.taskbar) {
            window.taskbar.clearAllNotifications();
        }
    }
    
    // Pin app to start menu
    pinApp(appName) {
        if (!this.pinnedApps.includes(appName)) {
            this.pinnedApps.push(appName);
            this.saveUserData();
            this.updatePinnedApps();
        }
    }
    
    // Unpin app from start menu
    unpinApp(appName) {
        this.pinnedApps = this.pinnedApps.filter(app => app !== appName);
        this.saveUserData();
        this.updatePinnedApps();
    }
    
    // Update pinned apps display
    updatePinnedApps() {
        const pinnedAppsContainer = document.querySelector('.pinned-apps');
        if (!pinnedAppsContainer) return;
        
        let html = '';
        this.pinnedApps.forEach(appName => {
            const app = this.allApps.find(a => a.app === appName);
            if (app) {
                html += `
                    <div class="start-app" data-app="${app.app}" tabindex="0">
                        <div class="app-icon">
                            <i class="${app.icon}"></i>
                        </div>
                        <div class="app-name">${app.name}</div>
                    </div>
                `;
            }
        });
        
        pinnedAppsContainer.innerHTML = html;
        
        // Add event listeners
        const apps = pinnedAppsContainer.querySelectorAll('.start-app');
        apps.forEach(app => {
            app.addEventListener('click', this.handleAppClick.bind(this));
        });
    }
}

// Initialize start menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.startMenu = new StartMenu();
});