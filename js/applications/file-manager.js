// File Manager Application for Windows 11 Web OS

class FileManagerApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 900;
        this.defaultHeight = 600;
        this.minWidth = 600;
        this.minHeight = 400;
        
        this.currentPath = options.initialPath || ['C:', 'Users', 'User'];
        this.viewMode = 'grid'; // grid or list
        this.selectedItems = new Set();
        this.clipboard = null;
        this.history = [];
        this.historyIndex = -1;
        this.sortBy = 'name';
        this.sortOrder = 'asc';
    }
    
    render() {
        return `
            <div class="file-manager">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="fm-back" title="Back" disabled>
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="app-button" id="fm-forward" title="Forward" disabled>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="app-button" id="fm-up" title="Up">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="app-button" id="fm-refresh" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="fm-new-folder" title="New Folder">
                            <i class="fas fa-folder-plus"></i>
                            <span>New Folder</span>
                        </button>
                        <button class="app-button" id="fm-new-file" title="New File">
                            <i class="fas fa-file-plus"></i>
                            <span>New File</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="fm-cut" title="Cut" disabled>
                            <i class="fas fa-cut"></i>
                        </button>
                        <button class="app-button" id="fm-copy" title="Copy" disabled>
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="app-button" id="fm-paste" title="Paste" disabled>
                            <i class="fas fa-paste"></i>
                        </button>
                        <button class="app-button" id="fm-delete" title="Delete" disabled>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="fm-view-grid" title="Grid View">
                            <i class="fas fa-th"></i>
                        </button>
                        <button class="app-button" id="fm-view-list" title="List View">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <input type="text" class="app-input" id="fm-search" placeholder="Search files..." style="width: 200px;">
                        <button class="app-button" id="fm-search-btn" title="Search">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="breadcrumb" id="fm-breadcrumb"></div>
                
                <div class="file-manager-content">
                    <div class="file-manager-sidebar">
                        <div class="sidebar-section">
                            <div class="sidebar-title">Quick Access</div>
                            <div class="sidebar-item" data-path="C:\\Users\\User\\Desktop">
                                <i class="fas fa-desktop"></i>
                                <span>Desktop</span>
                            </div>
                            <div class="sidebar-item" data-path="C:\\Users\\User\\Documents">
                                <i class="fas fa-file-alt"></i>
                                <span>Documents</span>
                            </div>
                            <div class="sidebar-item" data-path="C:\\Users\\User\\Downloads">
                                <i class="fas fa-download"></i>
                                <span>Downloads</span>
                            </div>
                            <div class="sidebar-item" data-path="C:\\Users\\User\\Pictures">
                                <i class="fas fa-images"></i>
                                <span>Pictures</span>
                            </div>
                            <div class="sidebar-item" data-path="C:\\Users\\User\\Videos">
                                <i class="fas fa-video"></i>
                                <span>Videos</span>
                            </div>
                            <div class="sidebar-item" data-path="C:\\Users\\User\\Music">
                                <i class="fas fa-music"></i>
                                <span>Music</span>
                            </div>
                        </div>
                        
                        <div class="sidebar-section">
                            <div class="sidebar-title">This PC</div>
                            <div class="sidebar-item" data-path="C:">
                                <i class="fas fa-hdd"></i>
                                <span>Local Disk (C:)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="file-manager-main">
                        <div class="file-manager-view" id="fm-view">
                            <!-- File items will be populated here -->
                        </div>
                    </div>
                </div>
                
                <div class="file-manager-status" style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-xs) var(--spacing-md);
                    background: var(--bg-tertiary);
                    border-top: 1px solid var(--border-light);
                    font-size: var(--font-size-xs);
                    color: var(--text-secondary);
                ">
                    <div id="fm-status-text">Ready</div>
                    <div id="fm-item-count">0 items</div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Toolbar buttons
        content.querySelector('#fm-back').addEventListener('click', () => this.goBack());
        content.querySelector('#fm-forward').addEventListener('click', () => this.goForward());
        content.querySelector('#fm-up').addEventListener('click', () => this.goUp());
        content.querySelector('#fm-refresh').addEventListener('click', () => this.refresh());
        
        content.querySelector('#fm-new-folder').addEventListener('click', () => this.createNewFolder());
        content.querySelector('#fm-new-file').addEventListener('click', () => this.createNewFile());
        
        content.querySelector('#fm-cut').addEventListener('click', () => this.cutSelected());
        content.querySelector('#fm-copy').addEventListener('click', () => this.copySelected());
        content.querySelector('#fm-paste').addEventListener('click', () => this.paste());
        content.querySelector('#fm-delete').addEventListener('click', () => this.deleteSelected());
        
        content.querySelector('#fm-view-grid').addEventListener('click', () => this.setViewMode('grid'));
        content.querySelector('#fm-view-list').addEventListener('click', () => this.setViewMode('list'));
        
        // Search
        const searchInput = content.querySelector('#fm-search');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
        content.querySelector('#fm-search-btn').addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });
        
        // Sidebar navigation
        const sidebarItems = content.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const path = item.getAttribute('data-path');
                if (path) {
                    this.navigateToPath(path);
                }
            });
        });
        
        // File view area
        const fileView = content.querySelector('#fm-view');
        fileView.addEventListener('click', (e) => this.handleFileViewClick(e));
        fileView.addEventListener('dblclick', (e) => this.handleFileViewDoubleClick(e));
        fileView.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        
        // Keyboard shortcuts
        content.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // File system events
        if (window.fileSystem) {
            window.fileSystem.addEventListener((event, data) => {
                if (event === 'directoryChanged' || event === 'itemCreated' || 
                    event === 'itemDeleted' || event === 'itemRenamed') {
                    this.refresh();
                }
            });
        }
    }
    
    loadData() {
        this.navigateToPath(this.currentPath);
        this.updateViewMode();
    }
    
    navigateToPath(path) {
        if (typeof path === 'string') {
            path = window.fileSystem.parsePath(path);
        }
        
        if (window.fileSystem.changeDirectory(path)) {
            this.currentPath = [...path];
            this.addToHistory(this.currentPath);
            this.updateBreadcrumb();
            this.updateFileView();
            this.updateNavigationButtons();
            this.clearSelection();
            this.updateTitle(`File Manager - ${window.fileSystem.getPathString(this.currentPath)}`);
        }
    }
    
    addToHistory(path) {
        // Remove any forward history
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new path
        this.history.push([...path]);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const path = this.history[this.historyIndex];
            this.currentPath = [...path];
            window.fileSystem.changeDirectory(this.currentPath);
            this.updateBreadcrumb();
            this.updateFileView();
            this.updateNavigationButtons();
            this.clearSelection();
        }
    }
    
    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const path = this.history[this.historyIndex];
            this.currentPath = [...path];
            window.fileSystem.changeDirectory(this.currentPath);
            this.updateBreadcrumb();
            this.updateFileView();
            this.updateNavigationButtons();
            this.clearSelection();
        }
    }
    
    goUp() {
        if (this.currentPath.length > 1) {
            const parentPath = this.currentPath.slice(0, -1);
            this.navigateToPath(parentPath);
        }
    }
    
    refresh() {
        this.updateFileView();
        this.updateStatus('Refreshed');
    }
    
    updateBreadcrumb() {
        const breadcrumb = this.getContentElement().querySelector('#fm-breadcrumb');
        let html = '';
        
        this.currentPath.forEach((part, index) => {
            if (index > 0) {
                html += '<span class="breadcrumb-separator">></span>';
            }
            
            const isLast = index === this.currentPath.length - 1;
            const pathToHere = this.currentPath.slice(0, index + 1);
            
            html += `
                <div class="breadcrumb-item ${isLast ? 'current' : ''}" 
                     data-path="${window.fileSystem.getPathString(pathToHere)}">
                    ${part}
                </div>
            `;
        });
        
        breadcrumb.innerHTML = html;
        
        // Add click handlers
        const items = breadcrumb.querySelectorAll('.breadcrumb-item:not(.current)');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const path = item.getAttribute('data-path');
                this.navigateToPath(path);
            });
        });
    }
    
    updateFileView() {
        const fileView = this.getContentElement().querySelector('#fm-view');
        const items = window.fileSystem.listDirectory(this.currentPath);
        
        // Sort items
        const sortedItems = this.sortItems(items);
        
        if (this.viewMode === 'grid') {
            this.renderGridView(fileView, sortedItems);
        } else {
            this.renderListView(fileView, sortedItems);
        }
        
        this.updateItemCount(sortedItems.length);
        this.updateStatus('Ready');
    }
    
    sortItems(items) {
        return items.sort((a, b) => {
            // Folders first
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
            }
            
            let compareValue = 0;
            
            switch (this.sortBy) {
                case 'name':
                    compareValue = a.name.localeCompare(b.name);
                    break;
                case 'size':
                    compareValue = (a.size || 0) - (b.size || 0);
                    break;
                case 'modified':
                    compareValue = new Date(a.modified) - new Date(b.modified);
                    break;
                case 'type':
                    const extA = window.fileSystem.getFileExtension(a.name);
                    const extB = window.fileSystem.getFileExtension(b.name);
                    compareValue = extA.localeCompare(extB);
                    break;
            }
            
            return this.sortOrder === 'asc' ? compareValue : -compareValue;
        });
    }
    
    renderGridView(container, items) {
        container.className = 'file-manager-view file-grid';
        
        let html = '';
        items.forEach(item => {
            const icon = window.fileSystem.getFileIcon(item);
            const isSelected = this.selectedItems.has(item.name);
            
            html += `
                <div class="file-item ${isSelected ? 'selected' : ''}" 
                     data-name="${item.name}" 
                     data-type="${item.type}">
                    <div class="file-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="file-name">${item.name}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    renderListView(container, items) {
        container.className = 'file-manager-view file-list';
        
        let html = `
            <div class="file-list-header" style="
                display: flex;
                align-items: center;
                padding: var(--spacing-sm);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-light);
                font-weight: 600;
                font-size: var(--font-size-xs);
            ">
                <div style="width: 40px;"></div>
                <div style="flex: 1; cursor: pointer;" data-sort="name">
                    Name ${this.sortBy === 'name' ? (this.sortOrder === 'asc' ? '↑' : '↓') : ''}
                </div>
                <div style="width: 80px; cursor: pointer;" data-sort="size">
                    Size ${this.sortBy === 'size' ? (this.sortOrder === 'asc' ? '↑' : '↓') : ''}
                </div>
                <div style="width: 150px; cursor: pointer;" data-sort="modified">
                    Modified ${this.sortBy === 'modified' ? (this.sortOrder === 'asc' ? '↑' : '↓') : ''}
                </div>
            </div>
        `;
        
        items.forEach(item => {
            const icon = window.fileSystem.getFileIcon(item);
            const isSelected = this.selectedItems.has(item.name);
            const size = item.type === 'folder' ? '' : window.fileSystem.formatFileSize(item.size || 0);
            const modified = window.fileSystem.formatDate(new Date(item.modified));
            
            html += `
                <div class="file-list-item ${isSelected ? 'selected' : ''}" 
                     data-name="${item.name}" 
                     data-type="${item.type}">
                    <div class="file-list-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="file-list-name">${item.name}</div>
                    <div class="file-list-size">${size}</div>
                    <div class="file-list-date">${modified}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add sort handlers
        const sortHeaders = container.querySelectorAll('[data-sort]');
        sortHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.getAttribute('data-sort');
                if (this.sortBy === sortBy) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortBy = sortBy;
                    this.sortOrder = 'asc';
                }
                this.updateFileView();
            });
        });
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
        this.updateViewMode();
        this.updateFileView();
    }
    
    updateViewMode() {
        const content = this.getContentElement();
        const gridBtn = content.querySelector('#fm-view-grid');
        const listBtn = content.querySelector('#fm-view-list');
        
        if (this.viewMode === 'grid') {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }
    
    updateNavigationButtons() {
        const content = this.getContentElement();
        const backBtn = content.querySelector('#fm-back');
        const forwardBtn = content.querySelector('#fm-forward');
        const upBtn = content.querySelector('#fm-up');
        
        backBtn.disabled = this.historyIndex <= 0;
        forwardBtn.disabled = this.historyIndex >= this.history.length - 1;
        upBtn.disabled = this.currentPath.length <= 1;
    }
    
    updateItemCount(count) {
        const itemCount = this.getContentElement().querySelector('#fm-item-count');
        itemCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    }
    
    updateStatus(message) {
        const statusText = this.getContentElement().querySelector('#fm-status-text');
        statusText.textContent = message;
        
        if (message !== 'Ready') {
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 3000);
        }
    }
    
    handleFileViewClick(event) {
        const fileItem = event.target.closest('.file-item, .file-list-item');
        
        if (!fileItem) {
            // Clicked on empty space
            this.clearSelection();
            return;
        }
        
        const itemName = fileItem.getAttribute('data-name');
        const isCtrlPressed = event.ctrlKey || event.metaKey;
        
        if (isCtrlPressed) {
            this.toggleSelection(itemName);
        } else {
            this.clearSelection();
            this.selectItem(itemName);
        }
        
        this.updateSelectionButtons();
    }
    
    handleFileViewDoubleClick(event) {
        const fileItem = event.target.closest('.file-item, .file-list-item');
        if (!fileItem) return;
        
        const itemName = fileItem.getAttribute('data-name');
        const itemType = fileItem.getAttribute('data-type');
        
        if (itemType === 'folder') {
            const newPath = [...this.currentPath, itemName];
            this.navigateToPath(newPath);
        } else {
            this.openFile(itemName);
        }
    }
    
    handleContextMenu(event) {
        event.preventDefault();
        
        const fileItem = event.target.closest('.file-item, .file-list-item');
        
        if (fileItem) {
            const itemName = fileItem.getAttribute('data-name');
            if (!this.selectedItems.has(itemName)) {
                this.clearSelection();
                this.selectItem(itemName);
            }
            this.showItemContextMenu(event.clientX, event.clientY);
        } else {
            this.showFolderContextMenu(event.clientX, event.clientY);
        }
    }
    
    showItemContextMenu(x, y) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        
        const selectedCount = this.selectedItems.size;
        const isFolder = this.getSelectedItems()[0]?.type === 'folder';
        
        contextMenu.innerHTML = `
            <div class="context-item" data-action="open">
                <i class="fas fa-folder-open"></i>
                <span>${isFolder ? 'Open' : 'Open'}</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" data-action="cut">
                <i class="fas fa-cut"></i>
                <span>Cut</span>
            </div>
            <div class="context-item" data-action="copy">
                <i class="fas fa-copy"></i>
                <span>Copy</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" data-action="rename" ${selectedCount > 1 ? 'style="display: none;"' : ''}>
                <i class="fas fa-edit"></i>
                <span>Rename</span>
            </div>
            <div class="context-item" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" data-action="properties">
                <i class="fas fa-info-circle"></i>
                <span>Properties</span>
            </div>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Handle clicks
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-item')?.getAttribute('data-action');
            if (action) {
                this.handleContextAction(action);
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
    
    showFolderContextMenu(x, y) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        
        contextMenu.innerHTML = `
            <div class="context-item" data-action="new-folder">
                <i class="fas fa-folder-plus"></i>
                <span>New Folder</span>
            </div>
            <div class="context-item" data-action="new-file">
                <i class="fas fa-file-plus"></i>
                <span>New File</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" data-action="paste" ${!this.clipboard ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                <i class="fas fa-paste"></i>
                <span>Paste</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" data-action="refresh">
                <i class="fas fa-sync-alt"></i>
                <span>Refresh</span>
            </div>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Handle clicks
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-item')?.getAttribute('data-action');
            if (action) {
                this.handleContextAction(action);
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
    
    handleContextAction(action) {
        switch (action) {
            case 'open':
                this.openSelected();
                break;
            case 'cut':
                this.cutSelected();
                break;
            case 'copy':
                this.copySelected();
                break;
            case 'paste':
                this.paste();
                break;
            case 'rename':
                this.renameSelected();
                break;
            case 'delete':
                this.deleteSelected();
                break;
            case 'properties':
                this.showProperties();
                break;
            case 'new-folder':
                this.createNewFolder();
                break;
            case 'new-file':
                this.createNewFile();
                break;
            case 'refresh':
                this.refresh();
                break;
        }
    }
    
    selectItem(itemName) {
        this.selectedItems.add(itemName);
        this.updateItemSelection();
    }
    
    toggleSelection(itemName) {
        if (this.selectedItems.has(itemName)) {
            this.selectedItems.delete(itemName);
        } else {
            this.selectedItems.add(itemName);
        }
        this.updateItemSelection();
    }
    
    clearSelection() {
        this.selectedItems.clear();
        this.updateItemSelection();
        this.updateSelectionButtons();
    }
    
    updateItemSelection() {
        const content = this.getContentElement();
        const fileItems = content.querySelectorAll('.file-item, .file-list-item');
        
        fileItems.forEach(item => {
            const itemName = item.getAttribute('data-name');
            if (this.selectedItems.has(itemName)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        this.updateSelectionButtons();
    }
    
    updateSelectionButtons() {
        const content = this.getContentElement();
        const hasSelection = this.selectedItems.size > 0;
        
        content.querySelector('#fm-cut').disabled = !hasSelection;
        content.querySelector('#fm-copy').disabled = !hasSelection;
        content.querySelector('#fm-delete').disabled = !hasSelection;
        content.querySelector('#fm-paste').disabled = !this.clipboard;
    }
    
    getSelectedItems() {
        const items = window.fileSystem.listDirectory(this.currentPath);
        return items.filter(item => this.selectedItems.has(item.name));
    }
    
    openSelected() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 1) {
            const item = selectedItems[0];
            if (item.type === 'folder') {
                const newPath = [...this.currentPath, item.name];
                this.navigateToPath(newPath);
            } else {
                this.openFile(item.name);
            }
        }
    }
    
    openFile(fileName) {
        const filePath = [...this.currentPath, fileName];
        const extension = window.fileSystem.getFileExtension(fileName).toLowerCase();
        
        let appName = 'text-editor'; // default
        
        if (['html', 'css', 'js', 'py', 'json', 'xml', 'php', 'cpp', 'c', 'java'].includes(extension)) {
            appName = 'code-editor';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
            appName = 'paint';
        } else if (['mp4', 'avi', 'mov', 'wmv', 'mkv'].includes(extension)) {
            appName = 'video-editor';
        }
        
        if (window.applicationManager) {
            window.applicationManager.openApplication(appName, { 
                filePath: window.fileSystem.getPathString(filePath),
                fileName: fileName
            });
        }
    }
    
    createNewFolder() {
        const folderName = prompt('Enter folder name:', 'New Folder');
        if (folderName && folderName.trim()) {
            if (window.fileSystem.createFolder(folderName.trim(), this.currentPath)) {
                this.updateFileView();
                this.updateStatus(`Created folder: ${folderName}`);
            } else {
                alert('Failed to create folder. Name may already exist.');
            }
        }
    }
    
    createNewFile() {
        const fileName = prompt('Enter file name:', 'New File.txt');
        if (fileName && fileName.trim()) {
            if (window.fileSystem.createFile(fileName.trim(), '', this.currentPath)) {
                this.updateFileView();
                this.updateStatus(`Created file: ${fileName}`);
            } else {
                alert('Failed to create file. Name may already exist.');
            }
        }
    }
    
    cutSelected() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) {
            this.clipboard = {
                operation: 'cut',
                items: selectedItems.map(item => ({
                    ...item,
                    sourcePath: this.currentPath
                }))
            };
            this.updateSelectionButtons();
            this.updateStatus(`Cut ${selectedItems.length} item(s)`);
        }
    }
    
    copySelected() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) {
            this.clipboard = {
                operation: 'copy',
                items: selectedItems.map(item => ({
                    ...item,
                    sourcePath: this.currentPath
                }))
            };
            this.updateSelectionButtons();
            this.updateStatus(`Copied ${selectedItems.length} item(s)`);
        }
    }
    
    paste() {
        if (!this.clipboard) return;
        
        let successCount = 0;
        
        this.clipboard.items.forEach(item => {
            const sourcePath = [...item.sourcePath, item.name];
            
            if (this.clipboard.operation === 'copy') {
                if (window.fileSystem.copyItem(sourcePath, this.currentPath)) {
                    successCount++;
                }
            } else if (this.clipboard.operation === 'cut') {
                if (window.fileSystem.moveItem(sourcePath, this.currentPath)) {
                    successCount++;
                }
            }
        });
        
        if (this.clipboard.operation === 'cut') {
            this.clipboard = null; // Clear clipboard after cut operation
        }
        
        this.updateFileView();
        this.updateSelectionButtons();
        this.updateStatus(`Pasted ${successCount} item(s)`);
    }
    
    deleteSelected() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length === 0) return;
        
        const confirmMessage = selectedItems.length === 1 
            ? `Are you sure you want to delete "${selectedItems[0].name}"?`
            : `Are you sure you want to delete ${selectedItems.length} items?`;
        
        if (confirm(confirmMessage)) {
            let deletedCount = 0;
            
            selectedItems.forEach(item => {
                const itemPath = [...this.currentPath, item.name];
                if (window.fileSystem.deleteItem(itemPath)) {
                    deletedCount++;
                }
            });
            
            this.clearSelection();
            this.updateFileView();
            this.updateStatus(`Deleted ${deletedCount} item(s)`);
        }
    }
    
    renameSelected() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length !== 1) return;
        
        const item = selectedItems[0];
        const newName = prompt('Enter new name:', item.name);
        
        if (newName && newName.trim() && newName !== item.name) {
            const itemPath = [...this.currentPath, item.name];
            if (window.fileSystem.renameItem(itemPath, newName.trim())) {
                this.clearSelection();
                this.updateFileView();
                this.updateStatus(`Renamed to: ${newName}`);
            } else {
                alert('Failed to rename. Name may already exist.');
            }
        }
    }
    
    showProperties() {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length !== 1) return;
        
        const item = selectedItems[0];
        const properties = `
Name: ${item.name}
Type: ${item.type === 'folder' ? 'Folder' : 'File'}
Size: ${item.type === 'folder' ? 'N/A' : window.fileSystem.formatFileSize(item.size || 0)}
Created: ${window.fileSystem.formatDate(new Date(item.created))}
Modified: ${window.fileSystem.formatDate(new Date(item.modified))}
Location: ${window.fileSystem.getPathString(this.currentPath)}
        `.trim();
        
        alert(`Properties for ${item.name}:\n\n${properties}`);
    }
    
    handleSearch(query) {
        // Real-time search feedback could be implemented here
    }
    
    performSearch(query) {
        if (!query.trim()) {
            this.updateFileView();
            return;
        }
        
        const results = window.fileSystem.searchFiles(query, this.currentPath, true);
        this.renderSearchResults(results, query);
        this.updateStatus(`Found ${results.length} result(s) for "${query}"`);
    }
    
    renderSearchResults(results, query) {
        const fileView = this.getContentElement().querySelector('#fm-view');
        
        if (results.length === 0) {
            fileView.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: var(--text-secondary);
                ">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: var(--spacing-md);"></i>
                    <div>No results found for "${query}"</div>
                </div>
            `;
            return;
        }
        
        fileView.className = 'file-manager-view file-list';
        
        let html = `
            <div class="search-results-header" style="
                padding: var(--spacing-md);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-light);
                font-weight: 600;
            ">
                Search results for "${query}" (${results.length} items)
            </div>
        `;
        
        results.forEach(item => {
            const icon = window.fileSystem.getFileIcon(item);
            const pathString = window.fileSystem.getPathString(item.path.slice(0, -1));
            
            html += `
                <div class="file-list-item search-result" 
                     data-name="${item.name}" 
                     data-type="${item.type}"
                     data-path="${window.fileSystem.getPathString(item.path)}">
                    <div class="file-list-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="file-list-name">${item.name}</div>
                    <div class="file-list-size">${item.type === 'folder' ? '' : window.fileSystem.formatFileSize(item.size || 0)}</div>
                    <div class="file-list-date">${pathString}</div>
                </div>
            `;
        });
        
        fileView.innerHTML = html;
        
        // Add click handlers for search results
        const searchResults = fileView.querySelectorAll('.search-result');
        searchResults.forEach(result => {
            result.addEventListener('dblclick', () => {
                const fullPath = result.getAttribute('data-path');
                const itemType = result.getAttribute('data-type');
                
                if (itemType === 'folder') {
                    this.navigateToPath(fullPath);
                } else {
                    // Navigate to parent folder and select file
                    const pathParts = window.fileSystem.parsePath(fullPath);
                    const parentPath = pathParts.slice(0, -1);
                    const fileName = pathParts[pathParts.length - 1];
                    
                    this.navigateToPath(parentPath);
                    setTimeout(() => {
                        this.clearSelection();
                        this.selectItem(fileName);
                    }, 100);
                }
                
                // Clear search
                const searchInput = this.getContentElement().querySelector('#fm-search');
                searchInput.value = '';
            });
        });
    }
    
    handleKeyDown(event) {
        // Ctrl+A - Select all
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
            event.preventDefault();
            const items = window.fileSystem.listDirectory(this.currentPath);
            items.forEach(item => this.selectedItems.add(item.name));
            this.updateItemSelection();
        }
        
        // Delete key
        if (event.key === 'Delete') {
            this.deleteSelected();
        }
        
        // F2 - Rename
        if (event.key === 'F2') {
            this.renameSelected();
        }
        
        // Enter - Open
        if (event.key === 'Enter') {
            this.openSelected();
        }
        
        // Escape - Clear selection
        if (event.key === 'Escape') {
            this.clearSelection();
            
            // Clear search if active
            const searchInput = this.getContentElement().querySelector('#fm-search');
            if (searchInput.value) {
                searchInput.value = '';
                this.updateFileView();
            }
        }
        
        // Ctrl+C - Copy
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            event.preventDefault();
            this.copySelected();
        }
        
        // Ctrl+X - Cut
        if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
            event.preventDefault();
            this.cutSelected();
        }
        
        // Ctrl+V - Paste
        if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
            event.preventDefault();
            this.paste();
        }
        
        // Backspace - Go up
        if (event.key === 'Backspace') {
            event.preventDefault();
            this.goUp();
        }
        
        // F5 - Refresh
        if (event.key === 'F5') {
            event.preventDefault();
            this.refresh();
        }
    }
}

// Register the application
window.FileManagerApp = FileManagerApp;