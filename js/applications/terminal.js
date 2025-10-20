// Terminal Application for Windows 11 Web OS with Python Support

class TerminalApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 800;
        this.defaultHeight = 500;
        this.minWidth = 400;
        this.minHeight = 300;
        
        this.currentDirectory = ['C:', 'Users', 'User'];
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentCommand = '';
        this.pythonInterpreter = null;
        this.pythonMode = false;
        this.pythonVariables = {};
        this.environmentVariables = {
            'PATH': 'C:\\Windows\\System32;C:\\Python39;C:\\Python39\\Scripts',
            'PYTHONPATH': 'C:\\Python39\\Lib',
            'USER': 'User',
            'COMPUTERNAME': 'WINDOWS-11-WEB-OS',
            'OS': 'Windows_NT'
        };
        
        this.initializePythonEnvironment();
    }
    
    render() {
        return `
            <div class="terminal">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="term-clear" title="Clear Terminal">
                            <i class="fas fa-broom"></i>
                            <span>Clear</span>
                        </button>
                        <button class="app-button" id="term-copy" title="Copy Selection">
                            <i class="fas fa-copy"></i>
                            <span>Copy</span>
                        </button>
                        <button class="app-button" id="term-paste" title="Paste">
                            <i class="fas fa-paste"></i>
                            <span>Paste</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="term-python" title="Python Mode" ${this.pythonMode ? 'class="active"' : ''}>
                            <i class="fab fa-python"></i>
                            <span>Python</span>
                        </button>
                        <button class="app-button" id="term-cmd" title="Command Mode" ${!this.pythonMode ? 'class="active"' : ''}>
                            <i class="fas fa-terminal"></i>
                            <span>CMD</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <select class="app-select" id="term-font-size">
                            <option value="12">12px</option>
                            <option value="14" selected>14px</option>
                            <option value="16">16px</option>
                            <option value="18">18px</option>
                            <option value="20">20px</option>
                        </select>
                        <select class="app-select" id="term-theme">
                            <option value="dark" selected>Dark</option>
                            <option value="light">Light</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                        </select>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <span id="term-status" style="font-size: var(--font-size-xs); color: var(--text-secondary);">
                            Ready
                        </span>
                    </div>
                </div>
                
                <div class="terminal-content" id="term-content">
                    <div class="terminal-output" id="term-output">
                        <div class="terminal-line">
                            <span class="terminal-info">Windows 11 Web OS Terminal [Version 1.0.0]</span>
                        </div>
                        <div class="terminal-line">
                            <span class="terminal-info">(c) 2024 Windows 11 Web OS. All rights reserved.</span>
                        </div>
                        <div class="terminal-line">
                            <span class="terminal-info">Type 'help' for available commands or 'python' to start Python interpreter.</span>
                        </div>
                        <div class="terminal-line"></div>
                    </div>
                    
                    <div class="terminal-input-line" id="term-input-line">
                        <span class="terminal-prompt" id="term-prompt">${this.getPrompt()}</span>
                        <input type="text" class="terminal-input" id="term-input" autocomplete="off" spellcheck="false">
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        this.terminalOutput = content.querySelector('#term-output');
        this.terminalInput = content.querySelector('#term-input');
        this.terminalPrompt = content.querySelector('#term-prompt');
        
        // Toolbar buttons
        content.querySelector('#term-clear').addEventListener('click', () => this.clearTerminal());
        content.querySelector('#term-copy').addEventListener('click', () => this.copySelection());
        content.querySelector('#term-paste').addEventListener('click', () => this.pasteText());
        
        content.querySelector('#term-python').addEventListener('click', () => this.enterPythonMode());
        content.querySelector('#term-cmd').addEventListener('click', () => this.exitPythonMode());
        
        // Settings
        content.querySelector('#term-font-size').addEventListener('change', (e) => {
            this.setFontSize(parseInt(e.target.value));
        });
        
        content.querySelector('#term-theme').addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
        
        // Terminal input
        this.terminalInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.terminalInput.addEventListener('input', (e) => this.handleInput(e));
        
        // Focus management
        content.addEventListener('click', () => this.terminalInput.focus());
        
        // Prevent context menu
        content.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Set initial theme
        this.setTheme('dark');
    }
    
    loadData() {
        this.terminalInput.focus();
        this.addWelcomeMessage();
    }
    
    initializePythonEnvironment() {
        // Initialize a simple Python interpreter simulation
        this.pythonInterpreter = {
            globals: {
                '__builtins__': {
                    'print': (...args) => {
                        const output = args.map(arg => 
                            typeof arg === 'string' ? arg : JSON.stringify(arg)
                        ).join(' ');
                        this.addOutput(output, 'python-output');
                    },
                    'len': (obj) => {
                        if (typeof obj === 'string' || Array.isArray(obj)) {
                            return obj.length;
                        }
                        return 0;
                    },
                    'type': (obj) => {
                        return typeof obj;
                    },
                    'str': (obj) => String(obj),
                    'int': (obj) => parseInt(obj),
                    'float': (obj) => parseFloat(obj),
                    'list': (...args) => Array.from(args),
                    'dict': (obj) => obj || {},
                    'range': (start, end, step = 1) => {
                        const result = [];
                        if (end === undefined) {
                            end = start;
                            start = 0;
                        }
                        for (let i = start; i < end; i += step) {
                            result.push(i);
                        }
                        return result;
                    },
                    'sum': (arr) => arr.reduce((a, b) => a + b, 0),
                    'max': (arr) => Math.max(...arr),
                    'min': (arr) => Math.min(...arr),
                    'abs': (n) => Math.abs(n),
                    'round': (n, digits = 0) => Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits)
                },
                'math': {
                    'pi': Math.PI,
                    'e': Math.E,
                    'sqrt': Math.sqrt,
                    'pow': Math.pow,
                    'sin': Math.sin,
                    'cos': Math.cos,
                    'tan': Math.tan,
                    'floor': Math.floor,
                    'ceil': Math.ceil
                },
                'os': {
                    'getcwd': () => window.fileSystem.getPathString(this.currentDirectory),
                    'listdir': (path) => {
                        const items = window.fileSystem.listDirectory(path || this.currentDirectory);
                        return items.map(item => item.name);
                    },
                    'path': {
                        'join': (...paths) => paths.join('\\'),
                        'exists': (path) => {
                            return window.fileSystem.getItem(path) !== null;
                        }
                    }
                },
                'sys': {
                    'version': '3.9.0 (Web OS Simulation)',
                    'platform': 'web-os',
                    'exit': () => {
                        this.addOutput('Exiting Python...', 'python-output');
                        this.exitPythonMode();
                    }
                }
            }
        };
    }
    
    addWelcomeMessage() {
        // Add initial prompt
        this.addPromptLine();
    }
    
    getPrompt() {
        if (this.pythonMode) {
            return '>>> ';
        } else {
            const path = window.fileSystem.getPathString(this.currentDirectory);
            return `${path}> `;
        }
    }
    
    updatePrompt() {
        this.terminalPrompt.textContent = this.getPrompt();
    }
    
    handleKeyDown(event) {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                this.executeCommand();
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                this.navigateHistory(-1);
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                this.navigateHistory(1);
                break;
                
            case 'Tab':
                event.preventDefault();
                this.handleTabCompletion();
                break;
                
            case 'c':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.handleCtrlC();
                }
                break;
                
            case 'l':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.clearTerminal();
                }
                break;
        }
    }
    
    handleInput(event) {
        this.currentCommand = event.target.value;
    }
    
    executeCommand() {
        const command = this.terminalInput.value.trim();
        if (!command) {
            this.addPromptLine();
            return;
        }
        
        // Add command to output
        this.addCommandLine(command);
        
        // Add to history
        this.commandHistory.push(command);
        if (this.commandHistory.length > 100) {
            this.commandHistory.shift();
        }
        this.historyIndex = this.commandHistory.length;
        
        // Clear input
        this.terminalInput.value = '';
        this.currentCommand = '';
        
        // Execute command
        if (this.pythonMode) {
            this.executePythonCommand(command);
        } else {
            this.executeSystemCommand(command);
        }
    }
    
    executeSystemCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
                
            case 'dir':
            case 'ls':
                this.listDirectory(args[0]);
                break;
                
            case 'cd':
                this.changeDirectory(args[0]);
                break;
                
            case 'pwd':
                this.printWorkingDirectory();
                break;
                
            case 'mkdir':
                this.makeDirectory(args[0]);
                break;
                
            case 'rmdir':
                this.removeDirectory(args[0]);
                break;
                
            case 'del':
            case 'rm':
                this.deleteFile(args[0]);
                break;
                
            case 'copy':
            case 'cp':
                this.copyFile(args[0], args[1]);
                break;
                
            case 'move':
            case 'mv':
                this.moveFile(args[0], args[1]);
                break;
                
            case 'type':
            case 'cat':
                this.showFileContent(args[0]);
                break;
                
            case 'echo':
                this.echoText(args.join(' '));
                break;
                
            case 'cls':
            case 'clear':
                this.clearTerminal();
                return; // Don't add new prompt
                
            case 'date':
                this.showDate();
                break;
                
            case 'time':
                this.showTime();
                break;
                
            case 'ver':
            case 'version':
                this.showVersion();
                break;
                
            case 'python':
            case 'python3':
                this.enterPythonMode();
                return; // Don't add new prompt
                
            case 'exit':
                this.handleExit();
                return;
                
            case 'env':
                this.showEnvironmentVariables();
                break;
                
            case 'set':
                this.setEnvironmentVariable(args.join(' '));
                break;
                
            case 'whoami':
                this.addOutput(this.environmentVariables.USER);
                break;
                
            case 'hostname':
                this.addOutput(this.environmentVariables.COMPUTERNAME);
                break;
                
            case 'ping':
                this.pingHost(args[0]);
                break;
                
            case 'ipconfig':
                this.showNetworkConfig();
                break;
                
            case 'tasklist':
                this.showRunningTasks();
                break;
                
            default:
                this.addOutput(`'${cmd}' is not recognized as an internal or external command.`, 'error');
                break;
        }
        
        this.addPromptLine();
    }
    
    executePythonCommand(command) {
        try {
            // Handle special Python commands
            if (command === 'exit()' || command === 'quit()') {
                this.exitPythonMode();
                return;
            }
            
            if (command === 'help()') {
                this.showPythonHelp();
                this.addPythonPrompt();
                return;
            }
            
            // Simple Python expression evaluation
            const result = this.evaluatePythonExpression(command);
            
            if (result !== undefined && result !== null) {
                this.addOutput(String(result), 'python-result');
            }
            
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
        
        this.addPythonPrompt();
    }
    
    evaluatePythonExpression(expression) {
        // Simple Python-like expression evaluator
        // This is a basic implementation for demonstration
        
        try {
            // Handle variable assignments
            if (expression.includes('=') && !expression.includes('==')) {
                const [varName, varValue] = expression.split('=').map(s => s.trim());
                const value = this.evaluateValue(varValue);
                this.pythonVariables[varName] = value;
                return undefined;
            }
            
            // Handle print statements
            if (expression.startsWith('print(') && expression.endsWith(')')) {
                const content = expression.slice(6, -1);
                const value = this.evaluateValue(content);
                this.addOutput(String(value), 'python-output');
                return undefined;
            }
            
            // Handle imports
            if (expression.startsWith('import ')) {
                const moduleName = expression.split(' ')[1];
                this.addOutput(`Module '${moduleName}' imported (simulated)`, 'python-output');
                return undefined;
            }
            
            // Handle for loops (basic)
            if (expression.startsWith('for ')) {
                this.addOutput('For loops not fully implemented in this simulation', 'python-output');
                return undefined;
            }
            
            // Handle if statements (basic)
            if (expression.startsWith('if ')) {
                this.addOutput('If statements not fully implemented in this simulation', 'python-output');
                return undefined;
            }
            
            // Evaluate expressions
            return this.evaluateValue(expression);
            
        } catch (error) {
            throw new Error(`Invalid syntax: ${error.message}`);
        }
    }
    
    evaluateValue(expression) {
        // Replace Python variables
        let expr = expression;
        for (const [varName, varValue] of Object.entries(this.pythonVariables)) {
            expr = expr.replace(new RegExp(`\\b${varName}\\b`, 'g'), JSON.stringify(varValue));
        }
        
        // Handle Python functions
        expr = expr.replace(/len\(([^)]+)\)/g, (match, arg) => {
            const value = this.evaluateValue(arg);
            return this.pythonInterpreter.globals.__builtins__.len(value);
        });
        
        expr = expr.replace(/range\(([^)]+)\)/g, (match, args) => {
            const argValues = args.split(',').map(arg => parseInt(this.evaluateValue(arg.trim())));
            return JSON.stringify(this.pythonInterpreter.globals.__builtins__.range(...argValues));
        });
        
        // Handle list comprehensions (basic)
        if (expr.includes('[') && expr.includes('for') && expr.includes('in')) {
            this.addOutput('List comprehensions not fully implemented', 'python-output');
            return [];
        }
        
        // Handle string literals
        if ((expr.startsWith('"') && expr.endsWith('"')) || 
            (expr.startsWith("'") && expr.endsWith("'"))) {
            return expr.slice(1, -1);
        }
        
        // Handle lists
        if (expr.startsWith('[') && expr.endsWith(']')) {
            try {
                return JSON.parse(expr);
            } catch {
                return [];
            }
        }
        
        // Handle mathematical expressions
        try {
            // Simple math evaluation (be careful with eval in real applications)
            const mathExpr = expr.replace(/\*\*/g, '**'); // Python power operator
            return Function(`"use strict"; return (${mathExpr})`)();
        } catch {
            // If it's not a valid expression, return as string
            return expr;
        }
    }
    
    showHelp() {
        const helpText = `
Available Commands:

File System:
  dir, ls          - List directory contents
  cd <path>        - Change directory
  pwd              - Print working directory
  mkdir <name>     - Create directory
  rmdir <name>     - Remove directory
  del, rm <file>   - Delete file
  copy, cp <src> <dst> - Copy file
  move, mv <src> <dst> - Move file
  type, cat <file> - Show file content

System:
  cls, clear       - Clear terminal
  date             - Show current date
  time             - Show current time
  ver, version     - Show version info
  env              - Show environment variables
  set <var>=<val>  - Set environment variable
  whoami           - Show current user
  hostname         - Show computer name
  ping <host>      - Ping a host
  ipconfig         - Show network configuration
  tasklist         - Show running tasks

Python:
  python, python3  - Enter Python mode
  
Other:
  echo <text>      - Display text
  help             - Show this help
  exit             - Close terminal
        `.trim();
        
        this.addOutput(helpText, 'help');
    }
    
    showPythonHelp() {
        const helpText = `
Python 3.9.0 (Web OS Simulation)

Available built-in functions:
  print(), len(), type(), str(), int(), float()
  list(), dict(), range(), sum(), max(), min()
  abs(), round()

Available modules:
  math - Mathematical functions
  os   - Operating system interface
  sys  - System-specific parameters

Examples:
  >>> print("Hello, World!")
  >>> x = 42
  >>> y = [1, 2, 3, 4, 5]
  >>> sum(y)
  >>> import math
  >>> math.sqrt(16)
  >>> os.getcwd()

Type exit() or quit() to return to command mode.
        `.trim();
        
        this.addOutput(helpText, 'help');
    }
    
    listDirectory(path) {
        try {
            const targetPath = path ? window.fileSystem.parsePath(path) : this.currentDirectory;
            const items = window.fileSystem.listDirectory(targetPath);
            
            if (items.length === 0) {
                this.addOutput('Directory is empty');
                return;
            }
            
            // Format output similar to Windows dir command
            let output = `\n Directory of ${window.fileSystem.getPathString(targetPath)}\n\n`;
            
            items.forEach(item => {
                const date = new Date(item.modified).toLocaleDateString();
                const time = new Date(item.modified).toLocaleTimeString([], {hour12: false});
                const size = item.type === 'folder' ? '<DIR>' : item.size.toString().padStart(10);
                const name = item.name;
                
                output += `${date}  ${time}    ${size.padStart(15)} ${name}\n`;
            });
            
            output += `\n               ${items.filter(i => i.type === 'file').length} File(s)`;
            output += `\n               ${items.filter(i => i.type === 'folder').length} Dir(s)`;
            
            this.addOutput(output);
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
    }
    
    changeDirectory(path) {
        if (!path) {
            this.addOutput(window.fileSystem.getPathString(this.currentDirectory));
            return;
        }
        
        try {
            const newPath = window.fileSystem.parsePath(path);
            if (window.fileSystem.changeDirectory(newPath)) {
                this.currentDirectory = [...newPath];
                this.updatePrompt();
            } else {
                this.addOutput(`The system cannot find the path specified.`, 'error');
            }
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
    }
    
    printWorkingDirectory() {
        this.addOutput(window.fileSystem.getPathString(this.currentDirectory));
    }
    
    makeDirectory(name) {
        if (!name) {
            this.addOutput('Directory name required', 'error');
            return;
        }
        
        if (window.fileSystem.createFolder(name, this.currentDirectory)) {
            this.addOutput(`Directory created: ${name}`);
        } else {
            this.addOutput(`Cannot create directory: ${name}`, 'error');
        }
    }
    
    removeDirectory(name) {
        if (!name) {
            this.addOutput('Directory name required', 'error');
            return;
        }
        
        const dirPath = [...this.currentDirectory, name];
        if (window.fileSystem.deleteItem(dirPath)) {
            this.addOutput(`Directory removed: ${name}`);
        } else {
            this.addOutput(`Cannot remove directory: ${name}`, 'error');
        }
    }
    
    deleteFile(name) {
        if (!name) {
            this.addOutput('File name required', 'error');
            return;
        }
        
        const filePath = [...this.currentDirectory, name];
        if (window.fileSystem.deleteItem(filePath)) {
            this.addOutput(`File deleted: ${name}`);
        } else {
            this.addOutput(`Cannot delete file: ${name}`, 'error');
        }
    }
    
    copyFile(source, destination) {
        if (!source || !destination) {
            this.addOutput('Source and destination required', 'error');
            return;
        }
        
        // Implementation would depend on file system capabilities
        this.addOutput(`Copy operation: ${source} -> ${destination} (simulated)`);
    }
    
    moveFile(source, destination) {
        if (!source || !destination) {
            this.addOutput('Source and destination required', 'error');
            return;
        }
        
        // Implementation would depend on file system capabilities
        this.addOutput(`Move operation: ${source} -> ${destination} (simulated)`);
    }
    
    showFileContent(fileName) {
        if (!fileName) {
            this.addOutput('File name required', 'error');
            return;
        }
        
        try {
            const filePath = [...this.currentDirectory, fileName];
            const content = window.fileSystem.readFile(filePath);
            
            if (content !== null) {
                this.addOutput(content, 'file-content');
            } else {
                this.addOutput(`File not found: ${fileName}`, 'error');
            }
        } catch (error) {
            this.addOutput(`Error reading file: ${error.message}`, 'error');
        }
    }
    
    echoText(text) {
        this.addOutput(text || '');
    }
    
    showDate() {
        const date = new Date().toLocaleDateString();
        this.addOutput(`Current date: ${date}`);
    }
    
    showTime() {
        const time = new Date().toLocaleTimeString();
        this.addOutput(`Current time: ${time}`);
    }
    
    showVersion() {
        this.addOutput('Windows 11 Web OS Terminal [Version 1.0.0]');
    }
    
    showEnvironmentVariables() {
        let output = 'Environment Variables:\n\n';
        for (const [key, value] of Object.entries(this.environmentVariables)) {
            output += `${key}=${value}\n`;
        }
        this.addOutput(output);
    }
    
    setEnvironmentVariable(assignment) {
        if (!assignment.includes('=')) {
            this.addOutput('Usage: set VARIABLE=value', 'error');
            return;
        }
        
        const [key, value] = assignment.split('=', 2);
        this.environmentVariables[key.trim()] = value.trim();
        this.addOutput(`Set ${key.trim()}=${value.trim()}`);
    }
    
    pingHost(host) {
        if (!host) {
            this.addOutput('Usage: ping <hostname>', 'error');
            return;
        }
        
        this.addOutput(`Pinging ${host}...`);
        
        // Simulate ping response
        setTimeout(() => {
            this.addOutput(`Reply from ${host}: bytes=32 time=1ms TTL=64`);
            this.addOutput(`Reply from ${host}: bytes=32 time=1ms TTL=64`);
            this.addOutput(`Reply from ${host}: bytes=32 time=1ms TTL=64`);
            this.addOutput(`Reply from ${host}: bytes=32 time=1ms TTL=64`);
            this.addOutput(`\nPing statistics for ${host}:`);
            this.addOutput(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`);
            this.addOutput(`Approximate round trip times in milli-seconds:`);
            this.addOutput(`    Minimum = 1ms, Maximum = 1ms, Average = 1ms`);
            this.addPromptLine();
        }, 1000);
    }
    
    showNetworkConfig() {
        const config = `
Windows IP Configuration

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . : 
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . : 
   IPv4 Address. . . . . . . . . . . : 192.168.1.101
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
        `.trim();
        
        this.addOutput(config);
    }
    
    showRunningTasks() {
        if (!window.applicationManager) {
            this.addOutput('Application manager not available', 'error');
            return;
        }
        
        const stats = window.applicationManager.getSystemStats();
        let output = 'Running Applications:\n\n';
        output += 'Image Name                     PID Session Name        Session#    Mem Usage\n';
        output += '========================= ======== ================ =========== ============\n';
        
        // Simulate some system processes
        const processes = [
            ['System', '4', 'Services', '0', '128 K'],
            ['explorer.exe', '1234', 'Console', '1', '25,432 K'],
            ['chrome.exe', '5678', 'Console', '1', '156,789 K'],
            ['notepad.exe', '9012', 'Console', '1', '2,345 K']
        ];
        
        processes.forEach(([name, pid, session, sessionNum, memory]) => {
            output += `${name.padEnd(25)} ${pid.padStart(8)} ${session.padEnd(16)} ${sessionNum.padStart(11)} ${memory.padStart(12)}\n`;
        });
        
        this.addOutput(output);
    }
    
    handleExit() {
        if (window.windowManager) {
            window.windowManager.closeWindow(this.windowId);
        }
    }
    
    enterPythonMode() {
        this.pythonMode = true;
        this.updateModeButtons();
        this.updatePrompt();
        
        this.addOutput('Python 3.9.0 (Web OS Simulation) on web-os');
        this.addOutput('Type "help()", "copyright()", "credits()" or "license()" for more information.');
        this.addPythonPrompt();
    }
    
    exitPythonMode() {
        this.pythonMode = false;
        this.updateModeButtons();
        this.updatePrompt();
        this.addPromptLine();
    }
    
    updateModeButtons() {
        const content = this.getContentElement();
        const pythonBtn = content.querySelector('#term-python');
        const cmdBtn = content.querySelector('#term-cmd');
        
        if (this.pythonMode) {
            pythonBtn.classList.add('active');
            cmdBtn.classList.remove('active');
        } else {
            cmdBtn.classList.add('active');
            pythonBtn.classList.remove('active');
        }
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.terminalInput.value = '';
            return;
        }
        
        this.terminalInput.value = this.commandHistory[this.historyIndex] || '';
        this.currentCommand = this.terminalInput.value;
    }
    
    handleTabCompletion() {
        const command = this.terminalInput.value;
        const parts = command.split(' ');
        const lastPart = parts[parts.length - 1];
        
        if (parts.length === 1) {
            // Command completion
            const commands = ['help', 'dir', 'cd', 'mkdir', 'del', 'copy', 'move', 'type', 'echo', 'cls', 'python', 'exit'];
            const matches = commands.filter(cmd => cmd.startsWith(lastPart.toLowerCase()));
            
            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                this.terminalInput.value = parts.join(' ');
            } else if (matches.length > 1) {
                this.addOutput(`Possible completions: ${matches.join(', ')}`);
                this.addCommandLine(command);
            }
        } else {
            // File/directory completion
            try {
                const items = window.fileSystem.listDirectory(this.currentDirectory);
                const matches = items
                    .map(item => item.name)
                    .filter(name => name.toLowerCase().startsWith(lastPart.toLowerCase()));
                
                if (matches.length === 1) {
                    parts[parts.length - 1] = matches[0];
                    this.terminalInput.value = parts.join(' ');
                } else if (matches.length > 1) {
                    this.addOutput(`Possible completions: ${matches.join(', ')}`);
                    this.addCommandLine(command);
                }
            } catch (error) {
                // Ignore completion errors
            }
        }
    }
    
    handleCtrlC() {
        this.addOutput('^C');
        this.terminalInput.value = '';
        this.currentCommand = '';
        this.addPromptLine();
    }
    
    clearTerminal() {
        this.terminalOutput.innerHTML = '';
        this.addPromptLine();
    }
    
    copySelection() {
        const selection = window.getSelection();
        if (selection.toString()) {
            navigator.clipboard.writeText(selection.toString()).then(() => {
                this.updateStatus('Copied to clipboard');
            });
        }
    }
    
    pasteText() {
        navigator.clipboard.readText().then(text => {
            this.terminalInput.value += text;
            this.currentCommand = this.terminalInput.value;
        });
    }
    
    setFontSize(size) {
        const content = this.getContentElement().querySelector('.terminal-content');
        content.style.fontSize = size + 'px';
    }
    
    setTheme(theme) {
        const terminal = this.getContentElement().querySelector('.terminal');
        
        // Remove existing theme classes
        terminal.classList.remove('theme-dark', 'theme-light', 'theme-green', 'theme-blue');
        
        // Add new theme class
        terminal.classList.add(`theme-${theme}`);
        
        // Apply theme styles
        const themes = {
            dark: {
                background: '#1e1e1e',
                color: '#ffffff',
                promptColor: '#00ff00'
            },
            light: {
                background: '#ffffff',
                color: '#000000',
                promptColor: '#0000ff'
            },
            green: {
                background: '#001100',
                color: '#00ff00',
                promptColor: '#00ff00'
            },
            blue: {
                background: '#000033',
                color: '#00ffff',
                promptColor: '#00ffff'
            }
        };
        
        const themeColors = themes[theme];
        const terminalContent = this.getContentElement().querySelector('.terminal-content');
        
        terminalContent.style.backgroundColor = themeColors.background;
        terminalContent.style.color = themeColors.color;
        
        const prompt = this.getContentElement().querySelector('.terminal-prompt');
        if (prompt) {
            prompt.style.color = themeColors.promptColor;
        }
    }
    
    addOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.terminalOutput.appendChild(line);
        this.scrollToBottom();
    }
    
    addCommandLine(command) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-prompt">${this.getPrompt()}</span><span class="terminal-command">${command}</span>`;
        this.terminalOutput.appendChild(line);
        this.scrollToBottom();
    }
    
    addPromptLine() {
        this.updatePrompt();
        this.terminalInput.focus();
        this.scrollToBottom();
    }
    
    addPythonPrompt() {
        this.updatePrompt();
        this.terminalInput.focus();
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        const terminalContent = this.getContentElement().querySelector('.terminal-content');
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }
    
    updateStatus(message) {
        const status = this.getContentElement().querySelector('#term-status');
        status.textContent = message;
        
        if (message !== 'Ready') {
            setTimeout(() => {
                status.textContent = 'Ready';
            }, 3000);
        }
    }
    
    onFocus() {
        if (this.terminalInput) {
            this.terminalInput.focus();
        }
    }
    
    cleanup() {
        super.cleanup();
        // Clean up any intervals or timeouts if needed
    }
}

// Register the application
window.TerminalApp = TerminalApp;