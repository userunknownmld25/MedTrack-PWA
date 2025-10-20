// Settings Application
class SettingsApp {
    constructor() {
        this.name = 'Settings';
        this.icon = '⚙️';
        this.settings = {
            theme: 'light',
            wallpaper: 'default',
            fontSize: 14,
            animations: true,
            sound: true,
            notifications: true,
            autoSave: true,
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h'
        };
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="settings-container">
                    <div class="settings-sidebar">
                        <div class="settings-nav">
                            <div class="nav-item active" data-section="appearance">🎨 Appearance</div>
                            <div class="nav-item" data-section="system">💻 System</div>
                            <div class="nav-item" data-section="privacy">🔒 Privacy</div>
                            <div class="nav-item" data-section="accessibility">♿ Accessibility</div>
                            <div class="nav-item" data-section="about">ℹ️ About</div>
                        </div>
                    </div>
                    <div class="settings-main">
                        <div class="settings-section active" id="appearance">
                            <h2>Appearance</h2>
                            <div class="setting-group">
                                <label class="setting-label">Theme</label>
                                <select id="theme-select" class="setting-input">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Wallpaper</label>
                                <select id="wallpaper-select" class="setting-input">
                                    <option value="default">Default</option>
                                    <option value="nature">Nature</option>
                                    <option value="abstract">Abstract</option>
                                    <option value="solid">Solid Color</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Font Size</label>
                                <input type="range" id="font-size-slider" class="setting-slider" min="10" max="24" value="14">
                                <span id="font-size-value">14px</span>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Animations</label>
                                <label class="toggle">
                                    <input type="checkbox" id="animations-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section" id="system">
                            <h2>System</h2>
                            <div class="setting-group">
                                <label class="setting-label">Language</label>
                                <select id="language-select" class="setting-input">
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="ja">日本語</option>
                                    <option value="ko">한국어</option>
                                    <option value="zh">中文</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Timezone</label>
                                <select id="timezone-select" class="setting-input">
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <option value="America/Denver">Mountain Time</option>
                                    <option value="America/Los_Angeles">Pacific Time</option>
                                    <option value="Europe/London">London</option>
                                    <option value="Europe/Paris">Paris</option>
                                    <option value="Asia/Tokyo">Tokyo</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Date Format</label>
                                <select id="date-format-select" class="setting-input">
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Time Format</label>
                                <select id="time-format-select" class="setting-input">
                                    <option value="12h">12 Hour</option>
                                    <option value="24h">24 Hour</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Auto Save</label>
                                <label class="toggle">
                                    <input type="checkbox" id="auto-save-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section" id="privacy">
                            <h2>Privacy & Security</h2>
                            <div class="setting-group">
                                <label class="setting-label">Sound Effects</label>
                                <label class="toggle">
                                    <input type="checkbox" id="sound-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Notifications</label>
                                <label class="toggle">
                                    <input type="checkbox" id="notifications-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Data Collection</label>
                                <label class="toggle">
                                    <input type="checkbox" id="data-collection-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Clear Cache</label>
                                <button class="setting-button" id="clear-cache-btn">Clear Cache</button>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Reset Settings</label>
                                <button class="setting-button danger" id="reset-settings-btn">Reset to Default</button>
                            </div>
                        </div>
                        
                        <div class="settings-section" id="accessibility">
                            <h2>Accessibility</h2>
                            <div class="setting-group">
                                <label class="setting-label">High Contrast</label>
                                <label class="toggle">
                                    <input type="checkbox" id="high-contrast-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Large Text</label>
                                <label class="toggle">
                                    <input type="checkbox" id="large-text-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Screen Reader</label>
                                <label class="toggle">
                                    <input type="checkbox" id="screen-reader-toggle">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Keyboard Navigation</label>
                                <label class="toggle">
                                    <input type="checkbox" id="keyboard-nav-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Focus Indicators</label>
                                <label class="toggle">
                                    <input type="checkbox" id="focus-indicators-toggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section" id="about">
                            <h2>About WebOS</h2>
                            <div class="about-content">
                                <div class="about-logo">🖥️</div>
                                <h3>WebOS v1.0.0</h3>
                                <p>A comprehensive web-based operating system replica of Windows 11</p>
                                
                                <div class="about-info">
                                    <div class="info-item">
                                        <strong>Version:</strong> 1.0.0
                                    </div>
                                    <div class="info-item">
                                        <strong>Build:</strong> 2024.01.15
                                    </div>
                                    <div class="info-item">
                                        <strong>Platform:</strong> Web Browser
                                    </div>
                                    <div class="info-item">
                                        <strong>Engine:</strong> HTML5, CSS3, JavaScript
                                    </div>
                                </div>
                                
                                <div class="about-features">
                                    <h4>Features</h4>
                                    <ul>
                                        <li>Complete desktop environment</li>
                                        <li>File manager with drag & drop</li>
                                        <li>Advanced code editor with syntax highlighting</li>
                                        <li>Terminal with Python support</li>
                                        <li>Web browser with tab management</li>
                                        <li>Paint application with drawing tools</li>
                                        <li>Video editor with timeline</li>
                                        <li>Built-in games collection</li>
                                        <li>System settings and customization</li>
                                    </ul>
                                </div>
                                
                                <div class="about-actions">
                                    <button class="setting-button" id="check-updates-btn">Check for Updates</button>
                                    <button class="setting-button" id="export-settings-btn">Export Settings</button>
                                    <button class="setting-button" id="import-settings-btn">Import Settings</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.loadSettings();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Navigation
        this.container.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Appearance settings
        this.container.querySelector('#theme-select').addEventListener('change', (e) => {
            this.updateSetting('theme', e.target.value);
        });

        this.container.querySelector('#wallpaper-select').addEventListener('change', (e) => {
            this.updateSetting('wallpaper', e.target.value);
        });

        this.container.querySelector('#font-size-slider').addEventListener('input', (e) => {
            this.updateSetting('fontSize', parseInt(e.target.value));
            this.container.querySelector('#font-size-value').textContent = e.target.value + 'px';
        });

        this.container.querySelector('#animations-toggle').addEventListener('change', (e) => {
            this.updateSetting('animations', e.target.checked);
        });

        // System settings
        this.container.querySelector('#language-select').addEventListener('change', (e) => {
            this.updateSetting('language', e.target.value);
        });

        this.container.querySelector('#timezone-select').addEventListener('change', (e) => {
            this.updateSetting('timezone', e.target.value);
        });

        this.container.querySelector('#date-format-select').addEventListener('change', (e) => {
            this.updateSetting('dateFormat', e.target.value);
        });

        this.container.querySelector('#time-format-select').addEventListener('change', (e) => {
            this.updateSetting('timeFormat', e.target.value);
        });

        this.container.querySelector('#auto-save-toggle').addEventListener('change', (e) => {
            this.updateSetting('autoSave', e.target.checked);
        });

        // Privacy settings
        this.container.querySelector('#sound-toggle').addEventListener('change', (e) => {
            this.updateSetting('sound', e.target.checked);
        });

        this.container.querySelector('#notifications-toggle').addEventListener('change', (e) => {
            this.updateSetting('notifications', e.target.checked);
        });

        this.container.querySelector('#data-collection-toggle').addEventListener('change', (e) => {
            this.updateSetting('dataCollection', e.target.checked);
        });

        this.container.querySelector('#clear-cache-btn').addEventListener('click', () => {
            this.clearCache();
        });

        this.container.querySelector('#reset-settings-btn').addEventListener('click', () => {
            this.resetSettings();
        });

        // Accessibility settings
        this.container.querySelector('#high-contrast-toggle').addEventListener('change', (e) => {
            this.updateSetting('highContrast', e.target.checked);
        });

        this.container.querySelector('#large-text-toggle').addEventListener('change', (e) => {
            this.updateSetting('largeText', e.target.checked);
        });

        this.container.querySelector('#screen-reader-toggle').addEventListener('change', (e) => {
            this.updateSetting('screenReader', e.target.checked);
        });

        this.container.querySelector('#keyboard-nav-toggle').addEventListener('change', (e) => {
            this.updateSetting('keyboardNav', e.target.checked);
        });

        this.container.querySelector('#focus-indicators-toggle').addEventListener('change', (e) => {
            this.updateSetting('focusIndicators', e.target.checked);
        });

        // About actions
        this.container.querySelector('#check-updates-btn').addEventListener('click', () => {
            this.checkUpdates();
        });

        this.container.querySelector('#export-settings-btn').addEventListener('click', () => {
            this.exportSettings();
        });

        this.container.querySelector('#import-settings-btn').addEventListener('click', () => {
            this.importSettings();
        });
    }

