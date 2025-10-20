// Desktop Management System for Windows 11 Web OS

class Desktop {
    constructor() {
        this.selectedIcons = new Set();
        this.contextMenu = null;
        this.selectionRectangle = null;
        this.dragState = null;
        this.widgets = new Map();
        
        this.initializeEventListeners();
        this.initializeDesktopIcons();
        this.initializeWidgets();
        this.updateClock();
    }
    
    // Initialize desktop event listeners
    initializeEventListeners() {
        const desktop = document.getElementById('desktop');
        const contextMenu = document.getElementById('context-menu');
        
        // Desktop click events
        desktop.addEventListener('click', this.handleDesktopClick.bind(this));
        desktop.addEventListener('dblclick', this.handleDesktopDoubleClick.bind(this));
        desktop.addEventListener('contextmenu', this.handleDesktopContextMenu.bind(this));
        
        // Selection rectangle
        desktop.addEventListener('mousedown', this.handleSelectionStart.bind(this));
        document.addEventListener('mousemove', this.handleSelectionMove.bind(this));
        document.addEventListener('mouseup', this.handleSelectionEnd.bind(this));
        
        // Context menu events
        contextMenu.addEventListener('click', this.handleContextMenuClick.bind(this));
        
        // Global click to hide context menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#context-menu')) {
                this.hideContextMenu();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        
        // Prevent default drag behavior on desktop icons
        desktop.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }
    
