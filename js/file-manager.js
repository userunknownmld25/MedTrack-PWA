// Advanced File Manager System
class FileManager {
    constructor() {
        this.currentPath = '/home/user';
        this.selectedItems = new Set();
        this.clipboard = [];
        this.history = [];
        this.historyIndex = -1;
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.sortBy = 'name'; // 'name', 'size', 'date', 'type'
        this.sortOrder = 'asc'; // 'asc' or 'desc'
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDirectory(this.currentPath);
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeFileManager();
        });
    }

    initializeFileManager() {
        const fileManager = document.querySelector('.file-manager');
        if (!fileManager) return;

        // Setup toolbar events
        this.setupToolbarEvents();
        
        // Setup sidebar events
        this.setupSidebarEvents();
        
        // Setup file grid events
        this.setupFileGridEvents();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupToolbarEvents() {
        const toolbar = document.querySelector('.file-toolbar');
        if (!toolbar) return;

        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-button');
            if (button) {
                const action = button.dataset.action;
                this.handleToolbarAction(action);
            }
        });
    }

    setupSidebarEvents() {
        const sidebar = document.querySelector('.file-sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('click', (e) => {
            const item = e.target.closest('.sidebar-item');
            if (item) {
                const path = item.dataset.path;
                this.navigateToPath(path);
            }
        });
    }

    setupFileGridEvents() {
        const fileGrid = document.querySelector('.file-grid');
        if (!fileGrid) return;

        fileGrid.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                this.handleFileClick(fileItem, e);
            }
        });

        fileGrid.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                this.showContextMenu(e, fileItem);
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isFileManagerActive()) return;

            switch (e.key) {
                case 'F5':
                    e.preventDefault();
                    this.refresh();
                    break;
                case 'Delete':
                    e.preventDefault();
                    this.deleteSelected();
                    break;
                case 'F2':
                    e.preventDefault();
                    this.renameSelected();
                    break;
                case 'F3':
                    e.preventDefault();
                    this.search();
                    break;
                case 'Escape':
                    this.clearSelection();
                    break;
            }

            if (e.ctrlKey) {
                switch (e.key) {
                    case 'a':
                        e.preventDefault();
                        this.selectAll();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.copySelected();
                        break;
                    case 'x':
                        e.preventDefault();
                        this.cutSelected();
                        break;
                    case 'v':
                        e.preventDefault();
                        this.paste();
                        break;
                    case 'z':
                        e.preventDefault();
                        this.undo();
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                }
            }
        });
    }

    isFileManagerActive() {
        const activeWindow = document.querySelector('.window.focused');
        return activeWindow && activeWindow.querySelector('.file-manager');
    }

    navigateToPath(path) {
        this.addToHistory(this.currentPath);
        this.currentPath = this.resolvePath(path);
        this.loadDirectory(this.currentPath);
        this.updatePathDisplay();
        this.updateSidebarSelection(path);
    }

    resolvePath(path) {
        if (path.startsWith('/')) {
            return path;
        }
        
        const pathMap = {
            'home': '/home/user',
            'documents': '/home/user/Documents',
            'pictures': '/home/user/Pictures',
            'music': '/home/user/Music',
            'videos': '/home/user/Videos',
            'downloads': '/home/user/Downloads',
            'desktop': '/home/user/Desktop',
            'c': 'C:\\',
            'd': 'D:\\'
        };
        
        return pathMap[path] || path;
    }

    addToHistory(path) {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(path);
        this.historyIndex = this.history.length - 1;
    }

    loadDirectory(path) {
        const files = this.getDirectoryContents(path);
        this.displayFiles(files);
        this.clearSelection();
    }

    getDirectoryContents(path) {
        const contents = {
            '/home/user': [
                { name: 'Desktop', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Documents', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Downloads', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Music', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Pictures', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Videos', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'readme.txt', type: 'file', size: 1024, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'txt' },
                { name: 'notes.md', type: 'file', size: 2048, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'md' },
                { name: 'script.py', type: 'file', size: 1536, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'py' },
                { name: 'style.css', type: 'file', size: 3072, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'css' },
                { name: 'index.html', type: 'file', size: 4096, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'html' }
            ],
            '/home/user/Documents': [
                { name: 'Work', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Personal', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'report.pdf', type: 'file', size: 102400, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'pdf' },
                { name: 'presentation.pptx', type: 'file', size: 204800, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'pptx' }
            ],
            '/home/user/Pictures': [
                { name: 'Vacation', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'Screenshots', type: 'directory', size: 4096, date: '2024-01-01 12:00:00', permissions: 'drwxr-xr-x' },
                { name: 'photo1.jpg', type: 'file', size: 512000, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'jpg' },
                { name: 'photo2.png', type: 'file', size: 256000, date: '2024-01-01 12:00:00', permissions: '-rw-r--r--', extension: 'png' }
            ]
        };
        
        return contents[path] || [];
    }

    displayFiles(files) {
        const fileGrid = document.querySelector('.file-grid');
        if (!fileGrid) return;

        // Sort files
        const sortedFiles = this.sortFiles(files);
        
        // Generate HTML
        const html = sortedFiles.map(file => this.createFileItemHTML(file)).join('');
        fileGrid.innerHTML = html;
        
        // Update view mode
        fileGrid.className = `file-grid view-${this.viewMode}`;
    }

    sortFiles(files) {
        return files.sort((a, b) => {
            let comparison = 0;
            
            switch (this.sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'size':
                    comparison = a.size - b.size;
                    break;
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case 'type':
                    comparison = (a.extension || '').localeCompare(b.extension || '');
                    break;
            }
            
            return this.sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    createFileItemHTML(file) {
        const icon = this.getFileIcon(file);
        const size = this.formatFileSize(file.size);
        const date = this.formatDate(file.date);
        
        return `
            <div class="file-item" data-name="${file.name}" data-type="${file.type}" data-size="${file.size}" data-date="${file.date}">
                <div class="file-icon">${icon}</div>
                <div class="file-name">${file.name}</div>
                ${this.viewMode === 'list' ? `
                    <div class="file-size">${size}</div>
                    <div class="file-date">${date}</div>
                    <div class="file-permissions">${file.permissions}</div>
                ` : ''}
            </div>
        `;
    }

    getFileIcon(file) {
        if (file.type === 'directory') {
            return '📁';
        }
        
        const iconMap = {
            'txt': '📄',
            'md': '📝',
            'py': '🐍',
            'js': '📜',
            'html': '🌐',
            'css': '🎨',
            'json': '📋',
            'xml': '📄',
            'pdf': '📕',
            'doc': '📘',
            'docx': '📘',
            'xls': '📊',
            'xlsx': '📊',
            'ppt': '📊',
            'pptx': '📊',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'svg': '🖼️',
            'mp3': '🎵',
            'wav': '🎵',
            'mp4': '🎬',
            'avi': '🎬',
            'mov': '🎬',
            'zip': '📦',
            'rar': '📦',
            '7z': '📦',
            'exe': '⚙️',
            'msi': '⚙️',
            'deb': '📦',
            'rpm': '📦'
        };
        
        return iconMap[file.extension] || '📄';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    handleFileClick(fileItem, event) {
        if (event.ctrlKey) {
            this.toggleSelection(fileItem);
        } else if (event.shiftKey) {
            this.selectRange(fileItem);
        } else {
            this.selectItem(fileItem);
        }
        
        if (event.detail === 2) { // Double click
            this.openFile(fileItem);
        }
    }

    toggleSelection(fileItem) {
        const name = fileItem.dataset.name;
        if (this.selectedItems.has(name)) {
            this.selectedItems.delete(name);
            fileItem.classList.remove('selected');
        } else {
            this.selectedItems.add(name);
            fileItem.classList.add('selected');
        }
    }

    selectItem(fileItem) {
        this.clearSelection();
        this.selectedItems.add(fileItem.dataset.name);
        fileItem.classList.add('selected');
    }

    selectRange(fileItem) {
        // Implementation for range selection
        this.selectItem(fileItem);
    }

    clearSelection() {
        this.selectedItems.clear();
        document.querySelectorAll('.file-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
    }

    selectAll() {
        document.querySelectorAll('.file-item').forEach(item => {
            this.selectedItems.add(item.dataset.name);
            item.classList.add('selected');
        });
    }

    openFile(fileItem) {
        const name = fileItem.dataset.name;
        const type = fileItem.dataset.type;
        
        if (type === 'directory') {
            this.navigateToPath(this.currentPath + '/' + name);
        } else {
            this.openFileWithApp(name);
        }
    }

    openFileWithApp(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        
        const appMap = {
            'txt': 'text-editor',
            'md': 'text-editor',
            'py': 'code-editor',
            'js': 'code-editor',
            'html': 'code-editor',
            'css': 'code-editor',
            'json': 'code-editor',
            'xml': 'code-editor',
            'jpg': 'paint',
            'jpeg': 'paint',
            'png': 'paint',
            'gif': 'paint',
            'svg': 'paint'
        };
        
        const app = appMap[extension];
        if (app && window.webOS) {
            window.webOS.openApplication(app);
        } else {
            this.showNotification('File Manager', `Opening ${filename}...`);
        }
    }

    handleToolbarAction(action) {
        switch (action) {
            case 'back':
                this.goBack();
                break;
            case 'forward':
                this.goForward();
                break;
            case 'up':
                this.goUp();
                break;
            case 'new-folder':
                this.createNewFolder();
                break;
            case 'new-file':
                this.createNewFile();
                break;
            case 'view-grid':
                this.setViewMode('grid');
                break;
            case 'view-list':
                this.setViewMode('list');
                break;
            case 'sort-name':
                this.setSortBy('name');
                break;
            case 'sort-size':
                this.setSortBy('size');
                break;
            case 'sort-date':
                this.setSortBy('date');
                break;
            case 'sort-type':
                this.setSortBy('type');
                break;
            case 'refresh':
                this.refresh();
                break;
            case 'search':
                this.search();
                break;
            case 'properties':
                this.showProperties();
                break;
        }
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentPath = this.history[this.historyIndex];
            this.loadDirectory(this.currentPath);
            this.updatePathDisplay();
        }
    }

    goForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentPath = this.history[this.historyIndex];
            this.loadDirectory(this.currentPath);
            this.updatePathDisplay();
        }
    }

    goUp() {
        const parts = this.currentPath.split('/');
        if (parts.length > 1) {
            parts.pop();
            this.navigateToPath(parts.join('/') || '/');
        }
    }

    createNewFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            this.showNotification('File Manager', `Created folder: ${name}`);
            this.refresh();
        }
    }

    createNewFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.showNotification('File Manager', `Created file: ${name}`);
            this.refresh();
        }
    }

    setViewMode(mode) {
        this.viewMode = mode;
        const fileGrid = document.querySelector('.file-grid');
        if (fileGrid) {
            fileGrid.className = `file-grid view-${mode}`;
        }
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.refresh();
    }

    refresh() {
        this.loadDirectory(this.currentPath);
    }

    search() {
        const query = prompt('Search for:');
        if (query) {
            this.showNotification('File Manager', `Searching for: ${query}`);
        }
    }

    showProperties() {
        if (this.selectedItems.size === 1) {
            const selectedName = Array.from(this.selectedItems)[0];
            this.showNotification('File Manager', `Properties for: ${selectedName}`);
        } else {
            this.showNotification('File Manager', 'Select a single item to view properties');
        }
    }

    copySelected() {
        this.clipboard = Array.from(this.selectedItems);
        this.showNotification('File Manager', `Copied ${this.clipboard.length} item(s)`);
    }

    cutSelected() {
        this.clipboard = Array.from(this.selectedItems);
        this.showNotification('File Manager', `Cut ${this.clipboard.length} item(s)`);
    }

    paste() {
        if (this.clipboard.length > 0) {
            this.showNotification('File Manager', `Pasted ${this.clipboard.length} item(s)`);
            this.refresh();
        }
    }

    deleteSelected() {
        if (this.selectedItems.size > 0) {
            const count = this.selectedItems.size;
            if (confirm(`Delete ${count} item(s)?`)) {
                this.showNotification('File Manager', `Deleted ${count} item(s)`);
                this.clearSelection();
                this.refresh();
            }
        }
    }

    renameSelected() {
        if (this.selectedItems.size === 1) {
            const selectedName = Array.from(this.selectedItems)[0];
            const newName = prompt('Enter new name:', selectedName);
            if (newName && newName !== selectedName) {
                this.showNotification('File Manager', `Renamed ${selectedName} to ${newName}`);
                this.refresh();
            }
        }
    }

    undo() {
        this.showNotification('File Manager', 'Undo feature coming soon!');
    }

    redo() {
        this.showNotification('File Manager', 'Redo feature coming soon!');
    }

    showContextMenu(event, fileItem) {
        // Implementation for context menu
        this.showNotification('File Manager', 'Context menu feature coming soon!');
    }

    updatePathDisplay() {
        const pathDisplay = document.querySelector('.file-path');
        if (pathDisplay) {
            const parts = this.currentPath.split('/');
            const pathHTML = parts.map((part, index) => {
                if (index === 0) return '<div class="path-item">🏠</div>';
                return `<div class="path-separator">></div><div class="path-item">${part}</div>`;
            }).join('');
            pathDisplay.innerHTML = pathHTML;
        }
    }

    updateSidebarSelection(path) {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.path === path) {
                item.classList.add('active');
            }
        });
    }

    showNotification(title, message) {
        if (window.webOS) {
            window.webOS.showNotification(title, message);
        } else {
            console.log(`${title}: ${message}`);
        }
    }
}

// Initialize file manager
window.fileManager = new FileManager();