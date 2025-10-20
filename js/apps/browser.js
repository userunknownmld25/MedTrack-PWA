// Browser Application
class BrowserApp {
    constructor() {
        this.name = 'Browser';
        this.icon = '🌐';
        this.currentUrl = 'https://www.google.com';
        this.history = [];
        this.bookmarks = [];
        this.tabs = [];
        this.activeTab = 0;
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="browser-address-bar">
                    <button class="browser-nav-button" id="back-btn" disabled>←</button>
                    <button class="browser-nav-button" id="forward-btn" disabled>→</button>
                    <button class="browser-nav-button" id="refresh-btn">↻</button>
                    <input type="text" class="browser-address-input" id="address-input" value="${this.currentUrl}">
                    <button class="browser-nav-button" id="bookmark-btn">★</button>
                    <button class="browser-nav-button" id="new-tab-btn">+</button>
                </div>
                <div class="browser-tabs">
                    <div class="browser-tab active" data-tab="0">
                        <span class="tab-title">New Tab</span>
                        <button class="tab-close">×</button>
                    </div>
                </div>
                <iframe class="browser-content" id="browser-frame" src="${this.currentUrl}"></iframe>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.setupEventListeners();
        this.addTab('New Tab', 'https://www.google.com');
    }

    setupEventListeners() {
        const addressInput = this.container.querySelector('#address-input');
        const backBtn = this.container.querySelector('#back-btn');
        const forwardBtn = this.container.querySelector('#forward-btn');
        const refreshBtn = this.container.querySelector('#refresh-btn');
        const bookmarkBtn = this.container.querySelector('#bookmark-btn');
        const newTabBtn = this.container.querySelector('#new-tab-btn');
        const browserFrame = this.container.querySelector('#browser-frame');

        // Address bar
        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigateTo(addressInput.value);
            }
        });

        // Navigation buttons
        backBtn.addEventListener('click', () => this.goBack());
        forwardBtn.addEventListener('click', () => this.goForward());
        refreshBtn.addEventListener('click', () => this.refresh());
        bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
        newTabBtn.addEventListener('click', () => this.addTab('New Tab', 'https://www.google.com'));

        // Tab management
        this.setupTabListeners();
    }

    setupTabListeners() {
        const tabsContainer = this.container.querySelector('.browser-tabs');
        
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) {
                const tabIndex = parseInt(e.target.closest('.browser-tab').dataset.tab);
                this.closeTab(tabIndex);
            } else if (e.target.closest('.browser-tab')) {
                const tabIndex = parseInt(e.target.closest('.browser-tab').dataset.tab);
                this.switchTab(tabIndex);
            }
        });
    }

    navigateTo(url) {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.')) {
                url = 'https://' + url;
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }

        this.currentUrl = url;
        this.container.querySelector('#address-input').value = url;
        
        // Update iframe
        const iframe = this.container.querySelector('#browser-frame');
        iframe.src = url;
        
        // Add to history
        this.history.push({
            url: url,
            title: 'Page',
            timestamp: Date.now()
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    goBack() {
        if (this.history.length > 1) {
            this.history.pop(); // Remove current
            const previous = this.history[this.history.length - 1];
            this.navigateTo(previous.url);
        }
    }

    goForward() {
        // Simple implementation - in a real browser, this would use a forward history
        console.log('Forward navigation not implemented');
    }

    refresh() {
        const iframe = this.container.querySelector('#browser-frame');
        iframe.src = iframe.src;
    }

    toggleBookmark() {
        const url = this.currentUrl;
        const title = this.getPageTitle();
        
        const existingBookmark = this.bookmarks.find(b => b.url === url);
        if (existingBookmark) {
            this.bookmarks = this.bookmarks.filter(b => b.url !== url);
            this.container.querySelector('#bookmark-btn').textContent = '☆';
        } else {
            this.bookmarks.push({
                url: url,
                title: title,
                timestamp: Date.now()
            });
            this.container.querySelector('#bookmark-btn').textContent = '★';
        }
    }

    addTab(title, url) {
        const tabId = this.tabs.length;
        this.tabs.push({
            id: tabId,
            title: title,
            url: url,
            active: false
        });

        // Create tab element
        const tabsContainer = this.container.querySelector('.browser-tabs');
        const tabElement = document.createElement('div');
        tabElement.className = 'browser-tab';
        tabElement.dataset.tab = tabId;
        tabElement.innerHTML = `
            <span class="tab-title">${title}</span>
            <button class="tab-close">×</button>
        `;
        
        tabsContainer.appendChild(tabElement);
        
        // Switch to new tab
        this.switchTab(tabId);
    }

    switchTab(tabId) {
        // Update active tab
        this.container.querySelectorAll('.browser-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = this.container.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        this.activeTab = tabId;
        
        // Update iframe
        const tab = this.tabs[tabId];
        if (tab) {
            const iframe = this.container.querySelector('#browser-frame');
            iframe.src = tab.url;
            this.currentUrl = tab.url;
            this.container.querySelector('#address-input').value = tab.url;
        }
    }

    closeTab(tabId) {
        if (this.tabs.length <= 1) return; // Don't close the last tab
        
        // Remove tab from array
        this.tabs = this.tabs.filter(tab => tab.id !== tabId);
        
        // Remove tab element
        const tabElement = this.container.querySelector(`[data-tab="${tabId}"]`);
        if (tabElement) {
            tabElement.remove();
        }
        
        // Switch to another tab
        if (this.activeTab === tabId) {
            const newActiveTab = this.tabs[0];
            if (newActiveTab) {
                this.switchTab(newActiveTab.id);
            }
        }
    }

    updateNavigationButtons() {
        const backBtn = this.container.querySelector('#back-btn');
        const forwardBtn = this.container.querySelector('#forward-btn');
        
        backBtn.disabled = this.history.length <= 1;
        forwardBtn.disabled = true; // Simplified implementation
    }

    getPageTitle() {
        // In a real implementation, this would extract the title from the iframe
        return 'Web Page';
    }

    // Bookmark management
    getBookmarks() {
        return this.bookmarks;
    }

    addBookmark(url, title) {
        this.bookmarks.push({
            url: url,
            title: title,
            timestamp: Date.now()
        });
    }

    removeBookmark(url) {
        this.bookmarks = this.bookmarks.filter(b => b.url !== url);
    }

    // History management
    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        this.updateNavigationButtons();
    }

    // Download management
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'download';
        link.click();
    }

    // Developer tools (basic)
    openDevTools() {
        console.log('Developer tools would open here');
        // In a real implementation, this would open a developer tools panel
    }

    // Print functionality
    print() {
        const iframe = this.container.querySelector('#browser-frame');
        iframe.contentWindow.print();
    }

    // Fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Settings
    openSettings() {
        console.log('Browser settings would open here');
    }

    // Cleanup
    cleanup() {
        // Clean up any resources
        console.log('Browser cleanup');
    }
}