    // Initialize desktop icons
    initializeDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach(icon => {
            icon.addEventListener('click', this.handleIconClick.bind(this));
            icon.addEventListener('dblclick', this.handleIconDoubleClick.bind(this));
            icon.addEventListener('contextmenu', this.handleIconContextMenu.bind(this));
            icon.addEventListener('mousedown', this.handleIconMouseDown.bind(this));
        });
    }
    
    // Initialize desktop widgets
    initializeWidgets() {
        this.createClockWidget();
        this.createWeatherWidget();
    }
    
    // Handle desktop click
    handleDesktopClick(event) {
        if (event.target.id === 'desktop' || event.target.id === 'desktop-background') {
            this.clearSelection();
            this.hideContextMenu();
        }
    }
    
    // Handle desktop double-click
    handleDesktopDoubleClick(event) {
        if (event.target.id === 'desktop' || event.target.id === 'desktop-background') {
            // Could open file manager or perform other action
            this.openApplication('file-manager');
        }
    }
    
    // Handle desktop context menu
    handleDesktopContextMenu(event) {
        if (event.target.closest('.desktop-icon')) return;
        
        event.preventDefault();
        this.showContextMenu(event.clientX, event.clientY);
    }
    
    // Handle icon click
    handleIconClick(event) {
        event.stopPropagation();
        
        const icon = event.currentTarget;
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        
        if (isCtrlPressed) {
            // Toggle selection
            this.toggleIconSelection(icon);
        } else {
            // Single selection
            this.clearSelection();
            this.selectIcon(icon);
        }
    }
    
    // Handle icon double-click
    handleIconDoubleClick(event) {
        event.stopPropagation();
        
        const icon = event.currentTarget;
        const appName = icon.getAttribute('data-app');
        
        if (appName) {
            this.openApplication(appName);
        }
    }
    
    // Handle icon context menu
    handleIconContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const icon = event.currentTarget;
        if (!this.selectedIcons.has(icon)) {
            this.clearSelection();
            this.selectIcon(icon);
        }
        
        this.showIconContextMenu(event.clientX, event.clientY);
    }
    
    // Handle icon mouse down (for potential dragging)
    handleIconMouseDown(event) {
        const icon = event.currentTarget;
        
        if (!this.selectedIcons.has(icon)) {
            this.clearSelection();
            this.selectIcon(icon);
        }
        
        // Could implement icon dragging here
    }
    
    // Handle selection rectangle start
    handleSelectionStart(event) {
        if (event.target.id !== 'desktop' && event.target.id !== 'desktop-background') return;
        if (event.button !== 0) return; // Only left mouse button
        
        event.preventDefault();
        
        this.dragState = {
            startX: event.clientX,
            startY: event.clientY,
            isSelecting: true
        };
        
        this.clearSelection();
        this.createSelectionRectangle(event.clientX, event.clientY);
    }
    
    // Handle selection rectangle move
    handleSelectionMove(event) {
        if (!this.dragState || !this.dragState.isSelecting) return;
        
        this.updateSelectionRectangle(event.clientX, event.clientY);
        this.updateIconSelection();
    }
    
    // Handle selection rectangle end
    handleSelectionEnd(event) {
        if (!this.dragState || !this.dragState.isSelecting) return;
        
        this.removeSelectionRectangle();
        this.dragState = null;
    }
    
    // Create selection rectangle
    createSelectionRectangle(x, y) {
        this.selectionRectangle = document.createElement('div');
        this.selectionRectangle.className = 'selection-rectangle';
        this.selectionRectangle.style.left = x + 'px';
        this.selectionRectangle.style.top = y + 'px';
        this.selectionRectangle.style.width = '0px';
        this.selectionRectangle.style.height = '0px';
        
        document.getElementById('desktop').appendChild(this.selectionRectangle);
    }
    
    // Update selection rectangle
    updateSelectionRectangle(currentX, currentY) {
        if (!this.selectionRectangle || !this.dragState) return;
        
        const startX = this.dragState.startX;
        const startY = this.dragState.startY;
        
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        
        this.selectionRectangle.style.left = left + 'px';
        this.selectionRectangle.style.top = top + 'px';
        this.selectionRectangle.style.width = width + 'px';
        this.selectionRectangle.style.height = height + 'px';
    }
    
    // Remove selection rectangle
    removeSelectionRectangle() {
        if (this.selectionRectangle) {
            this.selectionRectangle.remove();
            this.selectionRectangle = null;
        }
    }
    
    // Update icon selection based on rectangle
    updateIconSelection() {
        if (!this.selectionRectangle) return;
        
        const rectBounds = this.selectionRectangle.getBoundingClientRect();
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach(icon => {
            const iconBounds = icon.getBoundingClientRect();
            
            // Check if icon intersects with selection rectangle
            const intersects = !(
                rectBounds.right < iconBounds.left ||
                rectBounds.left > iconBounds.right ||
                rectBounds.bottom < iconBounds.top ||
                rectBounds.top > iconBounds.bottom
            );
            
            if (intersects) {
                this.selectIcon(icon);
            } else {
                this.deselectIcon(icon);
            }
        });
    }
    
    // Select icon
    selectIcon(icon) {
        icon.classList.add('selected');
        this.selectedIcons.add(icon);
    }
    
    // Deselect icon
    deselectIcon(icon) {
        icon.classList.remove('selected');
        this.selectedIcons.delete(icon);
    }
    
    // Toggle icon selection
    toggleIconSelection(icon) {
        if (this.selectedIcons.has(icon)) {
            this.deselectIcon(icon);
        } else {
            this.selectIcon(icon);
        }
    }
    
    // Clear all selection
    clearSelection() {
        this.selectedIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
        this.selectedIcons.clear();
    }
    
    // Show context menu
    showContextMenu(x, y) {
        const contextMenu = document.getElementById('context-menu');
        
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        contextMenu.classList.remove('hidden');
        
        // Adjust position if menu goes off screen
        const rect = contextMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (rect.right > viewportWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }
        
        if (rect.bottom > viewportHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }
    }
    
    // Show icon context menu
    showIconContextMenu(x, y) {
        // Create icon-specific context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = `
            <div class="context-item" data-action="open">
                <i class="fas fa-folder-open"></i>
                <span>Open</span>
            </div>
            <div class="context-item" data-action="rename">
                <i class="fas fa-edit"></i>
                <span>Rename</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </div>
            <div class="context-item" data-action="properties">
                <i class="fas fa-info-circle"></i>
                <span>Properties</span>
            </div>
        `;
        
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        
        document.body.appendChild(contextMenu);
        
        // Handle clicks
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-item')?.getAttribute('data-action');
            if (action) {
                this.handleIconContextAction(action);
            }
            contextMenu.remove();
        });
        
        // Remove on outside click
        setTimeout(() => {
            const handleOutsideClick = (e) => {
                if (!e.target.closest('.context-menu')) {
                    contextMenu.remove();
                    document.removeEventListener('click', handleOutsideClick);
                }
            };
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    }
    
    // Hide context menu
    hideContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        contextMenu.classList.add('hidden');
    }
    
    // Handle context menu click
    handleContextMenuClick(event) {
        const action = event.target.closest('.context-item')?.getAttribute('data-action');
        
        if (action) {
            this.handleContextAction(action);
            this.hideContextMenu();
        }
    }
    
    // Handle context menu actions
    handleContextAction(action) {
        switch (action) {
            case 'refresh':
                this.refreshDesktop();
                break;
            case 'new-folder':
                this.createNewFolder();
                break;
            case 'new-file':
                this.createNewFile();
                break;
            case 'personalize':
                this.openPersonalization();
                break;
            case 'display-settings':
                this.openDisplaySettings();
                break;
        }
    }
    
    // Handle icon context menu actions
    handleIconContextAction(action) {
        const selectedIcon = Array.from(this.selectedIcons)[0];
        if (!selectedIcon) return;
        
        const appName = selectedIcon.getAttribute('data-app');
        
        switch (action) {
            case 'open':
                if (appName) {
                    this.openApplication(appName);
                }
                break;
            case 'rename':
                this.renameIcon(selectedIcon);
                break;
            case 'delete':
                this.deleteIcon(selectedIcon);
                break;
            case 'properties':
                this.showIconProperties(selectedIcon);
                break;
        }
    }
    
    // Handle keyboard shortcuts
    handleKeyDown(event) {
        // Ctrl+A - Select all icons
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
            event.preventDefault();
            this.selectAllIcons();
        }
        
        // Delete key - Delete selected icons
        if (event.key === 'Delete') {
            this.deleteSelectedIcons();
        }
        
        // F2 - Rename selected icon
        if (event.key === 'F2') {
            const selectedIcon = Array.from(this.selectedIcons)[0];
            if (selectedIcon) {
                this.renameIcon(selectedIcon);
            }
        }
        
        // Enter - Open selected icon
        if (event.key === 'Enter') {
            const selectedIcon = Array.from(this.selectedIcons)[0];
            if (selectedIcon) {
                const appName = selectedIcon.getAttribute('data-app');
                if (appName) {
                    this.openApplication(appName);
                }
            }
        }
        
        // Escape - Clear selection
        if (event.key === 'Escape') {
            this.clearSelection();
            this.hideContextMenu();
        }
    }
    
    // Handle window resize
    handleWindowResize() {
        // Reposition widgets if needed
        this.repositionWidgets();
    }
    
    // Open application
    openApplication(appName) {
        // This will be handled by the main application system
        if (window.applicationManager) {
            window.applicationManager.openApplication(appName);
        } else {
            console.log('Opening application:', appName);
        }
    }
    
    // Select all icons
    selectAllIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => this.selectIcon(icon));
    }
    
    // Delete selected icons
    deleteSelectedIcons() {
        if (this.selectedIcons.size === 0) return;
        
        const confirmDelete = confirm(`Are you sure you want to delete ${this.selectedIcons.size} item(s)?`);
        if (confirmDelete) {
            this.selectedIcons.forEach(icon => {
                icon.remove();
            });
            this.selectedIcons.clear();
        }
    }
    
    // Rename icon
    renameIcon(icon) {
        const labelElement = icon.querySelector('.icon-label');
        const currentName = labelElement.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'icon-rename-input';
        input.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            padding: 2px 4px;
            border: 1px solid var(--primary-blue);
            border-radius: 4px;
            background: white;
            color: black;
            font-size: 10px;
            text-align: center;
            z-index: 1000;
        `;
        
        labelElement.style.display = 'none';
        icon.appendChild(input);
        
        input.focus();
        input.select();
        
        const finishRename = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                labelElement.textContent = newName;
            }
            labelElement.style.display = '';
            input.remove();
        };
        
        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                finishRename();
            } else if (e.key === 'Escape') {
                labelElement.style.display = '';
                input.remove();
            }
        });
    }
    
    // Delete icon
    deleteIcon(icon) {
        const iconName = icon.querySelector('.icon-label').textContent;
        const confirmDelete = confirm(`Are you sure you want to delete "${iconName}"?`);
        
        if (confirmDelete) {
            icon.remove();
            this.selectedIcons.delete(icon);
        }
    }
    
    // Show icon properties
    showIconProperties(icon) {
        const iconName = icon.querySelector('.icon-label').textContent;
        const appName = icon.getAttribute('data-app');
        
        const properties = `
            Name: ${iconName}
            Type: Application
            Target: ${appName}
            Created: ${new Date().toLocaleDateString()}
        `;
        
        alert(`Properties for ${iconName}:\n\n${properties}`);
    }
    
    // Refresh desktop
    refreshDesktop() {
        // Animate refresh
        const desktop = document.getElementById('desktop');
        desktop.style.opacity = '0.8';
        
        setTimeout(() => {
            desktop.style.opacity = '1';
            this.clearSelection();
            
            // Could reload desktop icons from saved state
            console.log('Desktop refreshed');
        }, 200);
    }
    
    // Create new folder
    createNewFolder() {
        const folderName = prompt('Enter folder name:', 'New Folder');
        if (!folderName) return;
        
        // Create new folder icon
        const desktopIcons = document.getElementById('desktop-icons');
        const folderIcon = document.createElement('div');
        folderIcon.className = 'desktop-icon';
        folderIcon.setAttribute('data-app', 'file-manager');
        folderIcon.innerHTML = `
            <div class="icon-image">
                <i class="fas fa-folder"></i>
            </div>
            <div class="icon-label">${folderName}</div>
        `;
        
        desktopIcons.appendChild(folderIcon);
        
        // Add event listeners
        folderIcon.addEventListener('click', this.handleIconClick.bind(this));
        folderIcon.addEventListener('dblclick', this.handleIconDoubleClick.bind(this));
        folderIcon.addEventListener('contextmenu', this.handleIconContextMenu.bind(this));
        folderIcon.addEventListener('mousedown', this.handleIconMouseDown.bind(this));
    }
    
    // Create new file
    createNewFile() {
        const fileName = prompt('Enter file name:', 'New File.txt');
        if (!fileName) return;
        
        // Create new file icon
        const desktopIcons = document.getElementById('desktop-icons');
        const fileIcon = document.createElement('div');
        fileIcon.className = 'desktop-icon';
        fileIcon.setAttribute('data-app', 'text-editor');
        fileIcon.innerHTML = `
            <div class="icon-image">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="icon-label">${fileName}</div>
        `;
        
        desktopIcons.appendChild(fileIcon);
        
        // Add event listeners
        fileIcon.addEventListener('click', this.handleIconClick.bind(this));
        fileIcon.addEventListener('dblclick', this.handleIconDoubleClick.bind(this));
        fileIcon.addEventListener('contextmenu', this.handleIconContextMenu.bind(this));
        fileIcon.addEventListener('mousedown', this.handleIconMouseDown.bind(this));
    }
    
    // Open personalization
    openPersonalization() {
        alert('Personalization settings would open here.\n\nThis would allow users to:\n- Change wallpaper\n- Adjust theme colors\n- Modify desktop layout\n- Configure widgets');
    }
    
    // Open display settings
    openDisplaySettings() {
        alert('Display settings would open here.\n\nThis would allow users to:\n- Change screen resolution\n- Adjust scaling\n- Configure multiple monitors\n- Set refresh rate');
    }
    
    // Create clock widget
    createClockWidget() {
        const clockWidget = document.createElement('div');
        clockWidget.className = 'desktop-widget clock-widget';
        clockWidget.innerHTML = `
            <div class="widget-header">
                Clock
                <button class="widget-close">&times;</button>
            </div>
            <div class="clock-time" id="widget-clock-time">12:00 PM</div>
            <div class="clock-date" id="widget-clock-date">January 1, 2024</div>
        `;
        
        document.getElementById('desktop').appendChild(clockWidget);
        
        // Close button
        clockWidget.querySelector('.widget-close').addEventListener('click', () => {
            clockWidget.remove();
            this.widgets.delete('clock');
        });
        
        this.widgets.set('clock', clockWidget);
    }
    
    // Create weather widget
    createWeatherWidget() {
        const weatherWidget = document.createElement('div');
        weatherWidget.className = 'desktop-widget weather-widget';
        weatherWidget.innerHTML = `
            <div class="widget-header">
                Weather
                <button class="widget-close">&times;</button>
            </div>
            <div class="weather-info">
                <div class="weather-temp">72°F</div>
                <div class="weather-desc">Partly Cloudy</div>
                <div class="weather-details">
                    <div>Humidity: 65%</div>
                    <div>Wind: 8 mph</div>
                </div>
            </div>
        `;
        
        document.getElementById('desktop').appendChild(weatherWidget);
        
        // Close button
        weatherWidget.querySelector('.widget-close').addEventListener('click', () => {
            weatherWidget.remove();
            this.widgets.delete('weather');
        });
        
        this.widgets.set('weather', weatherWidget);
    }
    
    // Update clock
    updateClock() {
        const now = new Date();
        
        // Update taskbar clock
        const taskbarTime = document.querySelector('.taskbar-clock .time');
        const taskbarDate = document.querySelector('.taskbar-clock .date');
        
        if (taskbarTime) {
            taskbarTime.textContent = now.toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        }
        
        if (taskbarDate) {
            taskbarDate.textContent = now.toLocaleDateString([], { 
                month: 'numeric', 
                day: 'numeric',
                year: 'numeric'
            });
        }
        
        // Update widget clock
        const widgetTime = document.getElementById('widget-clock-time');
        const widgetDate = document.getElementById('widget-clock-date');
        
        if (widgetTime) {
            widgetTime.textContent = now.toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        }
        
        if (widgetDate) {
            widgetDate.textContent = now.toLocaleDateString([], { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Update every second
        setTimeout(() => this.updateClock(), 1000);
    }
    
    // Reposition widgets
    repositionWidgets() {
        // Ensure widgets stay within viewport bounds
        this.widgets.forEach(widget => {
            const rect = widget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            if (rect.right > viewportWidth) {
                widget.style.right = '20px';
                widget.style.left = 'auto';
            }
            
            if (rect.bottom > viewportHeight - 60) { // Account for taskbar
                widget.style.bottom = '80px';
                widget.style.top = 'auto';
            }
        });
    }
    
    // Save desktop state
    saveDesktopState() {
        const state = {
            icons: [],
            widgets: Array.from(this.widgets.keys())
        };
        
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            state.icons.push({
                app: icon.getAttribute('data-app'),
                name: icon.querySelector('.icon-label').textContent,
                x: rect.left,
                y: rect.top
            });
        });
        
        localStorage.setItem('desktopState', JSON.stringify(state));
    }
    
    // Load desktop state
    loadDesktopState() {
        const savedState = localStorage.getItem('desktopState');
        if (!savedState) return;
        
        try {
            const state = JSON.parse(savedState);
            
            // Restore widgets
            state.widgets.forEach(widgetType => {
                if (widgetType === 'clock' && !this.widgets.has('clock')) {
                    this.createClockWidget();
                } else if (widgetType === 'weather' && !this.widgets.has('weather')) {
                    this.createWeatherWidget();
                }
            });
            
            // Could restore icon positions here
            
        } catch (error) {
            console.error('Failed to load desktop state:', error);
        }
    }
}

// Global desktop instance
window.desktop = new Desktop();