    switchSection(sectionId) {
        // Update navigation
        this.container.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        this.container.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        this.container.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        this.container.querySelector(`#${sectionId}`).classList.add('active');
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('webos-settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('webos-settings', JSON.stringify(this.settings));
    }

    updateUI() {
        // Update all form elements with current settings
        Object.keys(this.settings).forEach(key => {
            const element = this.container.querySelector(`#${key}-select, #${key}-toggle, #${key}-slider`);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });

        // Update font size display
        this.container.querySelector('#font-size-value').textContent = this.settings.fontSize + 'px';
    }

    applySettings() {
        // Apply theme
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Apply font size
        document.documentElement.style.fontSize = this.settings.fontSize + 'px';

        // Apply animations
        if (!this.settings.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }

        // Apply high contrast
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        // Apply large text
        if (this.settings.largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
    }

    clearCache() {
        if (confirm('Are you sure you want to clear the cache? This will remove temporary files and may improve performance.')) {
            // Clear localStorage cache
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('webos-cache-')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear sessionStorage
            sessionStorage.clear();
            
            alert('Cache cleared successfully!');
        }
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
            this.settings = {
                theme: 'light',
                wallpaper: 'default',
                fontSize: 14,
                animations: true,
                sound: true,
                notifications: true,
                autoSave: true,
                language: 'en',
                timezone: 'UTC',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h'
            };
            
            this.saveSettings();
            this.updateUI();
            this.applySettings();
            
            alert('Settings reset to default!');
        }
    }

    checkUpdates() {
        // Simulate update check
        const updateBtn = this.container.querySelector('#check-updates-btn');
        updateBtn.textContent = 'Checking...';
        updateBtn.disabled = true;
        
        setTimeout(() => {
            updateBtn.textContent = 'Check for Updates';
            updateBtn.disabled = false;
            alert('You are running the latest version of WebOS!');
        }, 2000);
    }

    exportSettings() {
        const settingsData = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([settingsData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webos-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedSettings = JSON.parse(e.target.result);
                        this.settings = { ...this.settings, ...importedSettings };
                        this.saveSettings();
                        this.updateUI();
                        this.applySettings();
                        alert('Settings imported successfully!');
                    } catch (error) {
                        alert('Error importing settings: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    getSetting(key) {
        return this.settings[key];
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }

    cleanup() {
        console.log('Settings cleanup');
    }
}