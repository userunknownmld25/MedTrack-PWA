// Taskbar Management System for Windows 11 Web OS

class Taskbar {
    constructor() {
        this.searchActive = false;
        this.searchResults = [];
        this.systemTrayItems = new Map();
        this.notificationCenter = null;
        this.powerMenu = null;
        
        this.initializeEventListeners();
        this.initializeSystemTray();
        this.initializeSearch();
        this.updateSystemStatus();
    }
    
    // Initialize taskbar event listeners
    initializeEventListeners() {
        // Start button
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', this.toggleStartMenu.bind(this));
        
        // Task view button
        const taskViewButton = document.getElementById('task-view');
        taskViewButton.addEventListener('click', this.toggleTaskView.bind(this));
        
        // Search box
        const searchBox = document.querySelector('.taskbar-search input');
        searchBox.addEventListener('input', this.handleSearchInput.bind(this));
        searchBox.addEventListener('focus', this.handleSearchFocus.bind(this));
        searchBox.addEventListener('blur', this.handleSearchBlur.bind(this));
        searchBox.addEventListener('keydown', this.handleSearchKeydown.bind(this));
        
        // System tray icons
        document.getElementById('wifi-icon').addEventListener('click', this.showNetworkSettings.bind(this));
        document.getElementById('volume-icon').addEventListener('click', this.showVolumeControl.bind(this));
        document.getElementById('battery-icon').addEventListener('click', this.showBatteryInfo.bind(this));
        document.getElementById('notifications-icon').addEventListener('click', this.toggleNotificationCenter.bind(this));
        
        // Clock
        document.getElementById('clock').addEventListener('click', this.showCalendar.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // Global click to hide menus
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    }
    
    // Initialize system tray
    initializeSystemTray() {
        this.systemTrayItems.set('wifi', {
            element: document.getElementById('wifi-icon'),
            status: 'connected',
            strength: 4
        });
        
        this.systemTrayItems.set('volume', {
            element: document.getElementById('volume-icon'),
            level: 75,
            muted: false
        });
        
        this.systemTrayItems.set('battery', {
            element: document.getElementById('battery-icon'),
            level: 85,
            charging: false
        });
        
        this.systemTrayItems.set('notifications', {
            element: document.getElementById('notifications-icon'),
            count: 0,
            hasNew: false
        });
    }
    
    // Initialize search functionality
    initializeSearch() {
        this.searchIndex = [
            { name: 'File Manager', type: 'app', app: 'file-manager', icon: 'fas fa-folder' },
            { name: 'Text Editor', type: 'app', app: 'text-editor', icon: 'fas fa-file-alt' },
            { name: 'Code Editor', type: 'app', app: 'code-editor', icon: 'fas fa-code' },
            { name: 'Terminal', type: 'app', app: 'terminal', icon: 'fas fa-terminal' },
            { name: 'Web Browser', type: 'app', app: 'browser', icon: 'fas fa-globe' },
            { name: 'Paint', type: 'app', app: 'paint', icon: 'fas fa-paint-brush' },
            { name: 'Video Editor', type: 'app', app: 'video-editor', icon: 'fas fa-video' },
            { name: 'Games', type: 'app', app: 'games', icon: 'fas fa-gamepad' },
            { name: 'App Store', type: 'app', app: 'app-store', icon: 'fas fa-store' },
            { name: 'Settings', type: 'system', action: 'settings', icon: 'fas fa-cog' },
            { name: 'Control Panel', type: 'system', action: 'control-panel', icon: 'fas fa-sliders-h' },
            { name: 'Task Manager', type: 'system', action: 'task-manager', icon: 'fas fa-tasks' },
            { name: 'Calculator', type: 'app', app: 'calculator', icon: 'fas fa-calculator' },
            { name: 'Notepad', type: 'app', app: 'text-editor', icon: 'fas fa-sticky-note' }
        ];
    }
    
    // Toggle start menu
    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        if (startMenu.classList.contains('hidden')) {
            this.showStartMenu();
        } else {
            this.hideStartMenu();
        }
    }
    
    // Show start menu
    showStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.classList.remove('hidden');
        startButton.classList.add('active');
        
        // Hide other menus
        this.hideNotificationCenter();
        this.hidePowerMenu();
        
