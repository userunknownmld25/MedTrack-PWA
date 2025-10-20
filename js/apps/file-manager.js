// File Manager Application
class FileManagerApp {
    constructor() {
        this.name = 'File Manager';
        this.icon = '📁';
        this.currentPath = '/';
        this.files = [];
        this.selectedFiles = [];
        this.viewMode = 'grid'; // 'grid' or 'list'
        this.sortBy = 'name'; // 'name', 'size', 'date', 'type'
        this.sortOrder = 'asc'; // 'asc' or 'desc'
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="app-toolbar">
                    <button class="toolbar-button" id="back-btn" title="Back">←</button>
                    <button class="toolbar-button" id="forward-btn" title="Forward">→</button>
                    <button class="toolbar-button" id="up-btn" title="Up">↑</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="refresh-btn" title="Refresh">↻</button>
                    <button class="toolbar-button" id="view-btn" title="View">⊞</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="new-folder-btn" title="New Folder">📁</button>
                    <button class="toolbar-button" id="new-file-btn" title="New File">📄</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="delete-btn" title="Delete">🗑️</button>
                    <button class="toolbar-button" id="rename-btn" title="Rename">✏️</button>
                    <button class="toolbar-button" id="properties-btn" title="Properties">ℹ️</button>
                </div>
                <div class="file-manager-main">
                    <div class="file-sidebar">
                        <div class="sidebar-section">
                            <h4>Quick Access</h4>
                            <div class="sidebar-item" data-path="/">🏠 Desktop</div>
                            <div class="sidebar-item" data-path="/documents">📄 Documents</div>
                            <div class="sidebar-item" data-path="/downloads">⬇️ Downloads</div>
                            <div class="sidebar-item" data-path="/pictures">🖼️ Pictures</div>
                            <div class="sidebar-item" data-path="/music">🎵 Music</div>
                            <div class="sidebar-item" data-path="/videos">🎬 Videos</div>
                        </div>
                        <div class="sidebar-section">
                            <h4>This PC</h4>
                            <div class="sidebar-item" data-path="/">💻 Local Disk (C:)</div>
                            <div class="sidebar-item" data-path="/d">💿 Local Disk (D:)</div>
                        </div>
                    </div>
                    <div class="file-content">
                        <div class="file-path-bar">
                            <div class="path-breadcrumb" id="path-breadcrumb">
                                <span class="path-item active">🏠</span>
                            </div>
                        </div>
                        <div class="file-grid" id="file-grid">
                            <!-- Files will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.setupEventListeners();
        this.loadFiles();
    }

