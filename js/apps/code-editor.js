// Code Editor Application
class CodeEditorApp {
    constructor() {
        this.name = 'Code Editor';
        this.icon = '💻';
        this.tabs = [];
        this.activeTab = 0;
        this.editor = null;
        this.theme = 'default';
        this.fontSize = 14;
        this.wordWrap = true;
        this.lineNumbers = true;
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="app-toolbar">
                    <button class="toolbar-button" id="new-file-btn" title="New File">📄</button>
                    <button class="toolbar-button" id="open-file-btn" title="Open File">📁</button>
                    <button class="toolbar-button" id="save-file-btn" title="Save File">💾</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="undo-btn" title="Undo">↶</button>
                    <button class="toolbar-button" id="redo-btn" title="Redo">↷</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="find-btn" title="Find">🔍</button>
                    <button class="toolbar-button" id="replace-btn" title="Replace">🔄</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="run-btn" title="Run Code">▶️</button>
                    <button class="toolbar-button" id="format-btn" title="Format Code">🎨</button>
                    <div class="toolbar-separator"></div>
                    <select id="language-select" class="toolbar-select">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="markdown">Markdown</option>
                    </select>
                    <select id="theme-select" class="toolbar-select">
                        <option value="default">Default</option>
                        <option value="dark">Dark</option>
                        <option value="monokai">Monokai</option>
                        <option value="solarized">Solarized</option>
                    </select>
                </div>
                <div class="code-editor-container">
                    <div class="editor-tabs" id="editor-tabs">
                        <!-- Tabs will be added dynamically -->
                    </div>
                    <div class="editor-main">
                        <textarea class="code-editor" id="code-editor" placeholder="Start typing your code here..."></textarea>
                        <div class="editor-sidebar" id="editor-sidebar">
                            <div class="sidebar-section">
                                <h4>Explorer</h4>
                                <div class="file-tree" id="file-tree">
                                    <div class="file-item">📁 src</div>
                                    <div class="file-item">📁 assets</div>
                                    <div class="file-item">📄 index.html</div>
                                    <div class="file-item">📄 style.css</div>
                                    <div class="file-item">📄 script.js</div>
                                </div>
                            </div>
                            <div class="sidebar-section">
                                <h4>Outline</h4>
                                <div class="outline" id="outline">
                                    <!-- Outline will be populated -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="editor-status-bar">
                        <span id="cursor-position">Line 1, Column 1</span>
                        <span id="file-encoding">UTF-8</span>
                        <span id="file-language">JavaScript</span>
                        <span id="file-size">0 bytes</span>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.setupEventListeners();
        this.initializeEditor();
        this.addTab('Untitled-1', 'javascript', '');
    }