        // Focus search if available
        const searchInput = startMenu.querySelector('input[type="text"]');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }
    
    // Hide start menu
    hideStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        startMenu.classList.add('hidden');
        startButton.classList.remove('active');
    }
    
    // Toggle task view
    toggleTaskView() {
        if (window.windowManager) {
            const taskView = document.getElementById('task-view');
            if (taskView) {
                window.windowManager.hideTaskView();
            } else {
                window.windowManager.showTaskView();
            }
        }
    }
    
    // Handle search input
    handleSearchInput(event) {
        const query = event.target.value.trim();
        
        if (query.length === 0) {
            this.clearSearchResults();
            return;
        }
        
        this.performSearch(query);
    }
    
    // Handle search focus
    handleSearchFocus(event) {
        this.searchActive = true;
        event.target.parentElement.classList.add('focused');
    }
    
    // Handle search blur
    handleSearchBlur(event) {
        setTimeout(() => {
            this.searchActive = false;
            event.target.parentElement.classList.remove('focused');
            this.clearSearchResults();
        }, 200);
    }
    
    // Handle search keydown
    handleSearchKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.executeFirstSearchResult();
        } else if (event.key === 'Escape') {
            event.target.blur();
            this.clearSearchResults();
        }
    }
    
    // Perform search
    performSearch(query) {
        const results = this.searchIndex.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        
        this.searchResults = results.slice(0, 8); // Limit to 8 results
        this.displaySearchResults();
    }
    
    // Display search results
    displaySearchResults() {
        // Remove existing results
        this.clearSearchResults();
        
        if (this.searchResults.length === 0) return;
        
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-glass-strong);
            backdrop-filter: blur(30px);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            padding: var(--spacing-sm);
            z-index: 1001;
            max-height: 300px;
            overflow-y: auto;
        `;
        
        // Add results
        this.searchResults.forEach((result, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            resultElement.style.cssText = `
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: background var(--transition-fast);
            `;
            
            resultElement.innerHTML = `
                <div class="search-result-icon" style="
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-blue);
                ">
                    <i class="${result.icon}"></i>
                </div>
                <div class="search-result-info" style="flex: 1;">
                    <div class="search-result-name" style="
                        font-size: var(--font-size-sm);
                        font-weight: 500;
                        color: var(--text-primary);
                    ">${result.name}</div>
                    <div class="search-result-type" style="
                        font-size: var(--font-size-xs);
                        color: var(--text-secondary);
                    ">${result.type === 'app' ? 'Application' : 'System'}</div>
                </div>
            `;
            
            resultElement.addEventListener('mouseenter', () => {
                resultElement.style.background = 'rgba(0, 120, 212, 0.1)';
            });
            
            resultElement.addEventListener('mouseleave', () => {
                resultElement.style.background = 'transparent';
            });
            
            resultElement.addEventListener('click', () => {
                this.executeSearchResult(result);
            });
            
            resultsContainer.appendChild(resultElement);
        });
        
        // Add to search box
        const searchBox = document.querySelector('.taskbar-search');
        searchBox.appendChild(resultsContainer);
    }
    
    // Clear search results
    clearSearchResults() {
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }
    }
    
    // Execute first search result
    executeFirstSearchResult() {
        if (this.searchResults.length > 0) {
            this.executeSearchResult(this.searchResults[0]);
        }
    }
    
    // Execute search result
    executeSearchResult(result) {
        if (result.type === 'app' && result.app) {
            this.openApplication(result.app);
        } else if (result.type === 'system' && result.action) {
            this.executeSystemAction(result.action);
        }
        
        // Clear search
        const searchInput = document.querySelector('.taskbar-search input');
        searchInput.value = '';
        searchInput.blur();
        this.clearSearchResults();
    }
    
    // Open application
    openApplication(appName) {
        if (window.applicationManager) {
            window.applicationManager.openApplication(appName);
        } else {
            console.log('Opening application:', appName);
        }
    }
    
    // Execute system action
    executeSystemAction(action) {
        switch (action) {
            case 'settings':
                this.openSettings();
                break;
            case 'control-panel':
                this.openControlPanel();
                break;
            case 'task-manager':
                this.openTaskManager();
                break;
            default:
                console.log('Executing system action:', action);
        }
    }
    
    // Show network settings
    showNetworkSettings() {
        const networkMenu = document.createElement('div');
        networkMenu.className = 'taskbar-context-menu';
        networkMenu.style.right = '120px';
        networkMenu.innerHTML = `
            <div class="taskbar-context-item">
                <i class="fas fa-wifi"></i>
                <span>WiFi: Connected</span>
            </div>
            <div class="taskbar-context-item">
                <i class="fas fa-ethernet"></i>
                <span>Ethernet: Disconnected</span>
            </div>
            <div class="taskbar-context-item">
                <i class="fas fa-cog"></i>
                <span>Network Settings</span>
            </div>
        `;
        
        document.body.appendChild(networkMenu);
        this.autoRemoveMenu(networkMenu);
    }
    
    // Show volume control
    showVolumeControl() {
        const volumeMenu = document.createElement('div');
        volumeMenu.className = 'taskbar-context-menu';
        volumeMenu.style.right = '80px';
        volumeMenu.innerHTML = `
            <div style="padding: var(--spacing-md);">
                <div style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                    <i class="fas fa-volume-up"></i>
                    <span>Volume: 75%</span>
                </div>
                <input type="range" min="0" max="100" value="75" style="width: 100%;" />
                <div style="display: flex; justify-content: space-between; margin-top: var(--spacing-sm);">
                    <button class="btn btn-ghost" style="padding: var(--spacing-xs);">
                        <i class="fas fa-volume-mute"></i>
                    </button>
                    <button class="btn btn-ghost" style="padding: var(--spacing-xs);">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(volumeMenu);
        this.autoRemoveMenu(volumeMenu);
        
        // Handle volume slider
        const volumeSlider = volumeMenu.querySelector('input[type="range"]');
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            this.updateVolumeIcon(volume);
        });
    }
    
    // Show battery info
    showBatteryInfo() {
        const batteryMenu = document.createElement('div');
        batteryMenu.className = 'taskbar-context-menu';
        batteryMenu.style.right = '40px';
        batteryMenu.innerHTML = `
            <div class="taskbar-context-item">
                <i class="fas fa-battery-three-quarters"></i>
                <span>Battery: 85%</span>
            </div>
            <div class="taskbar-context-item">
                <i class="fas fa-plug"></i>
                <span>Not charging</span>
            </div>
            <div class="taskbar-context-item">
                <i class="fas fa-clock"></i>
                <span>4h 32m remaining</span>
            </div>
            <div class="taskbar-context-item">
                <i class="fas fa-cog"></i>
                <span>Battery Settings</span>
            </div>
        `;
        
        document.body.appendChild(batteryMenu);
        this.autoRemoveMenu(batteryMenu);
    }
    
    // Toggle notification center
    toggleNotificationCenter() {
        const notificationCenter = document.getElementById('notification-center');
        
        if (notificationCenter.classList.contains('hidden')) {
            this.showNotificationCenter();
        } else {
            this.hideNotificationCenter();
        }
    }
    
    // Show notification center
    showNotificationCenter() {
        const notificationCenter = document.getElementById('notification-center');
        notificationCenter.classList.remove('hidden');
        
        // Hide other menus
        this.hideStartMenu();
        this.hidePowerMenu();
    }
    
    // Hide notification center
    hideNotificationCenter() {
        const notificationCenter = document.getElementById('notification-center');
        notificationCenter.classList.add('hidden');
    }
    
    // Show calendar
    showCalendar() {
        const calendarMenu = document.createElement('div');
        calendarMenu.className = 'taskbar-context-menu';
        calendarMenu.style.right = '0px';
        calendarMenu.style.width = '300px';
        
        const now = new Date();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        calendarMenu.innerHTML = `
            <div style="padding: var(--spacing-md);">
                <div style="text-align: center; margin-bottom: var(--spacing-md);">
                    <h3>${monthNames[now.getMonth()]} ${now.getFullYear()}</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center;">
                    <div style="font-weight: bold; padding: var(--spacing-xs);">S</div>
                    <div style="font-weight: bold; padding: var(--spacing-xs);">M</div>
                    <div style="font-weight: bold; padding: var(--spacing-xs);">T</div>
                    <div style="font-weight: bold; padding: var(--spacing-xs);">W</div>
                    <div style="font-weight: bold; padding: var(--spacing-xs);">T</div>
                    <div style="font-weight: bold; padding: var(--spacing-xs);">F</div>
                    <div style="font-weight: bold; padding: var(--spacing-xs);">S</div>
                    ${this.generateCalendarDays(now)}
                </div>
                <div style="margin-top: var(--spacing-md); text-align: center;">
                    <div style="font-size: var(--font-size-lg); font-weight: 500;">
                        ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                    <div style="color: var(--text-secondary); font-size: var(--font-size-sm);">
                        ${now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(calendarMenu);
        this.autoRemoveMenu(calendarMenu);
    }
    
    // Generate calendar days
    generateCalendarDays(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = date.getDate();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let html = '';
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            html += '<div style="padding: var(--spacing-xs);"></div>';
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today;
            const style = isToday 
                ? 'background: var(--primary-blue); color: white; border-radius: 50%;' 
                : '';
            
            html += `<div style="padding: var(--spacing-xs); ${style}">${day}</div>`;
        }
        
        return html;
    }
    
    // Handle keyboard shortcuts
    handleKeyboardShortcuts(event) {
        // Windows key or Ctrl+Esc - Toggle start menu
        if (event.key === 'Meta' || (event.ctrlKey && event.key === 'Escape')) {
            event.preventDefault();
            this.toggleStartMenu();
        }
        
        // Windows key + S - Focus search
        if (event.metaKey && event.key === 's') {
            event.preventDefault();
            const searchInput = document.querySelector('.taskbar-search input');
            searchInput.focus();
        }
        
        // Windows key + A - Toggle notification center
        if (event.metaKey && event.key === 'a') {
            event.preventDefault();
            this.toggleNotificationCenter();
        }
        
        // Windows key + Tab - Task view
        if (event.metaKey && event.key === 'Tab') {
            event.preventDefault();
            this.toggleTaskView();
        }
        
        // Alt + Tab - Switch between windows
        if (event.altKey && event.key === 'Tab') {
            event.preventDefault();
            this.switchBetweenWindows();
        }
    }
    
    // Handle global click
    handleGlobalClick(event) {
        // Hide menus when clicking outside
        if (!event.target.closest('.taskbar-context-menu') && 
            !event.target.closest('.system-tray') &&
            !event.target.closest('#clock')) {
            this.removeAllContextMenus();
        }
        
        if (!event.target.closest('#start-menu') && 
            !event.target.closest('#start-button')) {
            this.hideStartMenu();
        }
        
        if (!event.target.closest('#notification-center') && 
            !event.target.closest('#notifications-icon')) {
            this.hideNotificationCenter();
        }
    }
    
    // Auto remove menu after timeout
    autoRemoveMenu(menu, timeout = 5000) {
        setTimeout(() => {
            if (menu.parentNode) {
                menu.remove();
            }
        }, timeout);
        
        // Remove on click outside
        setTimeout(() => {
            const handleOutsideClick = (e) => {
                if (!e.target.closest('.taskbar-context-menu')) {
                    menu.remove();
                    document.removeEventListener('click', handleOutsideClick);
                }
            };
            document.addEventListener('click', handleOutsideClick);
        }, 100);
    }
    
    // Remove all context menus
    removeAllContextMenus() {
        const menus = document.querySelectorAll('.taskbar-context-menu');
        menus.forEach(menu => menu.remove());
    }
    
    // Switch between windows
    switchBetweenWindows() {
        if (window.windowManager) {
            const windows = window.windowManager.getAllWindows();
            const activeWindow = window.windowManager.getActiveWindow();
            
            if (windows.length <= 1) return;
            
            let nextIndex = 0;
            if (activeWindow) {
                const currentIndex = windows.findIndex(w => w.id === activeWindow.id);
                nextIndex = (currentIndex + 1) % windows.length;
            }
            
            const nextWindow = windows[nextIndex];
            if (nextWindow && nextWindow.state !== 'minimized') {
                window.windowManager.focusWindow(nextWindow.id);
            }
        }
    }
    
    // Update system status
    updateSystemStatus() {
        this.updateNetworkStatus();
        this.updateBatteryStatus();
        this.updateVolumeStatus();
        this.updateNotificationStatus();
        
        // Update every 30 seconds
        setTimeout(() => this.updateSystemStatus(), 30000);
    }
    
    // Update network status
    updateNetworkStatus() {
        const wifiIcon = this.systemTrayItems.get('wifi');
        if (wifiIcon) {
            // Simulate network status
            const isOnline = navigator.onLine;
            const iconElement = wifiIcon.element.querySelector('i');
            
            if (isOnline) {
                iconElement.className = 'fas fa-wifi';
                wifiIcon.element.style.color = '';
            } else {
                iconElement.className = 'fas fa-wifi-slash';
                wifiIcon.element.style.color = 'var(--error-red)';
            }
        }
    }
    
    // Update battery status
    updateBatteryStatus() {
        const batteryIcon = this.systemTrayItems.get('battery');
        if (batteryIcon && 'getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging;
                
                batteryIcon.level = level;
                batteryIcon.charging = charging;
                
                const iconElement = batteryIcon.element.querySelector('i');
                
                if (charging) {
                    iconElement.className = 'fas fa-battery-bolt';
                    batteryIcon.element.classList.remove('battery-low', 'battery-medium');
                    batteryIcon.element.classList.add('battery-high');
                } else if (level > 50) {
                    iconElement.className = 'fas fa-battery-full';
                    batteryIcon.element.classList.remove('battery-low', 'battery-medium');
                    batteryIcon.element.classList.add('battery-high');
                } else if (level > 20) {
                    iconElement.className = 'fas fa-battery-half';
                    batteryIcon.element.classList.remove('battery-low', 'battery-high');
                    batteryIcon.element.classList.add('battery-medium');
                } else {
                    iconElement.className = 'fas fa-battery-empty';
                    batteryIcon.element.classList.remove('battery-medium', 'battery-high');
                    batteryIcon.element.classList.add('battery-low');
                }
            });
        }
    }
    
    // Update volume status
    updateVolumeStatus() {
        const volumeIcon = this.systemTrayItems.get('volume');
        if (volumeIcon) {
            // Volume level would be managed by the system
            const level = volumeIcon.level;
            const muted = volumeIcon.muted;
            
            const iconElement = volumeIcon.element.querySelector('i');
            
            if (muted || level === 0) {
                iconElement.className = 'fas fa-volume-mute';
            } else if (level < 30) {
                iconElement.className = 'fas fa-volume-down';
            } else {
                iconElement.className = 'fas fa-volume-up';
            }
        }
    }
    
    // Update notification status
    updateNotificationStatus() {
        const notificationIcon = this.systemTrayItems.get('notifications');
        if (notificationIcon) {
            const count = notificationIcon.count;
            const hasNew = notificationIcon.hasNew;
            
            // Add/remove notification badge
            let badge = notificationIcon.element.querySelector('.notification-badge');
            
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'notification-badge';
                    notificationIcon.element.appendChild(badge);
                }
                badge.textContent = count > 9 ? '9+' : count.toString();
            } else if (badge) {
                badge.remove();
            }
            
            // Highlight if has new notifications
            if (hasNew) {
                notificationIcon.element.style.color = 'var(--primary-blue)';
            } else {
                notificationIcon.element.style.color = '';
            }
        }
    }
    
    // Update volume icon
    updateVolumeIcon(level) {
        const volumeIcon = this.systemTrayItems.get('volume');
        if (volumeIcon) {
            volumeIcon.level = level;
            this.updateVolumeStatus();
        }
    }
    
    // Add notification
    addNotification(title, message, icon = 'fas fa-info-circle') {
        const notificationCenter = document.getElementById('notification-center');
        const content = notificationCenter.querySelector('.notification-content');
        
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-time">${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
        `;
        
        content.insertBefore(notification, content.firstChild);
        
        // Update notification count
        const notificationIcon = this.systemTrayItems.get('notifications');
        if (notificationIcon) {
            notificationIcon.count++;
            notificationIcon.hasNew = true;
            this.updateNotificationStatus();
        }
        
        // Show toast notification
        this.showToastNotification(title, message, icon);
    }
    
    // Show toast notification
    showToastNotification(title, message, icon) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-glass-strong);
            backdrop-filter: blur(30px);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            padding: var(--spacing-md);
            max-width: 300px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: var(--spacing-sm);">
                <div style="color: var(--primary-blue); font-size: 18px;">
                    <i class="${icon}"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: var(--spacing-xs);">${title}</div>
                    <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
    
    // Clear all notifications
    clearAllNotifications() {
        const content = document.querySelector('#notification-center .notification-content');
        content.innerHTML = `
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-title">All caught up!</div>
                    <div class="notification-message">You have no new notifications.</div>
                </div>
            </div>
        `;
        
        // Reset notification count
        const notificationIcon = this.systemTrayItems.get('notifications');
        if (notificationIcon) {
            notificationIcon.count = 0;
            notificationIcon.hasNew = false;
            this.updateNotificationStatus();
        }
    }
    
    // Open settings
    openSettings() {
        console.log('Opening Settings...');
        // Would open settings application
    }
    
    // Open control panel
    openControlPanel() {
        console.log('Opening Control Panel...');
        // Would open control panel application
    }
    
    // Open task manager
    openTaskManager() {
        console.log('Opening Task Manager...');
        // Would open task manager application
    }
    
    // Hide power menu
    hidePowerMenu() {
        if (this.powerMenu) {
            this.powerMenu.remove();
            this.powerMenu = null;
        }
    }
}

// Initialize taskbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskbar = new Taskbar();
});