    setupEventListeners() {
        // Toolbar buttons
        this.container.querySelector('#back-btn').addEventListener('click', () => this.goBack());
        this.container.querySelector('#forward-btn').addEventListener('click', () => this.goForward());
        this.container.querySelector('#up-btn').addEventListener('click', () => this.goUp());
        this.container.querySelector('#refresh-btn').addEventListener('click', () => this.refresh());
        this.container.querySelector('#view-btn').addEventListener('click', () => this.toggleView());
        this.container.querySelector('#new-folder-btn').addEventListener('click', () => this.createFolder());
        this.container.querySelector('#new-file-btn').addEventListener('click', () => this.createFile());
        this.container.querySelector('#delete-btn').addEventListener('click', () => this.deleteSelected());
        this.container.querySelector('#rename-btn').addEventListener('click', () => this.renameSelected());
        this.container.querySelector('#properties-btn').addEventListener('click', () => this.showProperties());

        // Sidebar navigation
        this.container.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const path = e.target.dataset.path;
                this.navigateTo(path);
            });
        });

        // File grid
        this.setupFileGridListeners();
    }

    setupFileGridListeners() {
        const fileGrid = this.container.querySelector('#file-grid');
        
        fileGrid.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                if (e.ctrlKey) {
                    this.toggleFileSelection(fileItem);
                } else {
                    this.selectFile(fileItem);
                    const fileName = fileItem.dataset.name;
                    this.openFile(fileName);
                }
            }
        });

        fileGrid.addEventListener('dblclick', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                const fileName = fileItem.dataset.name;
                this.openFile(fileName);
            }
        });

        fileGrid.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showFileContextMenu(e.clientX, e.clientY);
        });
    }

    loadFiles() {
        // Simulate file system
        this.files = this.getFilesForPath(this.currentPath);
        this.renderFiles();
        this.updatePathBreadcrumb();
    }

    getFilesForPath(path) {
        // Simulate different directories
        const fileSystem = {
            '/': [
                { name: 'Documents', type: 'folder', size: 0, date: '2024-01-15', icon: '📁' },
                { name: 'Downloads', type: 'folder', size: 0, date: '2024-01-15', icon: '📁' },
                { name: 'Pictures', type: 'folder', size: 0, date: '2024-01-15', icon: '📁' },
                { name: 'Music', type: 'folder', size: 0, date: '2024-01-15', icon: '📁' },
                { name: 'Videos', type: 'folder', size: 0, date: '2024-01-15', icon: '📁' },
                { name: 'Desktop', type: 'folder', size: 0, date: '2024-01-15', icon: '📁' },
                { name: 'README.txt', type: 'file', size: 1024, date: '2024-01-10', icon: '📄' },
                { name: 'config.json', type: 'file', size: 512, date: '2024-01-12', icon: '⚙️' }
            ],
            '/documents': [
                { name: 'Work', type: 'folder', size: 0, date: '2024-01-14', icon: '📁' },
                { name: 'Personal', type: 'folder', size: 0, date: '2024-01-14', icon: '📁' },
                { name: 'report.pdf', type: 'file', size: 2048000, date: '2024-01-13', icon: '📄' },
                { name: 'notes.txt', type: 'file', size: 256, date: '2024-01-12', icon: '📝' }
            ],
            '/downloads': [
                { name: 'setup.exe', type: 'file', size: 15728640, date: '2024-01-15', icon: '⚙️' },
                { name: 'image.jpg', type: 'file', size: 1048576, date: '2024-01-14', icon: '🖼️' },
                { name: 'archive.zip', type: 'file', size: 5242880, date: '2024-01-13', icon: '📦' }
            ],
            '/pictures': [
                { name: 'vacation', type: 'folder', size: 0, date: '2024-01-10', icon: '📁' },
                { name: 'screenshot.png', type: 'file', size: 2097152, date: '2024-01-15', icon: '🖼️' },
                { name: 'wallpaper.jpg', type: 'file', size: 3145728, date: '2024-01-14', icon: '🖼️' }
            ]
        };

        return fileSystem[path] || [];
    }

    renderFiles() {
        const fileGrid = this.container.querySelector('#file-grid');
        fileGrid.innerHTML = '';

        // Sort files
        const sortedFiles = this.sortFiles(this.files);

        sortedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.name = file.name;
            fileItem.dataset.type = file.type;
            
            fileItem.innerHTML = `
                <div class="file-icon">${file.icon}</div>
                <div class="file-name">${file.name}</div>
                <div class="file-info">
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                    <div class="file-date">${file.date}</div>
                </div>
            `;
            
            fileGrid.appendChild(fileItem);
        });
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
                    comparison = a.type.localeCompare(b.type);
                    break;
            }
            
            return this.sortOrder === 'asc' ? comparison : -comparison;
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    navigateTo(path) {
        this.currentPath = path;
        this.loadFiles();
    }

    goBack() {
        // Simple back navigation
        console.log('Going back');
    }

    goForward() {
        // Simple forward navigation
        console.log('Going forward');
    }

    goUp() {
        if (this.currentPath !== '/') {
            const pathParts = this.currentPath.split('/');
            pathParts.pop();
            const parentPath = pathParts.join('/') || '/';
            this.navigateTo(parentPath);
        }
    }

    refresh() {
        this.loadFiles();
    }

    toggleView() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        const fileGrid = this.container.querySelector('#file-grid');
        fileGrid.className = `file-${this.viewMode}`;
        this.renderFiles();
    }

    createFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            this.files.push({
                name: name,
                type: 'folder',
                size: 0,
                date: new Date().toISOString().split('T')[0],
                icon: '📁'
            });
            this.renderFiles();
        }
    }

    createFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.files.push({
                name: name,
                type: 'file',
                size: 0,
                date: new Date().toISOString().split('T')[0],
                icon: '📄'
            });
            this.renderFiles();
        }
    }

    selectFile(fileItem) {
        // Clear previous selection
        this.container.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Select new file
        fileItem.classList.add('selected');
        this.selectedFiles = [fileItem.dataset.name];
    }

    toggleFileSelection(fileItem) {
        fileItem.classList.toggle('selected');
        
        if (fileItem.classList.contains('selected')) {
            if (!this.selectedFiles.includes(fileItem.dataset.name)) {
                this.selectedFiles.push(fileItem.dataset.name);
            }
        } else {
            this.selectedFiles = this.selectedFiles.filter(name => name !== fileItem.dataset.name);
        }
    }

    openFile(fileName) {
        const file = this.files.find(f => f.name === fileName);
        if (!file) return;

        if (file.type === 'folder') {
            this.navigateTo(this.currentPath + '/' + fileName);
        } else {
            // Open file with appropriate application
            this.openFileWithApp(file);
        }
    }

    openFileWithApp(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'txt':
            case 'md':
                // Open with text editor
                if (window.webOS) {
                    window.webOS.openApp('code-editor');
                }
                break;
            case 'html':
            case 'htm':
                // Open with browser
                if (window.webOS) {
                    window.webOS.openApp('browser');
                }
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                // Open with image viewer
                this.openImageViewer(file);
                break;
            default:
                alert(`Cannot open ${file.name}. No application associated with this file type.`);
        }
    }

    openImageViewer(file) {
        // Simple image viewer
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.innerHTML = `
            <div class="viewer-header">
                <h3>${file.name}</h3>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="viewer-content">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFZpZXdlcjwvdGV4dD48L3N2Zz4=" alt="${file.name}">
            </div>
        `;
        document.body.appendChild(viewer);
    }

    deleteSelected() {
        if (this.selectedFiles.length === 0) return;
        
        const confirmMessage = `Are you sure you want to delete ${this.selectedFiles.length} item(s)?`;
        if (confirm(confirmMessage)) {
            this.selectedFiles.forEach(fileName => {
                this.files = this.files.filter(f => f.name !== fileName);
            });
            this.selectedFiles = [];
            this.renderFiles();
        }
    }

    renameSelected() {
        if (this.selectedFiles.length !== 1) return;
        
        const oldName = this.selectedFiles[0];
        const newName = prompt('Enter new name:', oldName);
        if (newName && newName !== oldName) {
            const file = this.files.find(f => f.name === oldName);
            if (file) {
                file.name = newName;
                this.renderFiles();
            }
        }
    }

    showProperties() {
        if (this.selectedFiles.length !== 1) return;
        
        const fileName = this.selectedFiles[0];
        const file = this.files.find(f => f.name === fileName);
        if (file) {
            const props = `
                Name: ${file.name}
                Type: ${file.type}
                Size: ${this.formatFileSize(file.size)}
                Date: ${file.date}
                Location: ${this.currentPath}
            `;
            alert(props);
        }
    }

    showFileContextMenu(x, y) {
        // Simple context menu implementation
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.innerHTML = `
            <div class="context-item">Open</div>
            <div class="context-item">Open with</div>
            <div class="context-item">Cut</div>
            <div class="context-item">Copy</div>
            <div class="context-item">Paste</div>
            <div class="context-item">Delete</div>
            <div class="context-item">Rename</div>
            <div class="context-item">Properties</div>
        `;
        
        document.body.appendChild(menu);
        
        // Remove menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
            }, { once: true });
        }, 0);
    }

    updatePathBreadcrumb() {
        const breadcrumb = this.container.querySelector('#path-breadcrumb');
        const pathParts = this.currentPath.split('/').filter(part => part);
        
        breadcrumb.innerHTML = '<span class="path-item active">🏠</span>';
        
        pathParts.forEach((part, index) => {
            const pathItem = document.createElement('span');
            pathItem.className = 'path-item';
            pathItem.textContent = part;
            pathItem.addEventListener('click', () => {
                const newPath = '/' + pathParts.slice(0, index + 1).join('/');
                this.navigateTo(newPath);
            });
            breadcrumb.appendChild(pathItem);
        });
    }

    // Search functionality
    search(query) {
        const results = this.files.filter(file => 
            file.name.toLowerCase().includes(query.toLowerCase())
        );
        return results;
    }

    // Copy/Cut/Paste functionality
    copyFiles() {
        // Implementation for copying files
        console.log('Copying files:', this.selectedFiles);
    }

    cutFiles() {
        // Implementation for cutting files
        console.log('Cutting files:', this.selectedFiles);
    }

    pasteFiles() {
        // Implementation for pasting files
        console.log('Pasting files');
    }

    cleanup() {
        console.log('File Manager cleanup');
    }
}