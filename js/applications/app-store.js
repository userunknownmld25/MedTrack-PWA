// App Store Application for Windows 11 Web OS

class AppStoreApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 900;
        this.defaultHeight = 700;
        this.minWidth = 600;
        this.minHeight = 500;
        
        this.currentView = 'featured';
        this.installedApps = this.loadInstalledApps();
        this.downloadQueue = [];
        
        this.featuredApps = [
            {
                id: 'vscode',
                name: 'Visual Studio Code',
                developer: 'Microsoft',
                category: 'Development',
                rating: 4.8,
                downloads: '50M+',
                size: '85 MB',
                description: 'Lightweight but powerful source code editor with built-in support for JavaScript, TypeScript and Node.js.',
                features: ['IntelliSense', 'Debugging', 'Git integration', 'Extensions'],
                screenshots: ['vscode1.jpg', 'vscode2.jpg'],
                icon: 'fab fa-microsoft',
                price: 'Free',
                url: 'https://code.visualstudio.com/'
            },
            {
                id: 'pycharm',
                name: 'PyCharm Community',
                developer: 'JetBrains',
                category: 'Development',
                rating: 4.6,
                downloads: '10M+',
                size: '250 MB',
                description: 'Python IDE for Professional Developers. Intelligent Python assistance and comprehensive development tools.',
                features: ['Smart code completion', 'Debugging', 'Testing', 'Version control'],
                screenshots: ['pycharm1.jpg', 'pycharm2.jpg'],
                icon: 'fab fa-python',
                price: 'Free',
                url: 'https://www.jetbrains.com/pycharm/'
            },
            {
                id: 'python',
                name: 'Python 3.11',
                developer: 'Python Software Foundation',
                category: 'Development',
                rating: 4.9,
                downloads: '100M+',
                size: '30 MB',
                description: 'Python is a programming language that lets you work quickly and integrate systems more effectively.',
                features: ['Easy to learn', 'Powerful libraries', 'Cross-platform', 'Open source'],
                screenshots: ['python1.jpg', 'python2.jpg'],
                icon: 'fab fa-python',
                price: 'Free',
                url: 'https://www.python.org/'
            },
            {
                id: 'nodejs',
                name: 'Node.js',
                developer: 'Node.js Foundation',
                category: 'Development',
                rating: 4.7,
                downloads: '80M+',
                size: '40 MB',
                description: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
                features: ['Fast execution', 'NPM package manager', 'Event-driven', 'Non-blocking I/O'],
                screenshots: ['nodejs1.jpg', 'nodejs2.jpg'],
                icon: 'fab fa-node-js',
                price: 'Free',
                url: 'https://nodejs.org/'
            },
            {
                id: 'git',
                name: 'Git for Windows',
                developer: 'Git SCM',
                category: 'Development',
                rating: 4.8,
                downloads: '70M+',
                size: '45 MB',
                description: 'Git is a free and open source distributed version control system.',
                features: ['Version control', 'Branching', 'Merging', 'Distributed'],
                screenshots: ['git1.jpg', 'git2.jpg'],
                icon: 'fab fa-git-alt',
                price: 'Free',
                url: 'https://git-scm.com/'
            },
            {
                id: 'chrome',
                name: 'Google Chrome',
                developer: 'Google',
                category: 'Internet',
                rating: 4.5,
                downloads: '5B+',
                size: '90 MB',
                description: 'Fast, secure, and free web browser built for the modern web.',
                features: ['Fast browsing', 'Sync across devices', 'Extensions', 'Security'],
                screenshots: ['chrome1.jpg', 'chrome2.jpg'],
                icon: 'fab fa-chrome',
                price: 'Free',
                url: 'https://www.google.com/chrome/'
            },
            {
                id: 'discord',
                name: 'Discord',
                developer: 'Discord Inc.',
                category: 'Communication',
                rating: 4.4,
                downloads: '500M+',
                size: '120 MB',
                description: 'Discord is the easiest way to talk over voice, video, and text.',
                features: ['Voice chat', 'Video calls', 'Screen sharing', 'Communities'],
                screenshots: ['discord1.jpg', 'discord2.jpg'],
                icon: 'fab fa-discord',
                price: 'Free',
                url: 'https://discord.com/'
            },
            {
                id: 'spotify',
                name: 'Spotify',
                developer: 'Spotify AB',
                category: 'Music',
                rating: 4.3,
                downloads: '1B+',
                size: '100 MB',
                description: 'Spotify is a digital music service that gives you access to millions of songs.',
                features: ['Music streaming', 'Playlists', 'Podcasts', 'Offline mode'],
                screenshots: ['spotify1.jpg', 'spotify2.jpg'],
                icon: 'fab fa-spotify',
                price: 'Free / Premium',
                url: 'https://www.spotify.com/'
            }
        ];
        
        this.categories = {
            'all': 'All Apps',
            'development': 'Development',
            'internet': 'Internet',
            'communication': 'Communication',
            'music': 'Music & Audio',
            'games': 'Games',
            'productivity': 'Productivity',
            'graphics': 'Graphics & Design',
            'utilities': 'Utilities'
        };
    }
    
    render() {
        return `
            <div class="app-store">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button ${this.currentView === 'featured' ? 'active' : ''}" id="store-featured" title="Featured">
                            <i class="fas fa-star"></i>
                            <span>Featured</span>
                        </button>
                        <button class="app-button ${this.currentView === 'categories' ? 'active' : ''}" id="store-categories" title="Categories">
                            <i class="fas fa-th-large"></i>
                            <span>Categories</span>
                        </button>
                        <button class="app-button ${this.currentView === 'installed' ? 'active' : ''}" id="store-installed" title="Installed">
                            <i class="fas fa-download"></i>
                            <span>Installed</span>
                        </button>
                        <button class="app-button ${this.currentView === 'updates' ? 'active' : ''}" id="store-updates" title="Updates">
                            <i class="fas fa-sync-alt"></i>
                            <span>Updates</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <select class="app-select" id="store-sort">
                            <option value="featured">Featured</option>
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest</option>
                            <option value="name">Name A-Z</option>
                        </select>
                        <select class="app-select" id="store-filter">
                            <option value="all">All Categories</option>
                            <option value="development">Development</option>
                            <option value="internet">Internet</option>
                            <option value="communication">Communication</option>
                            <option value="music">Music & Audio</option>
                            <option value="games">Games</option>
                            <option value="productivity">Productivity</option>
                        </select>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <input type="text" class="app-input" id="store-search" placeholder="Search apps..." style="width: 250px;">
                        <button class="app-button" id="store-search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="app-store-content" id="store-content">
                    <!-- Content will be populated here -->
                </div>
                
                <div class="app-store-status">
                    <div class="status-left">
                        <span id="store-status-text">Browse and install applications</span>
                    </div>
                    <div class="status-right">
                        <span id="store-app-count">${this.featuredApps.length} apps available</span>
                        <span class="status-separator">|</span>
                        <span id="store-installed-count">${this.installedApps.length} installed</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Navigation buttons
        content.querySelector('#store-featured').addEventListener('click', () => this.showFeatured());
        content.querySelector('#store-categories').addEventListener('click', () => this.showCategories());
        content.querySelector('#store-installed').addEventListener('click', () => this.showInstalled());
        content.querySelector('#store-updates').addEventListener('click', () => this.showUpdates());
        
        // Sort and filter
        content.querySelector('#store-sort').addEventListener('change', () => this.applyFilters());
        content.querySelector('#store-filter').addEventListener('change', () => this.applyFilters());
        
        // Search
        const searchInput = content.querySelector('#store-search');
        searchInput.addEventListener('input', () => this.applyFilters());
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.applyFilters();
            }
        });
        
        content.querySelector('#store-search-btn').addEventListener('click', () => this.applyFilters());
    }
    
    loadData() {
        this.showFeatured();
    }
    
    showFeatured() {
        this.currentView = 'featured';
        this.updateNavigationButtons();
        
        const content = this.getContentElement().querySelector('#store-content');
        
        content.innerHTML = `
            <div class="store-section">
                <div class="section-header">
                    <h2>Featured Applications</h2>
                    <p>Discover popular and recommended applications for your system</p>
                </div>
                
                <div class="featured-banner">
                    <div class="banner-content">
                        <h3>Developer Tools</h3>
                        <p>Get the best development tools including Visual Studio Code, Python, and more</p>
                        <button class="btn btn-primary">Explore Development Tools</button>
                    </div>
                    <div class="banner-image">
                        <i class="fas fa-code" style="font-size: 4rem; color: var(--primary-blue);"></i>
                    </div>
                </div>
                
                <div class="apps-grid" id="apps-grid">
                    ${this.renderAppsGrid(this.featuredApps)}
                </div>
            </div>
        `;
        
        this.setupAppCardListeners();
        this.updateStatus('Browse featured applications');
    }
    
    showCategories() {
        this.currentView = 'categories';
        this.updateNavigationButtons();
        
        const content = this.getContentElement().querySelector('#store-content');
        
        const categoryCounts = {};
        this.featuredApps.forEach(app => {
            const category = app.category.toLowerCase();
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        content.innerHTML = `
            <div class="store-section">
                <div class="section-header">
                    <h2>App Categories</h2>
                    <p>Browse applications by category</p>
                </div>
                
                <div class="categories-grid">
                    ${Object.entries(this.categories).filter(([id]) => id !== 'all').map(([id, name]) => `
                        <div class="category-card" data-category="${id}">
                            <div class="category-icon">
                                <i class="${this.getCategoryIcon(id)}"></i>
                            </div>
                            <div class="category-info">
                                <h3>${name}</h3>
                                <p>${categoryCounts[id] || 0} apps</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add click handlers for categories
        content.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.showCategoryApps(category);
            });
        });
        
        this.updateStatus('Browse applications by category');
    }
    
    showCategoryApps(category) {
        const categoryName = this.categories[category] || category;
        const apps = this.featuredApps.filter(app => app.category.toLowerCase() === category);
        
        const content = this.getContentElement().querySelector('#store-content');
        
        content.innerHTML = `
            <div class="store-section">
                <div class="section-header">
                    <button class="btn btn-ghost" id="back-to-categories">
                        <i class="fas fa-arrow-left"></i> Back to Categories
                    </button>
                    <h2>${categoryName}</h2>
                    <p>${apps.length} applications in this category</p>
                </div>
                
                <div class="apps-grid" id="apps-grid">
                    ${this.renderAppsGrid(apps)}
                </div>
            </div>
        `;
        
        content.querySelector('#back-to-categories').addEventListener('click', () => this.showCategories());
        this.setupAppCardListeners();
        this.updateStatus(`Browsing ${categoryName} applications`);
    }
    
    showInstalled() {
        this.currentView = 'installed';
        this.updateNavigationButtons();
        
        const content = this.getContentElement().querySelector('#store-content');
        
        if (this.installedApps.length === 0) {
            content.innerHTML = `
                <div class="store-section">
                    <div class="section-header">
                        <h2>Installed Applications</h2>
                        <p>Applications you have installed will appear here</p>
                    </div>
                    
                    <div class="empty-state">
                        <i class="fas fa-download"></i>
                        <h3>No applications installed</h3>
                        <p>Browse the store to find and install applications</p>
                        <button class="btn btn-primary" onclick="this.closest('.app-store').querySelector('#store-featured').click()">
                            Browse Featured Apps
                        </button>
                    </div>
                </div>
            `;
        } else {
            const installedAppDetails = this.installedApps.map(appId => 
                this.featuredApps.find(app => app.id === appId)
            ).filter(Boolean);
            
            content.innerHTML = `
                <div class="store-section">
                    <div class="section-header">
                        <h2>Installed Applications</h2>
                        <p>${this.installedApps.length} applications installed</p>
                    </div>
                    
                    <div class="installed-apps">
                        ${installedAppDetails.map(app => `
                            <div class="installed-app-item">
                                <div class="app-icon">
                                    <i class="${app.icon}"></i>
                                </div>
                                <div class="app-info">
                                    <h4>${app.name}</h4>
                                    <p>${app.developer}</p>
                                    <div class="app-meta">
                                        <span>Installed</span>
                                        <span>•</span>
                                        <span>${app.size}</span>
                                    </div>
                                </div>
                                <div class="app-actions">
                                    <button class="btn btn-primary" onclick="this.openApp('${app.id}')">Open</button>
                                    <button class="btn btn-secondary" onclick="this.uninstallApp('${app.id}')">Uninstall</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        this.updateStatus(`${this.installedApps.length} applications installed`);
    }
    
    showUpdates() {
        this.currentView = 'updates';
        this.updateNavigationButtons();
        
        const content = this.getContentElement().querySelector('#store-content');
        
        content.innerHTML = `
            <div class="store-section">
                <div class="section-header">
                    <h2>App Updates</h2>
                    <p>Keep your applications up to date</p>
                </div>
                
                <div class="updates-status">
                    <div class="status-card">
                        <i class="fas fa-check-circle" style="color: var(--success-green);"></i>
                        <div>
                            <h4>All apps are up to date</h4>
                            <p>Last checked: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                
                <div class="update-settings">
                    <h3>Update Settings</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" checked> Automatically download updates
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" checked> Notify me about available updates
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox"> Update apps over metered connections
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        this.updateStatus('All applications are up to date');
    }
    
    renderAppsGrid(apps) {
        return apps.map(app => `
            <div class="app-store-item" data-app-id="${app.id}">
                <div class="app-store-item-icon">
                    <i class="${app.icon}"></i>
                </div>
                <div class="app-store-item-content">
                    <div class="app-header">
                        <h4 class="app-store-item-name">${app.name}</h4>
                        <div class="app-rating">
                            ${this.renderStars(app.rating)}
                            <span class="rating-text">${app.rating}</span>
                        </div>
                    </div>
                    <div class="app-developer">${app.developer}</div>
                    <div class="app-store-item-description">${app.description}</div>
                    <div class="app-meta">
                        <span class="app-category">${app.category}</span>
                        <span class="app-size">${app.size}</span>
                        <span class="app-downloads">${app.downloads}</span>
                    </div>
                    <div class="app-price">${app.price}</div>
                    <div class="app-actions">
                        ${this.installedApps.includes(app.id) ? 
                            `<button class="btn btn-success" disabled>
                                <i class="fas fa-check"></i> Installed
                            </button>` :
                            `<button class="btn btn-primary install-btn" data-app-id="${app.id}">
                                <i class="fas fa-download"></i> Install
                            </button>`
                        }
                        <button class="btn btn-ghost details-btn" data-app-id="${app.id}">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    setupAppCardListeners() {
        const content = this.getContentElement();
        
        // Install buttons
        content.querySelectorAll('.install-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const appId = btn.getAttribute('data-app-id');
                this.installApp(appId);
            });
        });
        
        // Details buttons
        content.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const appId = btn.getAttribute('data-app-id');
                this.showAppDetails(appId);
            });
        });
        
        // App cards
        content.querySelectorAll('.app-store-item').forEach(card => {
            card.addEventListener('click', () => {
                const appId = card.getAttribute('data-app-id');
                this.showAppDetails(appId);
            });
        });
    }
    
    installApp(appId) {
        const app = this.featuredApps.find(a => a.id === appId);
        if (!app) return;
        
        // Show installation dialog
        const dialog = document.createElement('div');
        dialog.className = 'install-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            padding: var(--spacing-lg);
        `;
        
        dialog.innerHTML = `
            <div class="install-dialog-content">
                <div class="install-app-info">
                    <div class="install-app-icon">
                        <i class="${app.icon}"></i>
                    </div>
                    <div>
                        <h3>${app.name}</h3>
                        <p>${app.developer}</p>
                        <div class="install-details">
                            <div>Size: ${app.size}</div>
                            <div>Price: ${app.price}</div>
                        </div>
                    </div>
                </div>
                
                <div class="install-permissions">
                    <h4>This app will be able to:</h4>
                    <ul>
                        <li>Access the internet</li>
                        <li>Read and write files</li>
                        <li>Run in the background</li>
                    </ul>
                </div>
                
                <div class="install-actions">
                    <button class="btn btn-secondary" id="cancel-install">Cancel</button>
                    <button class="btn btn-primary" id="confirm-install">Install</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        dialog.querySelector('#cancel-install').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('#confirm-install').addEventListener('click', () => {
            dialog.remove();
            this.performInstallation(app);
        });
    }
    
    performInstallation(app) {
        // Show installation progress
        const progressDialog = document.createElement('div');
        progressDialog.className = 'install-progress-dialog';
        progressDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            padding: var(--spacing-lg);
        `;
        
        progressDialog.innerHTML = `
            <div class="install-progress-content">
                <h3>Installing ${app.name}</h3>
                <div class="progress-bar" style="
                    width: 100%;
                    height: 8px;
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                    overflow: hidden;
                    margin: var(--spacing-md) 0;
                ">
                    <div class="progress-fill" style="
                        height: 100%;
                        background: var(--primary-blue);
                        width: 0%;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div class="progress-text">Downloading...</div>
            </div>
        `;
        
        document.body.appendChild(progressDialog);
        
        const progressFill = progressDialog.querySelector('.progress-fill');
        const progressText = progressDialog.querySelector('.progress-text');
        
        // Simulate installation progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            
            if (progress < 30) {
                progressText.textContent = 'Downloading...';
            } else if (progress < 70) {
                progressText.textContent = 'Installing...';
            } else if (progress < 95) {
                progressText.textContent = 'Configuring...';
            } else {
                progressText.textContent = 'Finishing...';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    progressDialog.remove();
                    this.completeInstallation(app);
                }, 500);
            }
        }, 200);
    }
    
    completeInstallation(app) {
        // Add to installed apps
        this.installedApps.push(app.id);
        this.saveInstalledApps();
        
        // Show success notification
        if (window.taskbar) {
            window.taskbar.addNotification(
                'Installation Complete',
                `${app.name} has been successfully installed.`,
                'fas fa-check-circle'
            );
        }
        
        // Refresh current view
        if (this.currentView === 'featured') {
            this.showFeatured();
        } else if (this.currentView === 'installed') {
            this.showInstalled();
        }
        
        this.updateStatus(`${app.name} installed successfully`);
        this.updateInstalledCount();
    }
    
    uninstallApp(appId) {
        const app = this.featuredApps.find(a => a.id === appId);
        if (!app) return;
        
        if (confirm(`Are you sure you want to uninstall ${app.name}?`)) {
            this.installedApps = this.installedApps.filter(id => id !== appId);
            this.saveInstalledApps();
            
            if (window.taskbar) {
                window.taskbar.addNotification(
                    'App Uninstalled',
                    `${app.name} has been uninstalled.`,
                    'fas fa-trash'
                );
            }
            
            this.showInstalled();
            this.updateStatus(`${app.name} uninstalled`);
            this.updateInstalledCount();
        }
    }
    
    openApp(appId) {
        const app = this.featuredApps.find(a => a.id === appId);
        if (!app) return;
        
        // For demo purposes, open the app's website
        if (app.url) {
            window.open(app.url, '_blank');
            this.updateStatus(`Opening ${app.name}...`);
        } else {
            this.updateStatus(`${app.name} would launch here`);
        }
    }
    
    showAppDetails(appId) {
        const app = this.featuredApps.find(a => a.id === appId);
        if (!app) return;
        
        const content = this.getContentElement().querySelector('#store-content');
        
        content.innerHTML = `
            <div class="app-details">
                <div class="details-header">
                    <button class="btn btn-ghost" id="back-to-store">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div class="app-details-content">
                    <div class="app-details-main">
                        <div class="app-details-header">
                            <div class="app-details-icon">
                                <i class="${app.icon}"></i>
                            </div>
                            <div class="app-details-info">
                                <h2>${app.name}</h2>
                                <div class="app-developer">${app.developer}</div>
                                <div class="app-rating">
                                    ${this.renderStars(app.rating)}
                                    <span class="rating-text">${app.rating} (${app.downloads} downloads)</span>
                                </div>
                                <div class="app-price-large">${app.price}</div>
                            </div>
                            <div class="app-details-actions">
                                ${this.installedApps.includes(app.id) ? 
                                    `<button class="btn btn-success btn-large" disabled>
                                        <i class="fas fa-check"></i> Installed
                                    </button>
                                    <button class="btn btn-secondary" onclick="this.openApp('${app.id}')">
                                        Open
                                    </button>` :
                                    `<button class="btn btn-primary btn-large install-btn" data-app-id="${app.id}">
                                        <i class="fas fa-download"></i> Install
                                    </button>`
                                }
                            </div>
                        </div>
                        
                        <div class="app-description">
                            <h3>Description</h3>
                            <p>${app.description}</p>
                        </div>
                        
                        <div class="app-features">
                            <h3>Key Features</h3>
                            <ul>
                                ${app.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="app-screenshots">
                            <h3>Screenshots</h3>
                            <div class="screenshots-grid">
                                ${app.screenshots.map(screenshot => `
                                    <div class="screenshot-placeholder">
                                        <i class="fas fa-image"></i>
                                        <span>Screenshot</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="app-details-sidebar">
                        <div class="app-info-card">
                            <h4>Information</h4>
                            <div class="info-item">
                                <span class="info-label">Category:</span>
                                <span class="info-value">${app.category}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Size:</span>
                                <span class="info-value">${app.size}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Downloads:</span>
                                <span class="info-value">${app.downloads}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Rating:</span>
                                <span class="info-value">${app.rating}/5</span>
                            </div>
                        </div>
                        
                        <div class="related-apps">
                            <h4>Related Apps</h4>
                            ${this.getRelatedApps(app).map(relatedApp => `
                                <div class="related-app-item" data-app-id="${relatedApp.id}">
                                    <div class="related-app-icon">
                                        <i class="${relatedApp.icon}"></i>
                                    </div>
                                    <div class="related-app-info">
                                        <div class="related-app-name">${relatedApp.name}</div>
                                        <div class="related-app-developer">${relatedApp.developer}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        content.querySelector('#back-to-store').addEventListener('click', () => {
            this.showFeatured();
        });
        
        const installBtn = content.querySelector('.install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installApp(app.id);
            });
        }
        
        content.querySelectorAll('.related-app-item').forEach(item => {
            item.addEventListener('click', () => {
                const relatedAppId = item.getAttribute('data-app-id');
                this.showAppDetails(relatedAppId);
            });
        });
    }
    
    getRelatedApps(app) {
        return this.featuredApps
            .filter(a => a.id !== app.id && a.category === app.category)
            .slice(0, 3);
    }
    
    getCategoryIcon(category) {
        const icons = {
            development: 'fas fa-code',
            internet: 'fas fa-globe',
            communication: 'fas fa-comments',
            music: 'fas fa-music',
            games: 'fas fa-gamepad',
            productivity: 'fas fa-briefcase',
            graphics: 'fas fa-paint-brush',
            utilities: 'fas fa-tools'
        };
        return icons[category] || 'fas fa-cube';
    }
    
    applyFilters() {
        // This would filter the current app list based on sort, filter, and search criteria
        this.updateStatus('Filters applied');
    }
    
    updateNavigationButtons() {
        const content = this.getContentElement();
        
        content.querySelectorAll('.app-toolbar .app-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = content.querySelector(`#store-${this.currentView}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    
    updateInstalledCount() {
        const installedCountElement = this.getContentElement().querySelector('#store-installed-count');
        if (installedCountElement) {
            installedCountElement.textContent = `${this.installedApps.length} installed`;
        }
    }
    
    loadInstalledApps() {
        try {
            const saved = localStorage.getItem('app-store-installed');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }
    
    saveInstalledApps() {
        try {
            localStorage.setItem('app-store-installed', JSON.stringify(this.installedApps));
        } catch (error) {
            console.error('Failed to save installed apps:', error);
        }
    }
    
    updateStatus(message) {
        const statusText = this.getContentElement().querySelector('#store-status-text');
        if (statusText) {
            statusText.textContent = message;
        }
    }
    
    cleanup() {
        super.cleanup();
        this.saveInstalledApps();
    }
}

// Register the application
window.AppStoreApp = AppStoreApp;