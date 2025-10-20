// Web Browser Application for Windows 11 Web OS

class BrowserApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 1000;
        this.defaultHeight = 700;
        this.minWidth = 600;
        this.minHeight = 400;
        
        this.tabs = [];
        this.activeTabId = null;
        this.tabCounter = 0;
        this.history = [];
        this.bookmarks = this.loadBookmarks();
        this.defaultHomePage = 'about:blank';
        
        // Initialize with first tab
        this.createNewTab(options.url || this.defaultHomePage);
    }
    
    render() {
        return `
            <div class="browser">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="browser-back" title="Back" disabled>
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <button class="app-button" id="browser-forward" title="Forward" disabled>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="app-button" id="browser-refresh" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="app-button" id="browser-home" title="Home">
                            <i class="fas fa-home"></i>
                        </button>
                    </div>
                    
                    <div class="browser-address-bar">
                        <div class="address-bar-icon">
                            <i class="fas fa-lock" id="security-icon"></i>
                        </div>
                        <input type="text" class="browser-address-input" id="address-input" placeholder="Search or enter web address">
                        <button class="address-bar-button" id="go-button">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="browser-bookmark" title="Bookmark this page">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="app-button" id="browser-bookmarks" title="Show bookmarks">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="app-button" id="browser-downloads" title="Downloads">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="app-button" id="browser-menu" title="Menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </div>
                
                <div class="browser-tabs" id="browser-tabs">
                    <!-- Tabs will be populated here -->
                </div>
                
                <div class="browser-content" id="browser-content">
                    <!-- Tab content will be populated here -->
                </div>
                
                <div class="browser-status" id="browser-status" style="display: none;">
                    <div class="status-text" id="status-text">Loading...</div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Navigation buttons
        content.querySelector('#browser-back').addEventListener('click', () => this.goBack());
        content.querySelector('#browser-forward').addEventListener('click', () => this.goForward());
        content.querySelector('#browser-refresh').addEventListener('click', () => this.refresh());
        content.querySelector('#browser-home').addEventListener('click', () => this.goHome());
        
        // Address bar
        const addressInput = content.querySelector('#address-input');
        addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.navigate(addressInput.value);
            }
        });
        
        content.querySelector('#go-button').addEventListener('click', () => {
            this.navigate(addressInput.value);
        });
        
        // Toolbar buttons
        content.querySelector('#browser-bookmark').addEventListener('click', () => this.bookmarkCurrentPage());
        content.querySelector('#browser-bookmarks').addEventListener('click', () => this.showBookmarks());
        content.querySelector('#browser-downloads').addEventListener('click', () => this.showDownloads());
        content.querySelector('#browser-menu').addEventListener('click', () => this.showMenu());
        
        // Tab management
        this.setupTabEventListeners();
    }
    
    loadData() {
        this.renderTabs();
        this.renderActiveTab();
        this.updateNavigationButtons();
    }
    
    createNewTab(url = 'about:blank', title = 'New Tab') {
        const tabId = `tab-${++this.tabCounter}`;
        
        const tab = {
            id: tabId,
            url: url,
            title: title,
            history: [url],
            historyIndex: 0,
            loading: false,
            canGoBack: false,
            canGoForward: false
        };
        
        this.tabs.push(tab);
        this.activeTabId = tabId;
        
        if (this.getContentElement()) {
            this.renderTabs();
            this.renderActiveTab();
            this.updateNavigationButtons();
        }
        
        return tab;
    }
    
    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
        if (tabIndex === -1) return;
        
        this.tabs.splice(tabIndex, 1);
        
        if (this.tabs.length === 0) {
            // Create a new tab if all tabs are closed
            this.createNewTab();
        } else if (this.activeTabId === tabId) {
            // Switch to adjacent tab
            const newActiveIndex = Math.min(tabIndex, this.tabs.length - 1);
            this.activeTabId = this.tabs[newActiveIndex].id;
        }
        
        this.renderTabs();
        this.renderActiveTab();
        this.updateNavigationButtons();
    }
    
    switchToTab(tabId) {
        if (this.tabs.find(tab => tab.id === tabId)) {
            this.activeTabId = tabId;
            this.renderActiveTab();
            this.updateNavigationButtons();
            this.updateAddressBar();
        }
    }
    
    renderTabs() {
        const tabsContainer = this.getContentElement().querySelector('#browser-tabs');
        
        let html = '';
        this.tabs.forEach(tab => {
            const isActive = tab.id === this.activeTabId;
            html += `
                <div class="browser-tab ${isActive ? 'active' : ''}" data-tab-id="${tab.id}">
                    <div class="tab-icon">
                        ${tab.loading ? '<i class="fas fa-spinner fa-spin"></i>' : '<i class="fas fa-globe"></i>'}
                    </div>
                    <div class="tab-title">${this.truncateText(tab.title, 20)}</div>
                    <button class="tab-close" data-tab-id="${tab.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        html += `
            <button class="new-tab-button" id="new-tab-btn">
                <i class="fas fa-plus"></i>
            </button>
        `;
        
        tabsContainer.innerHTML = html;
        this.setupTabEventListeners();
    }
    
    setupTabEventListeners() {
        const content = this.getContentElement();
        
        // Tab clicks
        content.querySelectorAll('.browser-tab').forEach(tabElement => {
            tabElement.addEventListener('click', (e) => {
                if (!e.target.closest('.tab-close')) {
                    const tabId = tabElement.getAttribute('data-tab-id');
                    this.switchToTab(tabId);
                }
            });
        });
        
        // Tab close buttons
        content.querySelectorAll('.tab-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tabId = closeBtn.getAttribute('data-tab-id');
                this.closeTab(tabId);
            });
        });
        
        // New tab button
        const newTabBtn = content.querySelector('#new-tab-btn');
        if (newTabBtn) {
            newTabBtn.addEventListener('click', () => {
                this.createNewTab();
                this.renderTabs();
                this.renderActiveTab();
            });
        }
    }
    
    renderActiveTab() {
        const activeTab = this.getActiveTab();
        if (!activeTab) return;
        
        const contentContainer = this.getContentElement().querySelector('#browser-content');
        
        if (activeTab.url === 'about:blank') {
            this.renderStartPage(contentContainer);
        } else if (activeTab.url.startsWith('about:')) {
            this.renderAboutPage(contentContainer, activeTab.url);
        } else if (activeTab.url.startsWith('file://')) {
            this.renderLocalFile(contentContainer, activeTab.url);
        } else {
            this.renderWebPage(contentContainer, activeTab.url);
        }
        
        this.updateAddressBar();
        this.updateTitle();
    }
    
    renderStartPage(container) {
        container.innerHTML = `
            <div class="start-page">
                <div class="start-page-header">
                    <h1>Welcome to Windows 11 Web OS Browser</h1>
                    <p>Your gateway to the web and local content</p>
                </div>
                
                <div class="start-page-content">
                    <div class="quick-links">
                        <h3>Quick Links</h3>
                        <div class="link-grid">
                            <a href="#" class="quick-link" data-url="https://www.google.com">
                                <i class="fab fa-google"></i>
                                <span>Google</span>
                            </a>
                            <a href="#" class="quick-link" data-url="https://www.github.com">
                                <i class="fab fa-github"></i>
                                <span>GitHub</span>
                            </a>
                            <a href="#" class="quick-link" data-url="https://www.stackoverflow.com">
                                <i class="fab fa-stack-overflow"></i>
                                <span>Stack Overflow</span>
                            </a>
                            <a href="#" class="quick-link" data-url="https://www.youtube.com">
                                <i class="fab fa-youtube"></i>
                                <span>YouTube</span>
                            </a>
                            <a href="#" class="quick-link" data-url="about:features">
                                <i class="fas fa-info-circle"></i>
                                <span>Browser Features</span>
                            </a>
                            <a href="#" class="quick-link" data-url="file://sample.html">
                                <i class="fas fa-file-code"></i>
                                <span>Sample HTML</span>
                            </a>
                        </div>
                    </div>
                    
                    <div class="bookmarks-section" id="bookmarks-preview">
                        <h3>Bookmarks</h3>
                        <div class="bookmarks-list">
                            ${this.renderBookmarksList()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add click handlers for quick links
        container.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('data-url');
                this.navigate(url);
            });
        });
    }
    
    renderAboutPage(container, url) {
        const page = url.split(':')[1];
        
        switch (page) {
            case 'features':
                container.innerHTML = `
                    <div class="about-page">
                        <h1>Browser Features</h1>
                        <div class="features-list">
                            <div class="feature">
                                <h3><i class="fas fa-tabs"></i> Tabbed Browsing</h3>
                                <p>Open multiple pages in tabs and switch between them easily.</p>
                            </div>
                            <div class="feature">
                                <h3><i class="fas fa-bookmark"></i> Bookmarks</h3>
                                <p>Save your favorite pages for quick access.</p>
                            </div>
                            <div class="feature">
                                <h3><i class="fas fa-history"></i> History</h3>
                                <p>Navigate back and forward through your browsing history.</p>
                            </div>
                            <div class="feature">
                                <h3><i class="fas fa-file"></i> Local Files</h3>
                                <p>View HTML files from the local file system.</p>
                            </div>
                            <div class="feature">
                                <h3><i class="fas fa-search"></i> Search</h3>
                                <p>Search the web directly from the address bar.</p>
                            </div>
                            <div class="feature">
                                <h3><i class="fas fa-download"></i> Downloads</h3>
                                <p>Download and manage files from the web.</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            default:
                container.innerHTML = `
                    <div class="about-page">
                        <h1>About Page</h1>
                        <p>This is an internal browser page.</p>
                    </div>
                `;
        }
    }
    
    renderLocalFile(container, url) {
        const fileName = url.replace('file://', '');
        
        // Try to load file from file system
        if (window.fileSystem) {
            const searchResults = window.fileSystem.searchFiles(fileName);
            if (searchResults.length > 0) {
                const fileContent = window.fileSystem.readFile(searchResults[0].path);
                if (fileContent) {
                    container.innerHTML = `
                        <iframe 
                            srcdoc="${this.escapeHtml(fileContent)}"
                            style="width: 100%; height: 100%; border: none;"
                            sandbox="allow-scripts allow-same-origin">
                        </iframe>
                    `;
                    return;
                }
            }
        }
        
        // File not found
        container.innerHTML = `
            <div class="error-page">
                <h1>File Not Found</h1>
                <p>The file "${fileName}" could not be found.</p>
                <button onclick="history.back()">Go Back</button>
            </div>
        `;
    }
    
    renderWebPage(container, url) {
        // For security reasons, we'll show a placeholder for external URLs
        // In a real implementation, you might use a proxy or iframe with proper sandboxing
        
        container.innerHTML = `
            <div class="web-page-placeholder">
                <div class="placeholder-header">
                    <h2>External Website</h2>
                    <p>URL: ${url}</p>
                </div>
                
                <div class="placeholder-content">
                    <div class="placeholder-info">
                        <i class="fas fa-info-circle"></i>
                        <p>For security reasons, external websites are not directly loaded in this demo browser.</p>
                        <p>In a real implementation, this would load the actual website content.</p>
                    </div>
                    
                    <div class="placeholder-actions">
                        <button class="btn btn-primary" onclick="window.open('${url}', '_blank')">
                            <i class="fas fa-external-link-alt"></i>
                            Open in New Window
                        </button>
                        <button class="btn btn-secondary" onclick="this.closest('.browser').querySelector('#address-input').focus()">
                            <i class="fas fa-edit"></i>
                            Edit URL
                        </button>
                    </div>
                </div>
                
                <div class="sample-content">
                    <h3>Sample Web Content</h3>
                    <p>This is what a web page might look like:</p>
                    <div class="sample-article">
                        <h4>Welcome to the Web</h4>
                        <p>The World Wide Web is an information space where documents and other web resources are identified by URLs, interlinked by hypertext links, and accessible via the Internet.</p>
                        <p>Web browsers are used to access and display web pages, which can contain text, images, videos, and other multimedia content.</p>
                        <ul>
                            <li>HTML provides the structure</li>
                            <li>CSS provides the styling</li>
                            <li>JavaScript provides the interactivity</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    navigate(input) {
        if (!input.trim()) return;
        
        let url = input.trim();
        
        // Determine if it's a URL or search query
        if (this.isValidUrl(url)) {
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://') && 
                !url.startsWith('file://') && !url.startsWith('about:')) {
                url = 'https://' + url;
            }
        } else {
            // Treat as search query
            url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
        
        const activeTab = this.getActiveTab();
        if (activeTab) {
            // Add to history
            activeTab.history = activeTab.history.slice(0, activeTab.historyIndex + 1);
            activeTab.history.push(url);
            activeTab.historyIndex = activeTab.history.length - 1;
            
            // Update tab
            activeTab.url = url;
            activeTab.title = this.getTitleFromUrl(url);
            activeTab.loading = true;
            
            // Update UI
            this.renderTabs();
            this.showLoadingStatus();
            
            // Simulate loading
            setTimeout(() => {
                activeTab.loading = false;
                this.renderTabs();
                this.renderActiveTab();
                this.hideLoadingStatus();
                this.updateNavigationButtons();
            }, 1000);
        }
    }
    
    goBack() {
        const activeTab = this.getActiveTab();
        if (activeTab && activeTab.historyIndex > 0) {
            activeTab.historyIndex--;
            activeTab.url = activeTab.history[activeTab.historyIndex];
            activeTab.title = this.getTitleFromUrl(activeTab.url);
            
            this.renderActiveTab();
            this.updateNavigationButtons();
        }
    }
    
    goForward() {
        const activeTab = this.getActiveTab();
        if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
            activeTab.historyIndex++;
            activeTab.url = activeTab.history[activeTab.historyIndex];
            activeTab.title = this.getTitleFromUrl(activeTab.url);
            
            this.renderActiveTab();
            this.updateNavigationButtons();
        }
    }
    
    refresh() {
        const activeTab = this.getActiveTab();
        if (activeTab) {
            activeTab.loading = true;
            this.renderTabs();
            this.showLoadingStatus();
            
            setTimeout(() => {
                activeTab.loading = false;
                this.renderTabs();
                this.renderActiveTab();
                this.hideLoadingStatus();
            }, 500);
        }
    }
    
    goHome() {
        this.navigate(this.defaultHomePage);
    }
    
    bookmarkCurrentPage() {
        const activeTab = this.getActiveTab();
        if (activeTab && activeTab.url !== 'about:blank') {
            const bookmark = {
                title: activeTab.title,
                url: activeTab.url,
                created: new Date().toISOString()
            };
            
            this.bookmarks.push(bookmark);
            this.saveBookmarks();
            
            // Show confirmation
            this.showStatus('Page bookmarked');
        }
    }
    
    showBookmarks() {
        const activeTab = this.getActiveTab();
        if (activeTab) {
            activeTab.url = 'about:bookmarks';
            activeTab.title = 'Bookmarks';
            
            const container = this.getContentElement().querySelector('#browser-content');
            container.innerHTML = `
                <div class="bookmarks-page">
                    <h1>Bookmarks</h1>
                    <div class="bookmarks-toolbar">
                        <button class="btn btn-primary" id="import-bookmarks">
                            <i class="fas fa-upload"></i>
                            Import
                        </button>
                        <button class="btn btn-secondary" id="export-bookmarks">
                            <i class="fas fa-download"></i>
                            Export
                        </button>
                        <button class="btn btn-secondary" id="clear-bookmarks">
                            <i class="fas fa-trash"></i>
                            Clear All
                        </button>
                    </div>
                    <div class="bookmarks-grid">
                        ${this.renderFullBookmarksList()}
                    </div>
                </div>
            `;
            
            // Add event listeners
            container.querySelector('#clear-bookmarks').addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all bookmarks?')) {
                    this.bookmarks = [];
                    this.saveBookmarks();
                    this.showBookmarks(); // Refresh
                }
            });
            
            this.updateAddressBar();
        }
    }
    
    showDownloads() {
        const activeTab = this.getActiveTab();
        if (activeTab) {
            activeTab.url = 'about:downloads';
            activeTab.title = 'Downloads';
            
            const container = this.getContentElement().querySelector('#browser-content');
            container.innerHTML = `
                <div class="downloads-page">
                    <h1>Downloads</h1>
                    <div class="downloads-list">
                        <div class="download-item">
                            <div class="download-icon">
                                <i class="fas fa-file"></i>
                            </div>
                            <div class="download-info">
                                <div class="download-name">sample-file.txt</div>
                                <div class="download-details">1.2 KB • Downloaded today</div>
                            </div>
                            <div class="download-actions">
                                <button class="btn btn-ghost">
                                    <i class="fas fa-folder-open"></i>
                                </button>
                            </div>
                        </div>
                        <div class="empty-state">
                            <i class="fas fa-download"></i>
                            <p>No downloads yet</p>
                            <p>Files you download will appear here</p>
                        </div>
                    </div>
                </div>
            `;
            
            this.updateAddressBar();
        }
    }
    
    showMenu() {
        const menu = document.createElement('div');
        menu.className = 'browser-menu';
        menu.style.cssText = `
            position: absolute;
            top: 50px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            padding: var(--spacing-xs);
            min-width: 200px;
            z-index: 1000;
        `;
        
        menu.innerHTML = `
            <div class="menu-item" data-action="new-tab">
                <i class="fas fa-plus"></i>
                <span>New Tab</span>
                <span class="shortcut">Ctrl+T</span>
            </div>
            <div class="menu-item" data-action="new-window">
                <i class="fas fa-window-maximize"></i>
                <span>New Window</span>
                <span class="shortcut">Ctrl+N</span>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="bookmarks">
                <i class="fas fa-bookmark"></i>
                <span>Bookmarks</span>
                <span class="shortcut">Ctrl+Shift+O</span>
            </div>
            <div class="menu-item" data-action="history">
                <i class="fas fa-history"></i>
                <span>History</span>
                <span class="shortcut">Ctrl+H</span>
            </div>
            <div class="menu-item" data-action="downloads">
                <i class="fas fa-download"></i>
                <span>Downloads</span>
                <span class="shortcut">Ctrl+J</span>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item" data-action="settings">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </div>
            <div class="menu-item" data-action="about">
                <i class="fas fa-info-circle"></i>
                <span>About Browser</span>
            </div>
        `;
        
        this.getWindowElement().appendChild(menu);
        
        // Handle menu clicks
        menu.addEventListener('click', (e) => {
            const action = e.target.closest('.menu-item')?.getAttribute('data-action');
            if (action) {
                this.handleMenuAction(action);
            }
            menu.remove();
        });
        
        // Remove on outside click
        setTimeout(() => {
            const handleOutsideClick = (e) => {
                if (!e.target.closest('.browser-menu')) {
                    menu.remove();
                    document.removeEventListener('click', handleOutsideClick);
                }
            };
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    }
    
    handleMenuAction(action) {
        switch (action) {
            case 'new-tab':
                this.createNewTab();
                this.renderTabs();
                this.renderActiveTab();
                break;
            case 'new-window':
                if (window.applicationManager) {
                    window.applicationManager.openApplication('browser');
                }
                break;
            case 'bookmarks':
                this.showBookmarks();
                break;
            case 'downloads':
                this.showDownloads();
                break;
            case 'settings':
                this.navigate('about:settings');
                break;
            case 'about':
                this.navigate('about:browser');
                break;
        }
    }
    
    getActiveTab() {
        return this.tabs.find(tab => tab.id === this.activeTabId);
    }
    
    updateNavigationButtons() {
        const content = this.getContentElement();
        const activeTab = this.getActiveTab();
        
        if (activeTab) {
            content.querySelector('#browser-back').disabled = activeTab.historyIndex <= 0;
            content.querySelector('#browser-forward').disabled = activeTab.historyIndex >= activeTab.history.length - 1;
        }
    }
    
    updateAddressBar() {
        const activeTab = this.getActiveTab();
        if (activeTab) {
            const addressInput = this.getContentElement().querySelector('#address-input');
            addressInput.value = activeTab.url;
            
            // Update security icon
            const securityIcon = this.getContentElement().querySelector('#security-icon');
            if (activeTab.url.startsWith('https://')) {
                securityIcon.className = 'fas fa-lock';
                securityIcon.style.color = 'var(--success-green)';
            } else if (activeTab.url.startsWith('http://')) {
                securityIcon.className = 'fas fa-exclamation-triangle';
                securityIcon.style.color = 'var(--warning-orange)';
            } else {
                securityIcon.className = 'fas fa-info-circle';
                securityIcon.style.color = 'var(--text-secondary)';
            }
        }
    }
    
    updateTitle() {
        const activeTab = this.getActiveTab();
        if (activeTab) {
            super.updateTitle(`${activeTab.title} - Browser`);
        }
    }
    
    showLoadingStatus() {
        const status = this.getContentElement().querySelector('#browser-status');
        status.style.display = 'flex';
        status.querySelector('#status-text').textContent = 'Loading...';
        
        // Animate progress bar
        const progressFill = status.querySelector('#progress-fill');
        progressFill.style.width = '0%';
        progressFill.style.transition = 'width 1s ease-out';
        
        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 100);
    }
    
    hideLoadingStatus() {
        const status = this.getContentElement().querySelector('#browser-status');
        status.style.display = 'none';
    }
    
    showStatus(message) {
        const status = this.getContentElement().querySelector('#browser-status');
        status.style.display = 'flex';
        status.querySelector('#status-text').textContent = message;
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 2000);
    }
    
    isValidUrl(string) {
        try {
            new URL(string.startsWith('http') ? string : 'https://' + string);
            return true;
        } catch {
            return string.includes('.') && !string.includes(' ');
        }
    }
    
    getTitleFromUrl(url) {
        if (url === 'about:blank') return 'New Tab';
        if (url.startsWith('about:')) return url.replace('about:', '').charAt(0).toUpperCase() + url.slice(7);
        if (url.startsWith('file://')) return url.replace('file://', '');
        
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    }
    
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    loadBookmarks() {
        try {
            const saved = localStorage.getItem('browser-bookmarks');
            return saved ? JSON.parse(saved) : [
                { title: 'Google', url: 'https://www.google.com', created: new Date().toISOString() },
                { title: 'GitHub', url: 'https://www.github.com', created: new Date().toISOString() }
            ];
        } catch {
            return [];
        }
    }
    
    saveBookmarks() {
        try {
            localStorage.setItem('browser-bookmarks', JSON.stringify(this.bookmarks));
        } catch (error) {
            console.error('Failed to save bookmarks:', error);
        }
    }
    
    renderBookmarksList() {
        if (this.bookmarks.length === 0) {
            return '<p>No bookmarks yet</p>';
        }
        
        return this.bookmarks.slice(0, 5).map(bookmark => `
            <div class="bookmark-item" data-url="${bookmark.url}">
                <i class="fas fa-bookmark"></i>
                <span>${bookmark.title}</span>
            </div>
        `).join('');
    }
    
    renderFullBookmarksList() {
        if (this.bookmarks.length === 0) {
            return '<div class="empty-state"><p>No bookmarks yet</p></div>';
        }
        
        return this.bookmarks.map(bookmark => `
            <div class="bookmark-card" data-url="${bookmark.url}">
                <div class="bookmark-icon">
                    <i class="fas fa-bookmark"></i>
                </div>
                <div class="bookmark-info">
                    <div class="bookmark-title">${bookmark.title}</div>
                    <div class="bookmark-url">${bookmark.url}</div>
                </div>
                <div class="bookmark-actions">
                    <button class="btn btn-ghost bookmark-delete" data-url="${bookmark.url}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    cleanup() {
        super.cleanup();
        this.saveBookmarks();
    }
}

// Register the application
window.BrowserApp = BrowserApp;