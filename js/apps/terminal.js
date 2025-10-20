// Terminal Application
class TerminalApp {
    constructor() {
        this.name = 'Terminal';
        this.icon = '⚡';
        this.history = [];
        this.historyIndex = -1;
        this.currentPath = '/';
        this.prompt = '$';
        this.commands = {};
        this.pythonEnabled = true;
        this.initCommands();
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="app-toolbar">
                    <button class="toolbar-button" id="new-tab-btn" title="New Tab">+</button>
                    <button class="toolbar-button" id="clear-btn" title="Clear">🗑️</button>
                    <button class="toolbar-button" id="copy-btn" title="Copy">📋</button>
                    <button class="toolbar-button" id="paste-btn" title="Paste">📄</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="python-btn" title="Python Interpreter">🐍</button>
                    <button class="toolbar-button" id="settings-btn" title="Settings">⚙️</button>
                </div>
                <div class="terminal" id="terminal">
                    <div class="terminal-line">
                        <span class="terminal-prompt">${this.prompt}</span>
                        <span class="terminal-path">${this.currentPath}</span>
                        <span class="terminal-cursor">█</span>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.terminal = this.container.querySelector('#terminal');
        this.setupEventListeners();
        this.printWelcomeMessage();
    }

    setupEventListeners() {
        // Toolbar buttons
        this.container.querySelector('#new-tab-btn').addEventListener('click', () => this.newTab());
        this.container.querySelector('#clear-btn').addEventListener('click', () => this.clear());
        this.container.querySelector('#copy-btn').addEventListener('click', () => this.copy());
        this.container.querySelector('#paste-btn').addEventListener('click', () => this.paste());
        this.container.querySelector('#python-btn').addEventListener('click', () => this.togglePython());
        this.container.querySelector('#settings-btn').addEventListener('click', () => this.showSettings());

        // Terminal input
        this.container.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.container.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.container.addEventListener('click', () => this.focusInput());
    }

    initCommands() {
        this.commands = {
            'help': this.helpCommand.bind(this),
            'clear': this.clearCommand.bind(this),
            'ls': this.lsCommand.bind(this),
            'dir': this.lsCommand.bind(this),
            'cd': this.cdCommand.bind(this),
            'pwd': this.pwdCommand.bind(this),
            'mkdir': this.mkdirCommand.bind(this),
            'rmdir': this.rmdirCommand.bind(this),
            'rm': this.rmCommand.bind(this),
            'cat': this.catCommand.bind(this),
            'echo': this.echoCommand.bind(this),
            'date': this.dateCommand.bind(this),
            'whoami': this.whoamiCommand.bind(this),
            'python': this.pythonCommand.bind(this),
            'pip': this.pipCommand.bind(this),
            'node': this.nodeCommand.bind(this),
            'npm': this.npmCommand.bind(this),
            'git': this.gitCommand.bind(this),
            'code': this.codeCommand.bind(this),
            'browser': this.browserCommand.bind(this),
            'calc': this.calcCommand.bind(this),
            'history': this.historyCommand.bind(this),
            'exit': this.exitCommand.bind(this)
        };
    }

    printWelcomeMessage() {
        this.printLine('Welcome to WebOS Terminal!');
        this.printLine('Type "help" for available commands.');
        this.printLine('Python support is enabled. Type "python" to start Python interpreter.');
        this.printLine('');
        this.printPrompt();
    }

    printPrompt() {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `
            <span class="terminal-prompt">${this.prompt}</span>
            <span class="terminal-path">${this.currentPath}</span>
            <span class="terminal-cursor">█</span>
        `;
        this.terminal.appendChild(line);
        this.scrollToBottom();
    }

    printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.terminal.appendChild(line);
        this.scrollToBottom();
    }

    printError(text) {
        this.printLine(`Error: ${text}`, 'error');
    }

    printSuccess(text) {
        this.printLine(text, 'success');
    }

    scrollToBottom() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        } else if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            this.printLine('^C');
            this.printPrompt();
        }
    }

    handleKeyPress(e) {
        // Handle character input
        if (e.key.length === 1) {
            this.addToCurrentLine(e.key);
        }
    }

    addToCurrentLine(char) {
        const lastLine = this.terminal.lastElementChild;
        if (lastLine && lastLine.classList.contains('terminal-line')) {
            const cursor = lastLine.querySelector('.terminal-cursor');
            if (cursor) {
                cursor.insertAdjacentText('beforebegin', char);
            }
        }
    }

    executeCommand() {
        const lastLine = this.terminal.lastElementChild;
        if (!lastLine) return;

        const commandText = lastLine.textContent
            .replace(this.prompt, '')
            .replace(this.currentPath, '')
            .replace('█', '')
            .trim();

        if (commandText) {
            this.history.push(commandText);
            this.historyIndex = this.history.length;
        }

        // Remove cursor from current line
        const cursor = lastLine.querySelector('.terminal-cursor');
        if (cursor) {
            cursor.remove();
        }

        // Execute command
        this.runCommand(commandText);
        this.printPrompt();
    }

    runCommand(commandText) {
        if (!commandText) return;

        const parts = commandText.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (this.commands[command]) {
            try {
                this.commands[command](args);
            } catch (error) {
                this.printError(error.message);
            }
        } else {
            this.printError(`Command not found: ${command}. Type "help" for available commands.`);
        }
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        this.historyIndex += direction;
        this.historyIndex = Math.max(0, Math.min(this.historyIndex, this.history.length));

        if (this.historyIndex < this.history.length) {
            const command = this.history[this.historyIndex];
            this.replaceCurrentLine(command);
        }
    }

    replaceCurrentLine(text) {
        const lastLine = this.terminal.lastElementChild;
        if (lastLine) {
            lastLine.innerHTML = `
                <span class="terminal-prompt">${this.prompt}</span>
                <span class="terminal-path">${this.currentPath}</span>
                <span class="terminal-cursor">█</span>
            `;
            this.addToCurrentLine(text);
        }
    }

    autoComplete() {
        const lastLine = this.terminal.lastElementChild;
        if (!lastLine) return;

        const commandText = lastLine.textContent
            .replace(this.prompt, '')
            .replace(this.currentPath, '')
            .replace('█', '')
            .trim();

        const commands = Object.keys(this.commands);
        const matches = commands.filter(cmd => cmd.startsWith(commandText));

        if (matches.length === 1) {
            this.replaceCurrentLine(matches[0]);
        } else if (matches.length > 1) {
            this.printLine(matches.join(' '));
        }
    }

    // Command implementations
    helpCommand(args) {
        this.printLine('Available commands:');
        this.printLine('  help, clear, ls/dir, cd, pwd, mkdir, rmdir, rm');
        this.printLine('  cat, echo, date, whoami, history');
        this.printLine('  python, pip, node, npm, git');
        this.printLine('  code, browser, calc, exit');
        this.printLine('');
        this.printLine('Use Tab for auto-completion and arrow keys for command history.');
    }

    clearCommand(args) {
        this.clear();
    }

    lsCommand(args) {
        const files = [
            'Desktop/',
            'Documents/',
            'Downloads/',
            'Pictures/',
            'Music/',
            'Videos/',
            'README.txt',
            'config.json'
        ];
        
        files.forEach(file => {
            this.printLine(file);
        });
    }

    cdCommand(args) {
        if (args.length === 0) {
            this.currentPath = '/';
            this.printLine('/');
        } else {
            const newPath = args[0];
            if (newPath === '..') {
                const parts = this.currentPath.split('/').filter(p => p);
                parts.pop();
                this.currentPath = '/' + parts.join('/');
            } else if (newPath.startsWith('/')) {
                this.currentPath = newPath;
            } else {
                this.currentPath = this.currentPath + '/' + newPath;
            }
            this.printLine(this.currentPath);
        }
    }

    pwdCommand(args) {
        this.printLine(this.currentPath);
    }

    mkdirCommand(args) {
        if (args.length === 0) {
            this.printError('mkdir: missing operand');
        } else {
            args.forEach(dir => {
                this.printSuccess(`Created directory: ${dir}`);
            });
        }
    }

    rmdirCommand(args) {
        if (args.length === 0) {
            this.printError('rmdir: missing operand');
        } else {
            args.forEach(dir => {
                this.printSuccess(`Removed directory: ${dir}`);
            });
        }
    }

    rmCommand(args) {
        if (args.length === 0) {
            this.printError('rm: missing operand');
        } else {
            args.forEach(file => {
                this.printSuccess(`Removed file: ${file}`);
            });
        }
    }

    catCommand(args) {
        if (args.length === 0) {
            this.printError('cat: missing operand');
        } else {
            args.forEach(file => {
                this.printLine(`Contents of ${file}:`);
                this.printLine('This is a sample file content.');
                this.printLine('Line 2 of the file.');
                this.printLine('Line 3 of the file.');
            });
        }
    }

    echoCommand(args) {
        this.printLine(args.join(' '));
    }

    dateCommand(args) {
        const now = new Date();
        this.printLine(now.toString());
    }

    whoamiCommand(args) {
        this.printLine('webos-user');
    }

    pythonCommand(args) {
        if (this.pythonEnabled) {
            this.printLine('Python 3.9.0 (WebOS Terminal)');
            this.printLine('Type "help", "copyright", "credits" or "license" for more information.');
            this.printLine('Type "exit()" to exit Python interpreter.');
            this.printLine('');
            this.printLine('>>> ', 'python-prompt');
        } else {
            this.printError('Python is not enabled. Click the Python button to enable it.');
        }
    }

    pipCommand(args) {
        if (args.length === 0) {
            this.printLine('pip 21.0.1 from /usr/lib/python3/dist-packages/pip (python 3.9)');
            this.printLine('Usage: pip <command> [options]');
            this.printLine('');
            this.printLine('Commands:');
            this.printLine('  install                     Install packages');
            this.printLine('  uninstall                   Uninstall packages');
            this.printLine('  list                        List installed packages');
            this.printLine('  show                        Show information about installed packages');
        } else {
            this.printLine(`pip ${args.join(' ')} - Command executed`);
        }
    }

    nodeCommand(args) {
        this.printLine('Node.js v16.0.0 (WebOS Terminal)');
        this.printLine('Type ".help" for more information.');
        this.printLine('> ', 'node-prompt');
    }

    npmCommand(args) {
        if (args.length === 0) {
            this.printLine('npm 7.0.0');
            this.printLine('Usage: npm <command>');
            this.printLine('');
            this.printLine('Commands:');
            this.printLine('  install                     Install packages');
            this.printLine('  uninstall                   Uninstall packages');
            this.printLine('  list                        List installed packages');
            this.printLine('  run                         Run scripts');
        } else {
            this.printLine(`npm ${args.join(' ')} - Command executed`);
        }
    }

    gitCommand(args) {
        if (args.length === 0) {
            this.printLine('git version 2.30.0');
            this.printLine('usage: git [--version] [--help] [-C <path>] [-c name=value]');
        } else {
            this.printLine(`git ${args.join(' ')} - Command executed`);
        }
    }

    codeCommand(args) {
        if (args.length === 0) {
            this.printError('code: missing operand');
        } else {
            args.forEach(file => {
                this.printSuccess(`Opening ${file} in code editor...`);
                // In a real implementation, this would open the file in the code editor
            });
        }
    }

    browserCommand(args) {
        if (args.length === 0) {
            this.printSuccess('Opening browser...');
            if (window.webOS) {
                window.webOS.openApp('browser');
            }
        } else {
            const url = args[0];
            this.printSuccess(`Opening ${url} in browser...`);
            if (window.webOS) {
                window.webOS.openApp('browser');
            }
        }
    }

    calcCommand(args) {
        if (args.length === 0) {
            this.printError('calc: missing expression');
        } else {
            try {
                const expression = args.join(' ');
                const result = eval(expression);
                this.printLine(`${expression} = ${result}`);
            } catch (error) {
                this.printError('Invalid expression');
            }
        }
    }

    historyCommand(args) {
        if (this.history.length === 0) {
            this.printLine('No commands in history');
        } else {
            this.history.forEach((cmd, index) => {
                this.printLine(`${index + 1}  ${cmd}`);
            });
        }
    }

    exitCommand(args) {
        this.printLine('Goodbye!');
        // In a real implementation, this would close the terminal
    }

    // Utility methods
    newTab() {
        this.printLine('New tab functionality would be implemented here');
    }

    clear() {
        this.terminal.innerHTML = '';
        this.printPrompt();
    }

    copy() {
        const selection = window.getSelection();
        if (selection.toString()) {
            navigator.clipboard.writeText(selection.toString());
            this.printSuccess('Copied to clipboard');
        }
    }

    paste() {
        navigator.clipboard.readText().then(text => {
            this.addToCurrentLine(text);
        });
    }

    togglePython() {
        this.pythonEnabled = !this.pythonEnabled;
        const btn = this.container.querySelector('#python-btn');
        btn.style.backgroundColor = this.pythonEnabled ? '#107C10' : '#666';
        this.printSuccess(`Python ${this.pythonEnabled ? 'enabled' : 'disabled'}`);
    }

    showSettings() {
        this.printLine('Terminal Settings:');
        this.printLine('  Python: ' + (this.pythonEnabled ? 'Enabled' : 'Disabled'));
        this.printLine('  Current Path: ' + this.currentPath);
        this.printLine('  History: ' + this.history.length + ' commands');
    }

    focusInput() {
        // Focus the terminal for input
        this.container.focus();
    }

    cleanup() {
        console.log('Terminal cleanup');
    }
}