// Code Editor Application for Windows 11 Web OS

class CodeEditorApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 1000;
        this.defaultHeight = 700;
        this.minWidth = 600;
        this.minHeight = 400;
        
        this.openFiles = new Map();
        this.activeFileId = null;
        this.fileCounter = 0;
        this.theme = 'dark';
        this.fontSize = 14;
        this.tabSize = 4;
        this.wordWrap = false;
        this.showLineNumbers = true;
        this.autoSave = false;
        
        // Language definitions for syntax highlighting
        this.languages = {
            javascript: { name: 'JavaScript', extensions: ['js', 'jsx'], icon: 'fab fa-js-square' },
            typescript: { name: 'TypeScript', extensions: ['ts', 'tsx'], icon: 'fab fa-js-square' },
            python: { name: 'Python', extensions: ['py', 'pyw'], icon: 'fab fa-python' },
            html: { name: 'HTML', extensions: ['html', 'htm'], icon: 'fab fa-html5' },
            css: { name: 'CSS', extensions: ['css', 'scss', 'sass'], icon: 'fab fa-css3-alt' },
            json: { name: 'JSON', extensions: ['json'], icon: 'fas fa-code' },
            xml: { name: 'XML', extensions: ['xml'], icon: 'fas fa-code' },
            markdown: { name: 'Markdown', extensions: ['md', 'markdown'], icon: 'fab fa-markdown' },
            php: { name: 'PHP', extensions: ['php'], icon: 'fab fa-php' },
            java: { name: 'Java', extensions: ['java'], icon: 'fab fa-java' },
            cpp: { name: 'C++', extensions: ['cpp', 'cxx', 'cc'], icon: 'fas fa-code' },
            c: { name: 'C', extensions: ['c', 'h'], icon: 'fas fa-code' }
        };
        
        // Load file if provided
        if (options.filePath) {
            this.loadFileFromPath(options.filePath, options.fileName);
        } else {
            this.createNewFile();
        }
    }
    
    render() {
        return `
            <div class="code-editor">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ce-new" title="New File">
                            <i class="fas fa-file"></i>
                            <span>New</span>
                        </button>
                        <button class="app-button" id="ce-open" title="Open File">
                            <i class="fas fa-folder-open"></i>
                            <span>Open</span>
                        </button>
                        <button class="app-button" id="ce-save" title="Save">
                            <i class="fas fa-save"></i>
                            <span>Save</span>
                        </button>
                        <button class="app-button" id="ce-save-all" title="Save All">
                            <i class="fas fa-save"></i>
                            <span>Save All</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ce-undo" title="Undo" disabled>
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="app-button" id="ce-redo" title="Redo" disabled>
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ce-find" title="Find">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="app-button" id="ce-replace" title="Replace">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="app-button" id="ce-format" title="Format Code">
                            <i class="fas fa-indent"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <select class="app-select" id="ce-language">
                            <option value="auto">Auto Detect</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="json">JSON</option>
                            <option value="markdown">Markdown</option>
                        </select>
                        <select class="app-select" id="ce-theme">
                            <option value="dark" selected>Dark</option>
                            <option value="light">Light</option>
                            <option value="monokai">Monokai</option>
                            <option value="github">GitHub</option>
                        </select>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <button class="app-button" id="ce-run" title="Run Code">
                            <i class="fas fa-play"></i>
                            <span>Run</span>
                        </button>
                        <button class="app-button" id="ce-settings" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                
                <div class="code-editor-content">
                    <div class="code-editor-main">
                        <div class="code-editor-tabs" id="ce-tabs">
                            <!-- Tabs will be populated here -->
                        </div>
                        
                        <div class="code-editor-editor" id="ce-editor">
                            <!-- Editor content will be populated here -->
                        </div>
                    </div>
                    
                    <div class="code-editor-sidebar" id="ce-sidebar">
                        <div class="code-editor-sidebar-tabs">
                            <div class="code-editor-sidebar-tab active" data-panel="explorer">
                                <i class="fas fa-folder"></i>
                            </div>
                            <div class="code-editor-sidebar-tab" data-panel="search">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="code-editor-sidebar-tab" data-panel="git">
                                <i class="fab fa-git-alt"></i>
                            </div>
                            <div class="code-editor-sidebar-tab" data-panel="extensions">
                                <i class="fas fa-puzzle-piece"></i>
                            </div>
                        </div>
                        
                        <div class="code-editor-sidebar-content" id="ce-sidebar-content">
                            <!-- Sidebar content will be populated here -->
                        </div>
                    </div>
                </div>
                
                <div class="code-editor-status">
                    <div class="status-left">
                        <span id="ce-file-status">Ready</span>
                        <span class="status-separator">|</span>
                        <span id="ce-language-status">Plain Text</span>
                    </div>
                    <div class="status-right">
                        <span id="ce-cursor-position">Ln 1, Col 1</span>
                        <span class="status-separator">|</span>
                        <span id="ce-selection-info">UTF-8</span>
                        <span class="status-separator">|</span>
                        <span id="ce-line-ending">CRLF</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Toolbar buttons
        content.querySelector('#ce-new').addEventListener('click', () => this.createNewFile());
        content.querySelector('#ce-open').addEventListener('click', () => this.openFile());
        content.querySelector('#ce-save').addEventListener('click', () => this.saveActiveFile());
        content.querySelector('#ce-save-all').addEventListener('click', () => this.saveAllFiles());
        
        content.querySelector('#ce-undo').addEventListener('click', () => this.undo());
        content.querySelector('#ce-redo').addEventListener('click', () => this.redo());
        
        content.querySelector('#ce-find').addEventListener('click', () => this.showFindDialog());
        content.querySelector('#ce-replace').addEventListener('click', () => this.showReplaceDialog());
        content.querySelector('#ce-format').addEventListener('click', () => this.formatCode());
        
        content.querySelector('#ce-run').addEventListener('click', () => this.runCode());
        content.querySelector('#ce-settings').addEventListener('click', () => this.showSettings());
        
        // Settings
        content.querySelector('#ce-language').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
        
        content.querySelector('#ce-theme').addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
        
        // Sidebar tabs
        content.querySelectorAll('.code-editor-sidebar-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const panel = tab.getAttribute('data-panel');
                this.showSidebarPanel(panel);
            });
        });
        
        // Global shortcuts
        content.addEventListener('keydown', (e) => this.handleGlobalShortcuts(e));
    }
    
    loadData() {
        this.renderTabs();
        this.renderActiveEditor();
        this.showSidebarPanel('explorer');
        this.setTheme(this.theme);
    }
    
    createNewFile(fileName = null, content = '') {
        const fileId = `file-${++this.fileCounter}`;
        const file = {
            id: fileId,
            name: fileName || `Untitled-${this.fileCounter}`,
            content: content,
            originalContent: content,
            language: 'auto',
            modified: false,
            path: null,
            cursorPosition: { line: 1, column: 1 },
            scrollPosition: 0
        };
        
        this.openFiles.set(fileId, file);
        this.activeFileId = fileId;
        
        if (this.getContentElement()) {
            this.renderTabs();
            this.renderActiveEditor();
            this.updateLanguageFromFileName(file);
        }
        
        return file;
    }
    
    loadFileFromPath(filePath, fileName) {
        if (window.fileSystem) {
            const content = window.fileSystem.readFile(filePath);
            if (content !== null) {
                const file = this.createNewFile(fileName, content);
                file.path = filePath;
                file.originalContent = content;
                file.modified = false;
                
                this.updateLanguageFromFileName(file);
                this.updateTitle();
                this.updateFileStatus(`Opened: ${fileName}`);
            }
        }
    }
    
    openFile() {
        // Create file picker dialog similar to text editor
        const dialog = document.createElement('div');
        dialog.className = 'file-picker-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 500px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            display: flex;
            flex-direction: column;
        `;
        
        dialog.innerHTML = `
            <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--border-light); font-weight: 600;">
                Open Code File
            </div>
            <div style="flex: 1; overflow-y: auto; padding: var(--spacing-sm);">
                <div id="code-file-list"></div>
            </div>
            <div style="padding: var(--spacing-md); border-top: 1px solid var(--border-light); display: flex; gap: var(--spacing-sm); justify-content: flex-end;">
                <button class="btn btn-secondary" id="cancel-open">Cancel</button>
                <button class="btn btn-primary" id="confirm-open" disabled>Open</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        this.populateCodeFileList(dialog.querySelector('#code-file-list'));
        
        // Handle file selection and opening
        let selectedFile = null;
        
        dialog.querySelector('#cancel-open').addEventListener('click', () => dialog.remove());
        dialog.querySelector('#confirm-open').addEventListener('click', () => {
            if (selectedFile) {
                this.loadFileFromPath(selectedFile.path, selectedFile.name);
            }
            dialog.remove();
        });
        
        dialog.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-picker-item');
            if (fileItem) {
                dialog.querySelectorAll('.file-picker-item').forEach(item => item.classList.remove('selected'));
                fileItem.classList.add('selected');
                selectedFile = {
                    path: fileItem.getAttribute('data-path'),
                    name: fileItem.getAttribute('data-name')
                };
                dialog.querySelector('#confirm-open').disabled = false;
            }
        });
    }
    
    populateCodeFileList(container) {
        if (!window.fileSystem) return;
        
        const locations = [
            ['C:', 'Users', 'User', 'Documents', 'Code'],
            ['C:', 'Users', 'User', 'Desktop'],
            ['C:', 'Users', 'User', 'Documents']
        ];
        
        let html = '';
        
        locations.forEach(location => {
            const items = window.fileSystem.listDirectory(location);
            const codeFiles = items.filter(item => {
                if (item.type !== 'file') return false;
                const ext = window.fileSystem.getFileExtension(item.name);
                return ['js', 'ts', 'py', 'html', 'css', 'json', 'md', 'txt', 'xml', 'php', 'java', 'cpp', 'c'].includes(ext);
            });
            
            if (codeFiles.length > 0) {
                const locationName = location[location.length - 1];
                html += `<div style="font-weight: 600; margin: var(--spacing-md) 0 var(--spacing-sm) 0;">${locationName}</div>`;
                
                codeFiles.forEach(file => {
                    const filePath = window.fileSystem.getPathString([...location, file.name]);
                    const language = this.detectLanguageFromExtension(window.fileSystem.getFileExtension(file.name));
                    const langInfo = this.languages[language] || { name: 'Text', icon: 'fas fa-file' };
                    
                    html += `
                        <div class="file-picker-item" data-path="${filePath}" data-name="${file.name}" style="
                            display: flex;
                            align-items: center;
                            gap: var(--spacing-sm);
                            padding: var(--spacing-sm);
                            border-radius: var(--radius-sm);
                            cursor: pointer;
                            transition: background var(--transition-fast);
                        ">
                            <i class="${langInfo.icon}" style="color: var(--primary-blue);"></i>
                            <div style="flex: 1;">
                                <div style="font-weight: 500;">${file.name}</div>
                                <div style="font-size: var(--font-size-xs); color: var(--text-secondary);">
                                    ${langInfo.name} • ${window.fileSystem.formatFileSize(file.size)}
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
        });
        
        if (!html) {
            html = '<div style="text-align: center; color: var(--text-secondary); padding: var(--spacing-xl);">No code files found</div>';
        }
        
        container.innerHTML = html;
        
        // Add hover effects
        container.querySelectorAll('.file-picker-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('selected')) {
                    item.style.background = 'rgba(0, 120, 212, 0.1)';
                }
            });
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('selected')) {
                    item.style.background = 'transparent';
                }
            });
        });
    }
    
    saveActiveFile() {
        const activeFile = this.getActiveFile();
        if (!activeFile) return;
        
        if (!activeFile.path) {
            this.saveAsFile(activeFile);
            return;
        }
        
        if (window.fileSystem) {
            if (window.fileSystem.writeFile(activeFile.path, activeFile.content)) {
                activeFile.originalContent = activeFile.content;
                activeFile.modified = false;
                this.renderTabs();
                this.updateFileStatus(`Saved: ${activeFile.name}`);
            } else {
                this.updateFileStatus('Failed to save file');
            }
        }
    }
    
    saveAsFile(file) {
        const fileName = prompt('Enter file name:', file.name);
        if (!fileName) return;
        
        if (window.fileSystem) {
            const documentsPath = ['C:', 'Users', 'User', 'Documents', 'Code'];
            
            if (window.fileSystem.createFile(fileName, file.content, documentsPath)) {
                file.name = fileName;
                file.path = window.fileSystem.getPathString([...documentsPath, fileName]);
                file.originalContent = file.content;
                file.modified = false;
                
                this.updateLanguageFromFileName(file);
                this.renderTabs();
                this.updateTitle();
                this.updateFileStatus(`Saved as: ${fileName}`);
            } else {
                this.updateFileStatus('Failed to save file');
            }
        }
    }
    
    saveAllFiles() {
        let savedCount = 0;
        this.openFiles.forEach(file => {
            if (file.modified) {
                if (file.path) {
                    if (window.fileSystem && window.fileSystem.writeFile(file.path, file.content)) {
                        file.originalContent = file.content;
                        file.modified = false;
                        savedCount++;
                    }
                }
            }
        });
        
        this.renderTabs();
        this.updateFileStatus(`Saved ${savedCount} file(s)`);
    }
    
    closeFile(fileId) {
        const file = this.openFiles.get(fileId);
        if (!file) return;
        
        if (file.modified) {
            const save = confirm(`Do you want to save changes to ${file.name}?`);
            if (save) {
                this.saveFile(file);
            }
        }
        
        this.openFiles.delete(fileId);
        
        if (this.activeFileId === fileId) {
            const remainingFiles = Array.from(this.openFiles.keys());
            this.activeFileId = remainingFiles.length > 0 ? remainingFiles[0] : null;
        }
        
        if (this.openFiles.size === 0) {
            this.createNewFile();
        }
        
        this.renderTabs();
        this.renderActiveEditor();
    }
    
    switchToFile(fileId) {
        if (this.openFiles.has(fileId)) {
            this.activeFileId = fileId;
            this.renderActiveEditor();
            this.updateTitle();
        }
    }
    
    renderTabs() {
        const tabsContainer = this.getContentElement().querySelector('#ce-tabs');
        
        let html = '';
        this.openFiles.forEach(file => {
            const isActive = file.id === this.activeFileId;
            const language = this.languages[file.language] || { icon: 'fas fa-file' };
            
            html += `
                <div class="code-editor-tab ${isActive ? 'active' : ''}" data-file-id="${file.id}">
                    <div class="tab-icon">
                        <i class="${language.icon}"></i>
                    </div>
                    <div class="tab-title">${file.name}${file.modified ? ' •' : ''}</div>
                    <button class="tab-close" data-file-id="${file.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
        
        tabsContainer.innerHTML = html;
        
        // Add event listeners
        tabsContainer.querySelectorAll('.code-editor-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (!e.target.closest('.tab-close')) {
                    const fileId = tab.getAttribute('data-file-id');
                    this.switchToFile(fileId);
                }
            });
        });
        
        tabsContainer.querySelectorAll('.tab-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const fileId = closeBtn.getAttribute('data-file-id');
                this.closeFile(fileId);
            });
        });
    }
    
    renderActiveEditor() {
        const activeFile = this.getActiveFile();
        if (!activeFile) return;
        
        const editorContainer = this.getContentElement().querySelector('#ce-editor');
        
        editorContainer.innerHTML = `
            <div class="code-editor-line-numbers" id="ce-line-numbers"></div>
            <textarea 
                class="code-editor-textarea" 
                id="ce-textarea"
                spellcheck="false"
                autocomplete="off"
                style="font-size: ${this.fontSize}px; tab-size: ${this.tabSize};"
            >${activeFile.content}</textarea>
        `;
        
        const textarea = editorContainer.querySelector('#ce-textarea');
        const lineNumbers = editorContainer.querySelector('#ce-line-numbers');
        
        // Set up event listeners
        textarea.addEventListener('input', () => this.handleContentChange());
        textarea.addEventListener('keydown', (e) => this.handleEditorKeyDown(e));
        textarea.addEventListener('keyup', () => this.updateCursorPosition());
        textarea.addEventListener('click', () => this.updateCursorPosition());
        textarea.addEventListener('scroll', () => this.syncLineNumbers());
        
        this.updateLineNumbers();
        this.updateCursorPosition();
        this.applySyntaxHighlighting();
    }
    
    handleContentChange() {
        const activeFile = this.getActiveFile();
        if (!activeFile) return;
        
        const textarea = this.getContentElement().querySelector('#ce-textarea');
        activeFile.content = textarea.value;
        activeFile.modified = activeFile.content !== activeFile.originalContent;
        
        this.renderTabs();
        this.updateLineNumbers();
        this.updateTitle();
        
        if (this.autoSave) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                this.saveActiveFile();
            }, 2000);
        }
    }
    
    handleEditorKeyDown(event) {
        // Tab handling
        if (event.key === 'Tab') {
            event.preventDefault();
            this.insertTab();
        }
        
        // Auto-indent on Enter
        if (event.key === 'Enter') {
            setTimeout(() => this.handleAutoIndent(), 0);
        }
        
        // Bracket matching
        if (['(', '[', '{', '"', "'"].includes(event.key)) {
            this.handleBracketInsertion(event.key);
        }
    }
    
    insertTab() {
        const textarea = this.getContentElement().querySelector('#ce-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const tabString = ' '.repeat(this.tabSize);
        
        textarea.value = 
            textarea.value.substring(0, start) +
            tabString +
            textarea.value.substring(end);
        
        textarea.selectionStart = textarea.selectionEnd = start + tabString.length;
        this.handleContentChange();
    }
    
    handleAutoIndent() {
        const textarea = this.getContentElement().querySelector('#ce-textarea');
        const lines = textarea.value.substring(0, textarea.selectionStart).split('\n');
        const currentLine = lines[lines.length - 1];
        const previousLine = lines[lines.length - 2] || '';
        
        // Calculate indentation
        const indent = previousLine.match(/^\s*/)[0];
        let newIndent = indent;
        
        // Add extra indentation for opening brackets
        if (previousLine.trim().endsWith('{') || previousLine.trim().endsWith('[') || previousLine.trim().endsWith('(')) {
            newIndent += ' '.repeat(this.tabSize);
        }
        
        if (newIndent) {
            const start = textarea.selectionStart;
            textarea.value = 
                textarea.value.substring(0, start) +
                newIndent +
                textarea.value.substring(start);
            
            textarea.selectionStart = textarea.selectionEnd = start + newIndent.length;
            this.handleContentChange();
        }
    }
    
    handleBracketInsertion(openBracket) {
        const brackets = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'"
        };
        
        const closeBracket = brackets[openBracket];
        if (!closeBracket) return;
        
        setTimeout(() => {
            const textarea = this.getContentElement().querySelector('#ce-textarea');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            
            if (start === end) {
                textarea.value = 
                    textarea.value.substring(0, start) +
                    closeBracket +
                    textarea.value.substring(start);
                
                textarea.selectionStart = textarea.selectionEnd = start;
                this.handleContentChange();
            }
        }, 0);
    }
    
    updateLineNumbers() {
        const textarea = this.getContentElement().querySelector('#ce-textarea');
        const lineNumbers = this.getContentElement().querySelector('#ce-line-numbers');
        
        if (!textarea || !lineNumbers) return;
        
        const lines = textarea.value.split('\n');
        const lineCount = lines.length;
        
        let html = '';
        for (let i = 1; i <= lineCount; i++) {
            html += i + '\n';
        }
        
        lineNumbers.textContent = html;
    }
    
    syncLineNumbers() {
        const textarea = this.getContentElement().querySelector('#ce-textarea');
        const lineNumbers = this.getContentElement().querySelector('#ce-line-numbers');
        
        if (textarea && lineNumbers) {
            lineNumbers.scrollTop = textarea.scrollTop;
        }
    }
    
    updateCursorPosition() {
        const textarea = this.getContentElement().querySelector('#ce-textarea');
        if (!textarea) return;
        
        const text = textarea.value;
        const cursorPos = textarea.selectionStart;
        
        const textBeforeCursor = text.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        const cursorDisplay = this.getContentElement().querySelector('#ce-cursor-position');
        cursorDisplay.textContent = `Ln ${line}, Col ${column}`;
    }
    
    applySyntaxHighlighting() {
        // This is a simplified syntax highlighting implementation
        // In a real application, you'd use a proper syntax highlighting library
        const activeFile = this.getActiveFile();
        if (!activeFile || activeFile.language === 'auto') return;
        
        // Update language status
        const languageStatus = this.getContentElement().querySelector('#ce-language-status');
        const langInfo = this.languages[activeFile.language];
        if (langInfo) {
            languageStatus.textContent = langInfo.name;
        }
    }
    
    detectLanguageFromExtension(extension) {
        for (const [langId, langInfo] of Object.entries(this.languages)) {
            if (langInfo.extensions.includes(extension.toLowerCase())) {
                return langId;
            }
        }
        return 'auto';
    }
    
    updateLanguageFromFileName(file) {
        if (!file.name.includes('.')) return;
        
        const extension = file.name.split('.').pop();
        const detectedLanguage = this.detectLanguageFromExtension(extension);
        
        if (detectedLanguage !== 'auto') {
            file.language = detectedLanguage;
            this.applySyntaxHighlighting();
        }
    }
    
    setLanguage(language) {
        const activeFile = this.getActiveFile();
        if (activeFile) {
            activeFile.language = language;
            this.applySyntaxHighlighting();
        }
    }
    
    setTheme(theme) {
        this.theme = theme;
        const editor = this.getContentElement().querySelector('.code-editor');
        
        // Remove existing theme classes
        editor.classList.remove('theme-dark', 'theme-light', 'theme-monokai', 'theme-github');
        
        // Add new theme class
        editor.classList.add(`theme-${theme}`);
    }
    
    showSidebarPanel(panel) {
        const tabs = this.getContentElement().querySelectorAll('.code-editor-sidebar-tab');
        const content = this.getContentElement().querySelector('#ce-sidebar-content');
        
        // Update active tab
        tabs.forEach(tab => {
            if (tab.getAttribute('data-panel') === panel) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Render panel content
        switch (panel) {
            case 'explorer':
                this.renderExplorerPanel(content);
                break;
            case 'search':
                this.renderSearchPanel(content);
                break;
            case 'git':
                this.renderGitPanel(content);
                break;
            case 'extensions':
                this.renderExtensionsPanel(content);
                break;
        }
    }
    
    renderExplorerPanel(container) {
        container.innerHTML = `
            <div class="sidebar-panel">
                <div class="panel-header">
                    <h4>Explorer</h4>
                    <div class="panel-actions">
                        <button class="btn btn-ghost" title="New File">
                            <i class="fas fa-file-plus"></i>
                        </button>
                        <button class="btn btn-ghost" title="New Folder">
                            <i class="fas fa-folder-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="file-tree">
                        <div class="tree-item">
                            <i class="fas fa-folder-open"></i>
                            <span>Code</span>
                        </div>
                        ${Array.from(this.openFiles.values()).map(file => `
                            <div class="tree-item file ${file.id === this.activeFileId ? 'active' : ''}" data-file-id="${file.id}">
                                <i class="${this.languages[file.language]?.icon || 'fas fa-file'}"></i>
                                <span>${file.name}${file.modified ? ' •' : ''}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Add click handlers
        container.querySelectorAll('.tree-item.file').forEach(item => {
            item.addEventListener('click', () => {
                const fileId = item.getAttribute('data-file-id');
                this.switchToFile(fileId);
            });
        });
    }
    
    renderSearchPanel(container) {
        container.innerHTML = `
            <div class="sidebar-panel">
                <div class="panel-header">
                    <h4>Search</h4>
                </div>
                <div class="panel-content">
                    <div class="search-form">
                        <input type="text" class="app-input" placeholder="Search..." id="sidebar-search">
                        <input type="text" class="app-input" placeholder="Replace..." id="sidebar-replace">
                        <div class="search-options">
                            <label><input type="checkbox"> Match Case</label>
                            <label><input type="checkbox"> Whole Word</label>
                            <label><input type="checkbox"> Use Regex</label>
                        </div>
                    </div>
                    <div class="search-results" id="search-results">
                        <p>No results</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderGitPanel(container) {
        container.innerHTML = `
            <div class="sidebar-panel">
                <div class="panel-header">
                    <h4>Source Control</h4>
                </div>
                <div class="panel-content">
                    <div class="git-status">
                        <p>Git functionality would be implemented here</p>
                        <div class="git-actions">
                            <button class="btn btn-primary">Initialize Repository</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderExtensionsPanel(container) {
        container.innerHTML = `
            <div class="sidebar-panel">
                <div class="panel-header">
                    <h4>Extensions</h4>
                </div>
                <div class="panel-content">
                    <div class="extensions-list">
                        <div class="extension-item">
                            <div class="extension-info">
                                <h5>Syntax Highlighter</h5>
                                <p>Enhanced syntax highlighting</p>
                            </div>
                            <button class="btn btn-primary">Install</button>
                        </div>
                        <div class="extension-item">
                            <div class="extension-info">
                                <h5>Code Formatter</h5>
                                <p>Auto-format your code</p>
                            </div>
                            <button class="btn btn-primary">Install</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    runCode() {
        const activeFile = this.getActiveFile();
        if (!activeFile) return;
        
        if (activeFile.language === 'python') {
            // Run Python code in terminal
            if (window.applicationManager) {
                const terminalInstance = window.applicationManager.openApplication('terminal');
                // Could send code to terminal for execution
            }
        } else if (activeFile.language === 'javascript') {
            // Run JavaScript code
            try {
                const result = eval(activeFile.content);
                console.log('Code execution result:', result);
                this.updateFileStatus('Code executed successfully');
            } catch (error) {
                console.error('Code execution error:', error);
                this.updateFileStatus(`Error: ${error.message}`);
            }
        } else {
            this.updateFileStatus(`Cannot run ${activeFile.language} code directly`);
        }
    }
    
    formatCode() {
        const activeFile = this.getActiveFile();
        if (!activeFile) return;
        
        // Simple code formatting (would use proper formatter in real implementation)
        let formatted = activeFile.content;
        
        if (activeFile.language === 'json') {
            try {
                const parsed = JSON.parse(formatted);
                formatted = JSON.stringify(parsed, null, 2);
            } catch (error) {
                this.updateFileStatus('Invalid JSON');
                return;
            }
        }
        
        activeFile.content = formatted;
        this.renderActiveEditor();
        this.updateFileStatus('Code formatted');
    }
    
    getActiveFile() {
        return this.activeFileId ? this.openFiles.get(this.activeFileId) : null;
    }
    
    updateTitle() {
        const activeFile = this.getActiveFile();
        if (activeFile) {
            const title = `${activeFile.name}${activeFile.modified ? ' •' : ''} - Code Editor`;
            super.updateTitle(title);
        } else {
            super.updateTitle('Code Editor');
        }
    }
    
    updateFileStatus(message) {
        const statusDisplay = this.getContentElement().querySelector('#ce-file-status');
        statusDisplay.textContent = message;
        
        if (message !== 'Ready') {
            setTimeout(() => {
                statusDisplay.textContent = 'Ready';
            }, 3000);
        }
    }
    
    handleGlobalShortcuts(event) {
        // Ctrl+S - Save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            if (event.shiftKey) {
                this.saveAllFiles();
            } else {
                this.saveActiveFile();
            }
        }
        
        // Ctrl+N - New File
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.createNewFile();
        }
        
        // Ctrl+O - Open File
        if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
            event.preventDefault();
            this.openFile();
        }
        
        // Ctrl+W - Close File
        if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
            event.preventDefault();
            if (this.activeFileId) {
                this.closeFile(this.activeFileId);
            }
        }
        
        // Ctrl+F - Find
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            this.showFindDialog();
        }
        
        // F5 - Run Code
        if (event.key === 'F5') {
            event.preventDefault();
            this.runCode();
        }
    }
    
    showFindDialog() {
        // Implementation similar to text editor
        this.updateFileStatus('Find dialog would open here');
    }
    
    showReplaceDialog() {
        // Implementation similar to text editor
        this.updateFileStatus('Replace dialog would open here');
    }
    
    showSettings() {
        this.updateFileStatus('Settings dialog would open here');
    }
    
    undo() {
        document.execCommand('undo');
        this.handleContentChange();
    }
    
    redo() {
        document.execCommand('redo');
        this.handleContentChange();
    }
    
    cleanup() {
        super.cleanup();
        
        // Save all modified files before closing
        this.openFiles.forEach(file => {
            if (file.modified && file.path) {
                if (window.fileSystem) {
                    window.fileSystem.writeFile(file.path, file.content);
                }
            }
        });
    }
}

// Register the application
window.CodeEditorApp = CodeEditorApp;