    setupEventListeners() {
        // Toolbar buttons
        this.container.querySelector('#new-file-btn').addEventListener('click', () => this.newFile());
        this.container.querySelector('#open-file-btn').addEventListener('click', () => this.openFile());
        this.container.querySelector('#save-file-btn').addEventListener('click', () => this.saveFile());
        this.container.querySelector('#undo-btn').addEventListener('click', () => this.undo());
        this.container.querySelector('#redo-btn').addEventListener('click', () => this.redo());
        this.container.querySelector('#find-btn').addEventListener('click', () => this.showFindDialog());
        this.container.querySelector('#replace-btn').addEventListener('click', () => this.showReplaceDialog());
        this.container.querySelector('#run-btn').addEventListener('click', () => this.runCode());
        this.container.querySelector('#format-btn').addEventListener('click', () => this.formatCode());

        // Language and theme selectors
        this.container.querySelector('#language-select').addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });

        this.container.querySelector('#theme-select').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        // Editor events
        const editor = this.container.querySelector('#code-editor');
        editor.addEventListener('input', () => this.onEditorChange());
        editor.addEventListener('keydown', (e) => this.handleKeyDown(e));
        editor.addEventListener('keyup', () => this.updateCursorPosition());
        editor.addEventListener('click', () => this.updateCursorPosition());

        // Tab management
        this.setupTabListeners();
    }

    setupTabListeners() {
        const tabsContainer = this.container.querySelector('#editor-tabs');
        
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-close')) {
                const tabIndex = parseInt(e.target.closest('.editor-tab').dataset.tab);
                this.closeTab(tabIndex);
            } else if (e.target.closest('.editor-tab')) {
                const tabIndex = parseInt(e.target.closest('.editor-tab').dataset.tab);
                this.switchTab(tabIndex);
            }
        });
    }

    initializeEditor() {
        const editor = this.container.querySelector('#code-editor');
        
        // Initialize CodeMirror if available
        if (typeof CodeMirror !== 'undefined') {
            this.editor = CodeMirror.fromTextArea(editor, {
                mode: 'javascript',
                theme: 'default',
                lineNumbers: true,
                lineWrapping: true,
                indentUnit: 4,
                tabSize: 4,
                autoCloseBrackets: true,
                matchBrackets: true,
                foldGutter: true,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                extraKeys: {
                    'Ctrl-S': () => this.saveFile(),
                    'Ctrl-N': () => this.newFile(),
                    'Ctrl-O': () => this.openFile(),
                    'Ctrl-F': () => this.showFindDialog(),
                    'Ctrl-H': () => this.showReplaceDialog(),
                    'F5': () => this.runCode(),
                    'Ctrl-/': 'toggleComment',
                    'Ctrl-D': 'selectNextOccurrence',
                    'Ctrl-Shift-K': 'deleteLine',
                    'Ctrl-Alt-F': () => this.formatCode()
                }
            });

            this.editor.on('change', () => this.onEditorChange());
            this.editor.on('cursorActivity', () => this.updateCursorPosition());
        }
    }

    addTab(title, language, content) {
        const tabId = this.tabs.length;
        const tab = {
            id: tabId,
            title: title,
            language: language,
            content: content,
            modified: false,
            path: null
        };

        this.tabs.push(tab);

        // Create tab element
        const tabsContainer = this.container.querySelector('#editor-tabs');
        const tabElement = document.createElement('button');
        tabElement.className = 'editor-tab';
        tabElement.dataset.tab = tabId;
        tabElement.innerHTML = `
            <span class="tab-title">${title}</span>
            <button class="tab-close">×</button>
        `;
        
        tabsContainer.appendChild(tabElement);
        
        // Switch to new tab
        this.switchTab(tabId);
        
        return tabId;
    }

    switchTab(tabId) {
        // Update active tab
        this.container.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = this.container.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        this.activeTab = tabId;
        
        // Update editor content
        const tab = this.tabs[tabId];
        if (tab) {
            if (this.editor) {
                this.editor.setValue(tab.content);
                this.editor.setOption('mode', this.getCodeMirrorMode(tab.language));
            } else {
                this.container.querySelector('#code-editor').value = tab.content;
            }
            
            this.changeLanguage(tab.language);
            this.updateCursorPosition();
        }
    }

    closeTab(tabId) {
        if (this.tabs.length <= 1) return; // Don't close the last tab
        
        const tab = this.tabs[tabId];
        if (tab.modified) {
            if (!confirm(`Save changes to ${tab.title}?`)) {
                return;
            }
            this.saveFile();
        }
        
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

    newFile() {
        const tabCount = this.tabs.length + 1;
        this.addTab(`Untitled-${tabCount}`, 'javascript', '');
    }

    openFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.js,.html,.css,.py,.json,.xml,.md,.txt';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    const language = this.getLanguageFromExtension(file.name);
                    this.addTab(file.name, language, content);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    saveFile() {
        const tab = this.tabs[this.activeTab];
        if (!tab) return;

        const content = this.editor ? this.editor.getValue() : this.container.querySelector('#code-editor').value;
        tab.content = content;
        tab.modified = false;
        
        // Update tab title to remove asterisk
        const tabElement = this.container.querySelector(`[data-tab="${this.activeTab}"] .tab-title`);
        if (tabElement) {
            tabElement.textContent = tab.title.replace('*', '');
        }

        // Create download link
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tab.title;
        a.click();
        URL.revokeObjectURL(url);
    }

    undo() {
        if (this.editor) {
            this.editor.undo();
        }
    }

    redo() {
        if (this.editor) {
            this.editor.redo();
        }
    }

    showFindDialog() {
        const query = prompt('Find:', '');
        if (query) {
            this.findText(query);
        }
    }

    showReplaceDialog() {
        const find = prompt('Find:', '');
        if (find) {
            const replace = prompt('Replace with:', '');
            if (replace !== null) {
                this.replaceText(find, replace);
            }
        }
    }

    findText(query) {
        if (this.editor) {
            this.editor.execCommand('find');
        } else {
            const editor = this.container.querySelector('#code-editor');
            const content = editor.value;
            const index = content.toLowerCase().indexOf(query.toLowerCase());
            if (index !== -1) {
                editor.focus();
                editor.setSelectionRange(index, index + query.length);
            }
        }
    }

    replaceText(find, replace) {
        if (this.editor) {
            const content = this.editor.getValue();
            const newContent = content.replace(new RegExp(find, 'g'), replace);
            this.editor.setValue(newContent);
        } else {
            const editor = this.container.querySelector('#code-editor');
            editor.value = editor.value.replace(new RegExp(find, 'g'), replace);
        }
    }

    runCode() {
        const tab = this.tabs[this.activeTab];
        if (!tab) return;

        const content = this.editor ? this.editor.getValue() : this.container.querySelector('#code-editor').value;
        
        // Create a new window to run the code
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        
        if (tab.language === 'javascript') {
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head><title>Code Output</title></head>
                <body>
                    <div id="output"></div>
                    <script>
                        try {
                            ${content}
                        } catch (error) {
                            document.getElementById('output').innerHTML = '<pre style="color: red;">Error: ' + error.message + '</pre>';
                        }
                    </script>
                </body>
                </html>
            `);
        } else if (tab.language === 'html') {
            newWindow.document.write(content);
        } else if (tab.language === 'python') {
            // For Python, we'd need a Python interpreter
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head><title>Python Code</title></head>
                <body>
                    <h3>Python Code (Browser cannot execute Python directly)</h3>
                    <pre>${content}</pre>
                    <p>To run Python code, use a Python interpreter or online Python environment.</p>
                </body>
                </html>
            `);
        }
    }

    formatCode() {
        const tab = this.tabs[this.activeTab];
        if (!tab) return;

        let content = this.editor ? this.editor.getValue() : this.container.querySelector('#code-editor').value;
        
        // Simple formatting based on language
        if (tab.language === 'javascript' || tab.language === 'json') {
            try {
                if (tab.language === 'json') {
                    content = JSON.stringify(JSON.parse(content), null, 2);
                } else {
                    // Basic JavaScript formatting
                    content = content
                        .replace(/;/g, ';\n')
                        .replace(/{/g, '{\n')
                        .replace(/}/g, '\n}')
                        .replace(/,/g, ',\n');
                }
            } catch (e) {
                alert('Error formatting code: ' + e.message);
                return;
            }
        } else if (tab.language === 'html') {
            // Basic HTML formatting
            content = content
                .replace(/></g, '>\n<')
                .replace(/</g, '\n<')
                .replace(/>/g, '>');
        }

        if (this.editor) {
            this.editor.setValue(content);
        } else {
            this.container.querySelector('#code-editor').value = content;
        }
    }

    changeLanguage(language) {
        this.container.querySelector('#language-select').value = language;
        
        if (this.editor) {
            this.editor.setOption('mode', this.getCodeMirrorMode(language));
        }
        
        // Update status bar
        this.container.querySelector('#file-language').textContent = language;
    }

    changeTheme(theme) {
        this.theme = theme;
        
        if (this.editor) {
            this.editor.setOption('theme', theme);
        }
        
        // Update editor styling
        const editor = this.container.querySelector('#code-editor');
        editor.className = `code-editor theme-${theme}`;
    }

    getCodeMirrorMode(language) {
        const modes = {
            'javascript': 'javascript',
            'python': 'python',
            'html': 'htmlmixed',
            'css': 'css',
            'json': 'application/json',
            'xml': 'xml',
            'markdown': 'markdown'
        };
        return modes[language] || 'javascript';
    }

    getLanguageFromExtension(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const extensions = {
            'js': 'javascript',
            'py': 'python',
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'json': 'json',
            'xml': 'xml',
            'md': 'markdown',
            'txt': 'text'
        };
        return extensions[ext] || 'text';
    }

    onEditorChange() {
        const tab = this.tabs[this.activeTab];
        if (!tab) return;

        const content = this.editor ? this.editor.getValue() : this.container.querySelector('#code-editor').value;
        tab.content = content;
        tab.modified = true;
        
        // Update tab title to show modified state
        const tabElement = this.container.querySelector(`[data-tab="${this.activeTab}"] .tab-title`);
        if (tabElement && !tabElement.textContent.includes('*')) {
            tabElement.textContent = tab.title + '*';
        }
        
        // Update file size
        this.updateFileSize();
    }

    updateCursorPosition() {
        if (this.editor) {
            const cursor = this.editor.getCursor();
            this.container.querySelector('#cursor-position').textContent = 
                `Line ${cursor.line + 1}, Column ${cursor.ch + 1}`;
        } else {
            const editor = this.container.querySelector('#code-editor');
            const text = editor.value.substring(0, editor.selectionStart);
            const lines = text.split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            this.container.querySelector('#cursor-position').textContent = 
                `Line ${line}, Column ${column}`;
        }
    }

    updateFileSize() {
        const tab = this.tabs[this.activeTab];
        if (tab) {
            const size = new Blob([tab.content]).size;
            this.container.querySelector('#file-size').textContent = this.formatFileSize(size);
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 bytes';
        const k = 1024;
        const sizes = ['bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleKeyDown(e) {
        // Handle special key combinations
        if (e.ctrlKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveFile();
                    break;
                case 'n':
                    e.preventDefault();
                    this.newFile();
                    break;
                case 'o':
                    e.preventDefault();
                    this.openFile();
                    break;
                case 'f':
                    e.preventDefault();
                    this.showFindDialog();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showReplaceDialog();
                    break;
            }
        }
        
        if (e.key === 'F5') {
            e.preventDefault();
            this.runCode();
        }
    }

    // Settings
    updateSettings(settings) {
        if (settings.fontSize) {
            this.fontSize = settings.fontSize;
            if (this.editor) {
                this.editor.setOption('fontSize', this.fontSize);
            }
        }
        
        if (settings.wordWrap !== undefined) {
            this.wordWrap = settings.wordWrap;
            if (this.editor) {
                this.editor.setOption('lineWrapping', this.wordWrap);
            }
        }
        
        if (settings.lineNumbers !== undefined) {
            this.lineNumbers = settings.lineNumbers;
            if (this.editor) {
                this.editor.setOption('lineNumbers', this.lineNumbers);
            }
        }
    }

    cleanup() {
        console.log('Code Editor cleanup');
    }
}