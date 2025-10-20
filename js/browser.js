// Advanced Web Browser System
class WebBrowser {
    constructor() {
        this.tabs = [];
        this.activeTab = null;
        this.history = [];
        this.bookmarks = [];
        this.downloads = [];
        this.currentUrl = 'https://www.google.com';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBookmarks();
        this.createNewTab();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeBrowser();
        });
    }

    initializeBrowser() {
        const browser = document.querySelector('.browser-content');
        if (!browser) return;

        // Setup navigation events
        this.setupNavigationEvents();
        
        // Setup tab events
        this.setupTabEvents();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupNavigationEvents() {
        const toolbar = document.querySelector('.browser-toolbar');
        if (!toolbar) return;

        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-button');
            if (button) {
                const action = button.dataset.action;
                this.handleNavigation(action);
            }
        });

        const addressBar = document.querySelector('.browser-address');
        if (addressBar) {
            addressBar.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.navigateToAddress(addressBar.value);
                }
            });
        }
    }

    setupTabEvents() {
        const tabContainer = document.querySelector('.browser-tabs');
        if (!tabContainer) return;

        tabContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.browser-tab');
            if (tab) {
                const tabId = tab.dataset.tabId;
                this.switchToTab(tabId);
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isBrowserActive()) return;

            if (e.ctrlKey) {
                switch (e.key) {
                    case 't':
                        e.preventDefault();
                        this.createNewTab();
                        break;
                    case 'w':
                        e.preventDefault();
                        this.closeCurrentTab();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refresh();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.focusAddressBar();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.bookmarkCurrentPage();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showHistory();
                        break;
                    case 'j':
                        e.preventDefault();
                        this.showDownloads();
                        break;
                }
            }

            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.goBack();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.goForward();
                        break;
                }
            }
        });
    }

    isBrowserActive() {
        const activeWindow = document.querySelector('.window.focused');
        return activeWindow && activeWindow.querySelector('.browser-content');
    }

    createNewTab(url = 'https://www.google.com') {
        const tabId = 'tab-' + Date.now();
        const tab = {
            id: tabId,
            url: url,
            title: 'New Tab',
            favicon: '🌐',
            history: [url],
            historyIndex: 0
        };
        
        this.tabs.push(tab);
        this.activeTab = tab;
        
        this.updateTabDisplay();
        this.navigateToAddress(url);
    }

    switchToTab(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            this.activeTab = tab;
            this.updateTabDisplay();
            this.updateAddressBar();
            this.updateIframe();
        }
    }

    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;
        
        this.tabs.splice(tabIndex, 1);
        
        if (this.activeTab && this.activeTab.id === tabId) {
            if (this.tabs.length > 0) {
                this.activeTab = this.tabs[Math.min(tabIndex, this.tabs.length - 1)];
            } else {
                this.activeTab = null;
            }
        }
        
        this.updateTabDisplay();
        
        if (this.tabs.length === 0) {
            this.createNewTab();
        }
    }

    updateTabDisplay() {
        const tabContainer = document.querySelector('.browser-tabs');
        if (!tabContainer) return;

        const html = this.tabs.map(tab => `
            <div class="browser-tab ${tab.id === this.activeTab?.id ? 'active' : ''}" data-tab-id="${tab.id}">
                <div class="tab-favicon">${tab.favicon}</div>
                <div class="tab-title">${tab.title}</div>
                <div class="tab-close" data-tab-id="${tab.id}">×</div>
            </div>
        `).join('');
        
        tabContainer.innerHTML = html;
    }

    handleNavigation(action) {
        switch (action) {
            case 'back':
                this.goBack();
                break;
            case 'forward':
                this.goForward();
                break;
            case 'refresh':
                this.refresh();
                break;
            case 'home':
                this.navigateToAddress('https://www.google.com');
                break;
            case 'go':
                const addressBar = document.querySelector('.browser-address');
                this.navigateToAddress(addressBar.value);
                break;
        }
    }

    navigateToAddress(url) {
        if (!this.activeTab) return;
        
        // Normalize URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }
        
        this.activeTab.url = url;
        this.activeTab.title = this.extractTitleFromUrl(url);
        
        // Add to history
        this.addToHistory(url);
        
        // Update UI
        this.updateAddressBar();
        this.updateIframe();
        this.updateTabDisplay();
    }

    addToHistory(url) {
        if (!this.activeTab) return;
        
        const history = this.activeTab.history;
        const index = this.activeTab.historyIndex;
        
        // Remove any history after current index
        history.splice(index + 1);
        
        // Add new URL
        history.push(url);
        this.activeTab.historyIndex = history.length - 1;
    }

    goBack() {
        if (!this.activeTab) return;
        
        if (this.activeTab.historyIndex > 0) {
            this.activeTab.historyIndex--;
            const url = this.activeTab.history[this.activeTab.historyIndex];
            this.activeTab.url = url;
            this.updateAddressBar();
            this.updateIframe();
        }
    }

    goForward() {
        if (!this.activeTab) return;
        
        if (this.activeTab.historyIndex < this.activeTab.history.length - 1) {
            this.activeTab.historyIndex++;
            const url = this.activeTab.history[this.activeTab.historyIndex];
            this.activeTab.url = url;
            this.updateAddressBar();
            this.updateIframe();
        }
    }

    refresh() {
        if (!this.activeTab) return;
        
        const iframe = document.querySelector('.browser-view');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }

    updateAddressBar() {
        const addressBar = document.querySelector('.browser-address');
        if (addressBar && this.activeTab) {
            addressBar.value = this.activeTab.url;
        }
    }

    updateIframe() {
        const iframe = document.querySelector('.browser-view');
        if (iframe && this.activeTab) {
            iframe.src = this.activeTab.url;
        }
    }

    extractTitleFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            
            // Remove www. prefix
            return hostname.replace(/^www\./, '');
        } catch (e) {
            return 'New Tab';
        }
    }

    focusAddressBar() {
        const addressBar = document.querySelector('.browser-address');
        if (addressBar) {
            addressBar.focus();
            addressBar.select();
        }
    }

    bookmarkCurrentPage() {
        if (!this.activeTab) return;
        
        const bookmark = {
            id: 'bookmark-' + Date.now(),
            url: this.activeTab.url,
            title: this.activeTab.title,
            favicon: this.activeTab.favicon,
            date: new Date().toISOString()
        };
        
        this.bookmarks.push(bookmark);
        this.saveBookmarks();
        this.showNotification('Browser', 'Page bookmarked!');
    }

    loadBookmarks() {
        const saved = localStorage.getItem('browser-bookmarks');
        if (saved) {
            this.bookmarks = JSON.parse(saved);
        }
    }

    saveBookmarks() {
        localStorage.setItem('browser-bookmarks', JSON.stringify(this.bookmarks));
    }

    showHistory() {
        const history = this.tabs.flatMap(tab => 
            tab.history.map(url => ({
                url: url,
                title: this.extractTitleFromUrl(url),
                date: new Date().toISOString()
            }))
        );
        
        this.showNotification('Browser', `History: ${history.length} pages`);
    }

    showDownloads() {
        this.showNotification('Browser', `Downloads: ${this.downloads.length} files`);
    }

    closeCurrentTab() {
        if (this.activeTab) {
            this.closeTab(this.activeTab.id);
        }
    }

    showNotification(title, message) {
        if (window.webOS) {
            window.webOS.showNotification(title, message);
        } else {
            console.log(`${title}: ${message}`);
        }
    }

    // Search functionality
    search(query) {
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        this.navigateToAddress(searchUrl);
    }

    // Download functionality
    download(url, filename) {
        const download = {
            id: 'download-' + Date.now(),
            url: url,
            filename: filename,
            status: 'downloading',
            progress: 0,
            date: new Date().toISOString()
        };
        
        this.downloads.push(download);
        
        // Simulate download
        setTimeout(() => {
            download.status = 'completed';
            download.progress = 100;
            this.showNotification('Browser', `Downloaded: ${filename}`);
        }, 2000);
    }

    // Developer tools
    openDevTools() {
        this.showNotification('Browser', 'Developer tools opened');
    }

    // Privacy features
    clearHistory() {
        this.tabs.forEach(tab => {
            tab.history = [tab.url];
            tab.historyIndex = 0;
        });
        this.showNotification('Browser', 'History cleared');
    }

    clearCookies() {
        this.showNotification('Browser', 'Cookies cleared');
    }

    clearCache() {
        this.showNotification('Browser', 'Cache cleared');
    }

    // Security features
    checkSecurity(url) {
        if (url.startsWith('https://')) {
            return 'secure';
        } else if (url.startsWith('http://')) {
            return 'insecure';
        } else {
            return 'unknown';
        }
    }

    // Accessibility features
    zoomIn() {
        const iframe = document.querySelector('.browser-view');
        if (iframe) {
            const currentZoom = parseFloat(iframe.style.zoom) || 1;
            iframe.style.zoom = Math.min(currentZoom + 0.1, 3);
        }
    }

    zoomOut() {
        const iframe = document.querySelector('.browser-view');
        if (iframe) {
            const currentZoom = parseFloat(iframe.style.zoom) || 1;
            iframe.style.zoom = Math.max(currentZoom - 0.1, 0.5);
        }
    }

    resetZoom() {
        const iframe = document.querySelector('.browser-view');
        if (iframe) {
            iframe.style.zoom = 1;
        }
    }

    // Fullscreen mode
    toggleFullscreen() {
        const iframe = document.querySelector('.browser-view');
        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
            }
        }
    }

    // Print functionality
    print() {
        const iframe = document.querySelector('.browser-view');
        if (iframe) {
            iframe.contentWindow.print();
        }
    }

    // Save page
    savePage() {
        if (!this.activeTab) return;
        
        const filename = this.activeTab.title + '.html';
        this.download(this.activeTab.url, filename);
    }

    // Page source
    viewSource() {
        if (!this.activeTab) return;
        
        const sourceUrl = 'view-source:' + this.activeTab.url;
        this.navigateToAddress(sourceUrl);
    }

    // Find in page
    findInPage() {
        const query = prompt('Find in page:');
        if (query) {
            this.showNotification('Browser', `Searching for: ${query}`);
        }
    }

    // Page info
    showPageInfo() {
        if (!this.activeTab) return;
        
        const info = `
            URL: ${this.activeTab.url}
            Title: ${this.activeTab.title}
            Security: ${this.checkSecurity(this.activeTab.url)}
            History: ${this.activeTab.history.length} pages
        `;
        
        this.showNotification('Browser', info);
    }
}

// Initialize browser
window.webBrowser = new WebBrowser();