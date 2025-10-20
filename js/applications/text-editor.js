// Text Editor Application for Windows 11 Web OS

class TextEditorApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 800;
        this.defaultHeight = 600;
        this.minWidth = 400;
        this.minHeight = 300;
        
        this.currentFile = null;
        this.content = '';
        this.isModified = false;
        this.fontSize = 14;
        this.fontFamily = 'Consolas, Monaco, monospace';
        this.wordWrap = true;
        this.showLineNumbers = true;
        this.findDialog = null;
        this.replaceDialog = null;
        this.recentFiles = [];
        
        // Load file if provided
        if (options.filePath) {
            this.loadFileFromPath(options.filePath);
        } else if (options.fileName) {
            this.currentFile = options.fileName;
        }
    }
    
    render() {
        return `
            <div class="text-editor">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="te-new" title="New File">
                            <i class="fas fa-file"></i>
                            <span>New</span>
                        </button>
                        <button class="app-button" id="te-open" title="Open File">
                            <i class="fas fa-folder-open"></i>
                            <span>Open</span>
                        </button>
                        <button class="app-button" id="te-save" title="Save">
                            <i class="fas fa-save"></i>
                            <span>Save</span>
                        </button>
                        <button class="app-button" id="te-save-as" title="Save As">
                            <i class="fas fa-save"></i>
                            <span>Save As</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="te-undo" title="Undo" disabled>
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="app-button" id="te-redo" title="Redo" disabled>
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="te-cut" title="Cut">
                            <i class="fas fa-cut"></i>
                        </button>
                        <button class="app-button" id="te-copy" title="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="app-button" id="te-paste" title="Paste">
                            <i class="fas fa-paste"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="te-find" title="Find">
                            <i class="fas fa-search"></i>
                            <span>Find</span>
                        </button>
                        <button class="app-button" id="te-replace" title="Replace">
                            <i class="fas fa-exchange-alt"></i>
                            <span>Replace</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="te-word-wrap" title="Word Wrap" ${this.wordWrap ? 'class="active"' : ''}>
                            <i class="fas fa-align-left"></i>
                        </button>
                        <button class="app-button" id="te-line-numbers" title="Line Numbers" ${this.showLineNumbers ? 'class="active"' : ''}>
                            <i class="fas fa-list-ol"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <select class="app-select" id="te-font-size">
                            <option value="10">10px</option>
                            <option value="12">12px</option>
                            <option value="14" selected>14px</option>
                            <option value="16">16px</option>
                            <option value="18">18px</option>
                            <option value="20">20px</option>
                            <option value="24">24px</option>
                        </select>
                        <select class="app-select" id="te-font-family">
                            <option value="Consolas, Monaco, monospace" selected>Consolas</option>
                            <option value="'Courier New', monospace">Courier New</option>
                            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                        </select>
                    </div>
                </div>
                
                <div class="text-editor-content">
                    <div class="text-editor-line-numbers" id="te-line-numbers" ${!this.showLineNumbers ? 'style="display: none;"' : ''}></div>
                    <textarea 
                        class="text-editor-textarea" 
                        id="te-textarea"
                        placeholder="Start typing..."
                        spellcheck="false"
                        style="font-size: ${this.fontSize}px; font-family: ${this.fontFamily}; ${this.wordWrap ? 'white-space: pre-wrap;' : 'white-space: pre;'}"
                    ></textarea>
                </div>
                
                <div class="text-editor-status">
                    <div class="status-left">
                        <span id="te-file-status">Ready</span>
                    </div>
                    <div class="status-right">
                        <span id="te-cursor-position">Line 1, Column 1</span>
                        <span class="status-separator">|</span>
                        <span id="te-selection-info">No selection</span>
                        <span class="status-separator">|</span>
                        <span id="te-char-count">0 characters</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Get textarea
        this.textarea = content.querySelector('#te-textarea');
        this.lineNumbers = content.querySelector('#te-line-numbers');
        
        // Toolbar buttons
        content.querySelector('#te-new').addEventListener('click', () => this.newFile());
        content.querySelector('#te-open').addEventListener('click', () => this.openFile());
        content.querySelector('#te-save').addEventListener('click', () => this.saveFile());
        content.querySelector('#te-save-as').addEventListener('click', () => this.saveAsFile());
        
        content.querySelector('#te-undo').addEventListener('click', () => this.undo());
        content.querySelector('#te-redo').addEventListener('click', () => this.redo());
        
        content.querySelector('#te-cut').addEventListener('click', () => this.cut());
        content.querySelector('#te-copy').addEventListener('click', () => this.copy());
        content.querySelector('#te-paste').addEventListener('click', () => this.paste());
        
        content.querySelector('#te-find').addEventListener('click', () => this.showFindDialog());
        content.querySelector('#te-replace').addEventListener('click', () => this.showReplaceDialog());
        
        content.querySelector('#te-word-wrap').addEventListener('click', () => this.toggleWordWrap());
        content.querySelector('#te-line-numbers').addEventListener('click', () => this.toggleLineNumbers());
        
        // Font controls
        content.querySelector('#te-font-size').addEventListener('change', (e) => {
            this.fontSize = parseInt(e.target.value);
            this.updateTextareaStyle();
        });
        
        content.querySelector('#te-font-family').addEventListener('change', (e) => {
            this.fontFamily = e.target.value;
            this.updateTextareaStyle();
        });
        
        // Textarea events
        this.textarea.addEventListener('input', () => this.handleTextChange());
        this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.textarea.addEventListener('keyup', () => this.updateCursorPosition());
        this.textarea.addEventListener('click', () => this.updateCursorPosition());
        this.textarea.addEventListener('scroll', () => this.syncLineNumbers());
        
        // Prevent tab from leaving textarea
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });
        
        // Handle window close
        const windowObj = window.windowManager.getWindow(this.windowId);
        if (windowObj) {
            windowObj.options.onClose = () => this.handleClose();
        }
    }
    
    loadData() {
        if (this.options.filePath) {
            this.loadFileFromPath(this.options.filePath);
        }
        
        this.updateLineNumbers();
        this.updateCursorPosition();
        this.updateTitle();
    }
    
    loadFileFromPath(filePath) {
        if (window.fileSystem) {
            const content = window.fileSystem.readFile(filePath);
            if (content !== null) {
                this.content = content;
                this.currentFile = filePath.split(/[\\\/]/).pop();
                this.isModified = false;
                
                if (this.textarea) {
                    this.textarea.value = this.content;
                    this.updateLineNumbers();
                    this.updateCursorPosition();
                }
                
                this.updateTitle();
                this.updateFileStatus(`Opened: ${this.currentFile}`);
            }
        }
    }
    
    newFile() {
        if (this.isModified) {
            const save = confirm('Do you want to save changes to the current file?');
            if (save) {
                this.saveFile();
            }
        }
        
        this.currentFile = null;
        this.content = '';
        this.isModified = false;
        this.textarea.value = '';
        
        this.updateTitle();
        this.updateLineNumbers();
        this.updateCursorPosition();
        this.updateFileStatus('New file created');
        
        this.textarea.focus();
    }
    
    openFile() {
        // Create file picker dialog
        const dialog = document.createElement('div');
        dialog.className = 'file-picker-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 400px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            display: flex;
            flex-direction: column;
        `;
        
        dialog.innerHTML = `
            <div style="
                padding: var(--spacing-md);
                border-bottom: 1px solid var(--border-light);
                font-weight: 600;
            ">
                Open File
            </div>
            <div style="flex: 1; overflow-y: auto; padding: var(--spacing-sm);">
                <div id="file-list"></div>
            </div>
            <div style="
                padding: var(--spacing-md);
                border-top: 1px solid var(--border-light);
                display: flex;
                gap: var(--spacing-sm);
                justify-content: flex-end;
            ">
                <button class="btn btn-secondary" id="cancel-open">Cancel</button>
                <button class="btn btn-primary" id="confirm-open" disabled>Open</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Populate file list
        this.populateFileList(dialog.querySelector('#file-list'));
        
        // Handle buttons
        let selectedFile = null;
        
        dialog.querySelector('#cancel-open').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('#confirm-open').addEventListener('click', () => {
            if (selectedFile) {
                this.loadFileFromPath(selectedFile);
            }
            dialog.remove();
        });
        
        // Handle file selection
        dialog.addEventListener('click', (e) => {
            const fileItem = e.target.closest('.file-picker-item');
            if (fileItem) {
                // Clear previous selection
                dialog.querySelectorAll('.file-picker-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                fileItem.classList.add('selected');
                selectedFile = fileItem.getAttribute('data-path');
                dialog.querySelector('#confirm-open').disabled = false;
            }
        });
        
        // Handle double-click
        dialog.addEventListener('dblclick', (e) => {
            const fileItem = e.target.closest('.file-picker-item');
            if (fileItem) {
                selectedFile = fileItem.getAttribute('data-path');
                this.loadFileFromPath(selectedFile);
                dialog.remove();
            }
        });
    }
    
    populateFileList(container) {
        if (!window.fileSystem) return;
        
        // Get text files from current directory and common locations
        const locations = [
            ['C:', 'Users', 'User', 'Desktop'],
            ['C:', 'Users', 'User', 'Documents'],
            ['C:', 'Users', 'User', 'Documents', 'Code']
        ];
        
        let html = '';
        
        locations.forEach(location => {
            const items = window.fileSystem.listDirectory(location);
            const textFiles = items.filter(item => 
                item.type === 'file' && 
                ['txt', 'md', 'log', 'csv', 'json', 'xml'].includes(
                    window.fileSystem.getFileExtension(item.name)
                )
            );
            
            if (textFiles.length > 0) {
                const locationName = location[location.length - 1];
                html += `<div style="font-weight: 600; margin: var(--spacing-md) 0 var(--spacing-sm) 0;">${locationName}</div>`;
                
                textFiles.forEach(file => {
                    const filePath = window.fileSystem.getPathString([...location, file.name]);
                    html += `
                        <div class="file-picker-item" data-path="${filePath}" style="
                            display: flex;
                            align-items: center;
                            gap: var(--spacing-sm);
                            padding: var(--spacing-sm);
                            border-radius: var(--radius-sm);
                            cursor: pointer;
                            transition: background var(--transition-fast);
                        ">
                            <i class="${window.fileSystem.getFileIcon(file)}"></i>
                            <div style="flex: 1;">
                                <div style="font-weight: 500;">${file.name}</div>
                                <div style="font-size: var(--font-size-xs); color: var(--text-secondary);">
                                    ${window.fileSystem.formatFileSize(file.size)} - ${window.fileSystem.formatDate(new Date(file.modified))}
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
        });
        
        if (!html) {
            html = '<div style="text-align: center; color: var(--text-secondary); padding: var(--spacing-xl);">No text files found</div>';
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
        
        // Style selected items
        const style = document.createElement('style');
        style.textContent = `
            .file-picker-item.selected {
                background: var(--primary-blue) !important;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
    
    saveFile() {
        if (!this.currentFile) {
            this.saveAsFile();
            return;
        }
        
        if (window.fileSystem) {
            // Find the file path
            const searchResults = window.fileSystem.searchFiles(this.currentFile);
            if (searchResults.length > 0) {
                const filePath = searchResults[0].path;
                if (window.fileSystem.writeFile(filePath, this.textarea.value)) {
                    this.content = this.textarea.value;
                    this.isModified = false;
                    this.updateTitle();
                    this.updateFileStatus(`Saved: ${this.currentFile}`);
                } else {
                    alert('Failed to save file');
                }
            } else {
                this.saveAsFile();
            }
        }
    }
    
    saveAsFile() {
        const fileName = prompt('Enter file name:', this.currentFile || 'Untitled.txt');
        if (!fileName) return;
        
        if (window.fileSystem) {
            // Save to Documents folder by default
            const documentsPath = ['C:', 'Users', 'User', 'Documents'];
            
            if (window.fileSystem.createFile(fileName, this.textarea.value, documentsPath)) {
                this.currentFile = fileName;
                this.content = this.textarea.value;
                this.isModified = false;
                this.updateTitle();
                this.updateFileStatus(`Saved as: ${fileName}`);
            } else {
                alert('Failed to save file. Name may already exist.');
            }
        }
    }
    
    undo() {
        document.execCommand('undo');
        this.handleTextChange();
    }
    
    redo() {
        document.execCommand('redo');
        this.handleTextChange();
    }
    
    cut() {
        this.textarea.focus();
        document.execCommand('cut');
        this.handleTextChange();
    }
    
    copy() {
        this.textarea.focus();
        document.execCommand('copy');
    }
    
    paste() {
        this.textarea.focus();
        document.execCommand('paste');
        this.handleTextChange();
    }
    
    showFindDialog() {
        if (this.findDialog) {
            this.findDialog.remove();
        }
        
        this.findDialog = document.createElement('div');
        this.findDialog.className = 'find-dialog';
        this.findDialog.style.cssText = `
            position: absolute;
            top: 60px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-medium);
            padding: var(--spacing-md);
            z-index: 1000;
            min-width: 300px;
        `;
        
        this.findDialog.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                <input type="text" id="find-input" placeholder="Find..." class="app-input" style="flex: 1;">
                <button class="btn btn-primary" id="find-next">Find Next</button>
                <button class="btn btn-ghost" id="close-find">&times;</button>
            </div>
            <div style="display: flex; gap: var(--spacing-sm); font-size: var(--font-size-xs);">
                <label><input type="checkbox" id="match-case"> Match case</label>
                <label><input type="checkbox" id="whole-word"> Whole word</label>
            </div>
        `;
        
        this.getWindowElement().appendChild(this.findDialog);
        
        const findInput = this.findDialog.querySelector('#find-input');
        const findNext = this.findDialog.querySelector('#find-next');
        const closeFind = this.findDialog.querySelector('#close-find');
        
        findInput.focus();
        
        findNext.addEventListener('click', () => this.findNext(findInput.value));
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.findNext(findInput.value);
            } else if (e.key === 'Escape') {
                this.findDialog.remove();
                this.findDialog = null;
            }
        });
        
        closeFind.addEventListener('click', () => {
            this.findDialog.remove();
            this.findDialog = null;
        });
    }
    
    showReplaceDialog() {
        if (this.replaceDialog) {
            this.replaceDialog.remove();
        }
        
        this.replaceDialog = document.createElement('div');
        this.replaceDialog.className = 'replace-dialog';
        this.replaceDialog.style.cssText = `
            position: absolute;
            top: 60px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-medium);
            padding: var(--spacing-md);
            z-index: 1000;
            min-width: 350px;
        `;
        
        this.replaceDialog.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                <input type="text" id="replace-find-input" placeholder="Find..." class="app-input" style="flex: 1;">
                <button class="btn btn-primary" id="replace-find-next">Find Next</button>
                <button class="btn btn-ghost" id="close-replace">&times;</button>
            </div>
            <div style="display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                <input type="text" id="replace-with-input" placeholder="Replace with..." class="app-input" style="flex: 1;">
                <button class="btn btn-secondary" id="replace-one">Replace</button>
            </div>
            <div style="display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
                <button class="btn btn-secondary" id="replace-all">Replace All</button>
            </div>
            <div style="display: flex; gap: var(--spacing-sm); font-size: var(--font-size-xs);">
                <label><input type="checkbox" id="replace-match-case"> Match case</label>
                <label><input type="checkbox" id="replace-whole-word"> Whole word</label>
            </div>
        `;
        
        this.getWindowElement().appendChild(this.replaceDialog);
        
        const findInput = this.replaceDialog.querySelector('#replace-find-input');
        const replaceInput = this.replaceDialog.querySelector('#replace-with-input');
        const findNext = this.replaceDialog.querySelector('#replace-find-next');
        const replaceOne = this.replaceDialog.querySelector('#replace-one');
        const replaceAll = this.replaceDialog.querySelector('#replace-all');
        const closeReplace = this.replaceDialog.querySelector('#close-replace');
        
        findInput.focus();
        
        findNext.addEventListener('click', () => this.findNext(findInput.value));
        replaceOne.addEventListener('click', () => this.replaceOne(findInput.value, replaceInput.value));
        replaceAll.addEventListener('click', () => this.replaceAll(findInput.value, replaceInput.value));
        
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.findNext(findInput.value);
            } else if (e.key === 'Escape') {
                this.replaceDialog.remove();
                this.replaceDialog = null;
            }
        });
        
        closeReplace.addEventListener('click', () => {
            this.replaceDialog.remove();
            this.replaceDialog = null;
        });
    }
    
    findNext(searchText) {
        if (!searchText) return;
        
        const text = this.textarea.value;
        const currentPos = this.textarea.selectionStart;
        
        let searchIndex = text.toLowerCase().indexOf(searchText.toLowerCase(), currentPos);
        
        if (searchIndex === -1) {
            // Search from beginning
            searchIndex = text.toLowerCase().indexOf(searchText.toLowerCase(), 0);
        }
        
        if (searchIndex !== -1) {
            this.textarea.focus();
            this.textarea.setSelectionRange(searchIndex, searchIndex + searchText.length);
            this.updateFileStatus(`Found: ${searchText}`);
        } else {
            this.updateFileStatus(`Not found: ${searchText}`);
        }
    }
    
    replaceOne(findText, replaceText) {
        if (!findText) return;
        
        const selectedText = this.textarea.value.substring(
            this.textarea.selectionStart,
            this.textarea.selectionEnd
        );
        
        if (selectedText.toLowerCase() === findText.toLowerCase()) {
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;
            
            this.textarea.value = 
                this.textarea.value.substring(0, start) +
                replaceText +
                this.textarea.value.substring(end);
            
            this.textarea.setSelectionRange(start, start + replaceText.length);
            this.handleTextChange();
            this.updateFileStatus(`Replaced: ${findText}`);
        } else {
            this.findNext(findText);
        }
    }
    
    replaceAll(findText, replaceText) {
        if (!findText) return;
        
        const originalText = this.textarea.value;
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const newText = originalText.replace(regex, replaceText);
        
        if (newText !== originalText) {
            this.textarea.value = newText;
            this.handleTextChange();
            
            const count = (originalText.match(regex) || []).length;
            this.updateFileStatus(`Replaced ${count} occurrence(s)`);
        } else {
            this.updateFileStatus(`No occurrences found`);
        }
    }
    
    toggleWordWrap() {
        this.wordWrap = !this.wordWrap;
        this.updateTextareaStyle();
        
        const button = this.getContentElement().querySelector('#te-word-wrap');
        if (this.wordWrap) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
    
    toggleLineNumbers() {
        this.showLineNumbers = !this.showLineNumbers;
        
        const lineNumbers = this.getContentElement().querySelector('#te-line-numbers');
        const button = this.getContentElement().querySelector('#te-line-numbers');
        
        if (this.showLineNumbers) {
            lineNumbers.style.display = 'block';
            button.classList.add('active');
        } else {
            lineNumbers.style.display = 'none';
            button.classList.remove('active');
        }
        
        this.updateLineNumbers();
    }
    
    updateTextareaStyle() {
        this.textarea.style.fontSize = this.fontSize + 'px';
        this.textarea.style.fontFamily = this.fontFamily;
        this.textarea.style.whiteSpace = this.wordWrap ? 'pre-wrap' : 'pre';
        
        if (this.lineNumbers) {
            this.lineNumbers.style.fontSize = this.fontSize + 'px';
            this.lineNumbers.style.fontFamily = this.fontFamily;
        }
    }
    
    handleTextChange() {
        this.isModified = true;
        this.updateTitle();
        this.updateLineNumbers();
        this.updateCharacterCount();
        
        // Update undo/redo buttons (simplified)
        const undoBtn = this.getContentElement().querySelector('#te-undo');
        const redoBtn = this.getContentElement().querySelector('#te-redo');
        
        // These would need proper undo/redo stack implementation
        undoBtn.disabled = false;
        redoBtn.disabled = false;
    }
    
    handleKeyDown(event) {
        // Ctrl+S - Save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.saveFile();
        }
        
        // Ctrl+O - Open
        if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
            event.preventDefault();
            this.openFile();
        }
        
        // Ctrl+N - New
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.newFile();
        }
        
        // Ctrl+F - Find
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            this.showFindDialog();
        }
        
        // Ctrl+H - Replace
        if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
            event.preventDefault();
            this.showReplaceDialog();
        }
        
        // F3 - Find Next
        if (event.key === 'F3') {
            event.preventDefault();
            if (this.findDialog) {
                const findInput = this.findDialog.querySelector('#find-input');
                this.findNext(findInput.value);
            }
        }
    }
    
    insertTab() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        
        this.textarea.value = 
            this.textarea.value.substring(0, start) +
            '\t' +
            this.textarea.value.substring(end);
        
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
        this.handleTextChange();
    }
    
    updateLineNumbers() {
        if (!this.showLineNumbers || !this.lineNumbers) return;
        
        const lines = this.textarea.value.split('\n');
        const lineCount = lines.length;
        
        let html = '';
        for (let i = 1; i <= lineCount; i++) {
            html += i + '\n';
        }
        
        this.lineNumbers.textContent = html;
    }
    
    syncLineNumbers() {
        if (!this.showLineNumbers || !this.lineNumbers) return;
        
        this.lineNumbers.scrollTop = this.textarea.scrollTop;
    }
    
    updateCursorPosition() {
        const text = this.textarea.value;
        const cursorPos = this.textarea.selectionStart;
        const selectionEnd = this.textarea.selectionEnd;
        
        // Calculate line and column
        const textBeforeCursor = text.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        // Update cursor position display
        const cursorDisplay = this.getContentElement().querySelector('#te-cursor-position');
        cursorDisplay.textContent = `Line ${line}, Column ${column}`;
        
        // Update selection info
        const selectionDisplay = this.getContentElement().querySelector('#te-selection-info');
        if (cursorPos !== selectionEnd) {
            const selectedLength = selectionEnd - cursorPos;
            selectionDisplay.textContent = `${selectedLength} characters selected`;
        } else {
            selectionDisplay.textContent = 'No selection';
        }
    }
    
    updateCharacterCount() {
        const charCount = this.textarea.value.length;
        const charDisplay = this.getContentElement().querySelector('#te-char-count');
        charDisplay.textContent = `${charCount} characters`;
    }
    
    updateTitle() {
        const title = this.currentFile 
            ? `${this.currentFile}${this.isModified ? ' *' : ''} - Text Editor`
            : `Untitled${this.isModified ? ' *' : ''} - Text Editor`;
        
        this.updateTitle(title);
    }
    
    updateFileStatus(message) {
        const statusDisplay = this.getContentElement().querySelector('#te-file-status');
        statusDisplay.textContent = message;
        
        if (message !== 'Ready') {
            setTimeout(() => {
                statusDisplay.textContent = 'Ready';
            }, 3000);
        }
    }
    
    handleClose() {
        if (this.isModified) {
            const save = confirm('Do you want to save changes before closing?');
            if (save) {
                this.saveFile();
            }
        }
        
        // Clean up dialogs
        if (this.findDialog) {
            this.findDialog.remove();
        }
        if (this.replaceDialog) {
            this.replaceDialog.remove();
        }
        
        return true; // Allow close
    }
    
    cleanup() {
        super.cleanup();
        
        // Clean up dialogs
        if (this.findDialog) {
            this.findDialog.remove();
        }
        if (this.replaceDialog) {
            this.replaceDialog.remove();
        }
    }
}

// Register the application
window.TextEditorApp = TextEditorApp;