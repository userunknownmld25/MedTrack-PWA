// Advanced Terminal System with Python Support
class TerminalSystem {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.currentDirectory = '/home/user';
        this.environment = {
            PATH: '/usr/bin:/bin:/usr/local/bin',
            HOME: '/home/user',
            USER: 'user',
            PWD: '/home/user'
        };
        this.pythonInterpreter = null;
        this.nodeInterpreter = null;
        this.init();
    }

    init() {
        this.setupPythonInterpreter();
        this.setupNodeInterpreter();
    }

    setupPythonInterpreter() {
        // Simple Python-like interpreter simulation
        this.pythonInterpreter = {
            variables: {},
            functions: {},
            isActive: false,
            
            execute: (code) => {
                try {
                    // Basic Python-like syntax simulation
                    if (code.includes('print(')) {
                        const match = code.match(/print\(['"](.*?)['"]\)/);
                        if (match) {
                            return match[1];
                        }
                    }
                    
                    if (code.includes('=')) {
                        const [varName, value] = code.split('=').map(s => s.trim());
                        this.pythonInterpreter.variables[varName] = value.replace(/['"]/g, '');
                        return `Variable ${varName} set to ${value}`;
                    }
                    
                    if (code === 'exit()') {
                        this.pythonInterpreter.isActive = false;
                        return 'Python interpreter exited';
                    }
                    
                    return `Python: ${code}`;
                } catch (error) {
                    return `Error: ${error.message}`;
                }
            }
        };
    }

    setupNodeInterpreter() {
        // Simple Node.js-like interpreter simulation
        this.nodeInterpreter = {
            variables: {},
            functions: {},
            isActive: false,
            
            execute: (code) => {
                try {
                    // Basic JavaScript-like syntax simulation
                    if (code.includes('console.log(')) {
                        const match = code.match(/console\.log\(['"](.*?)['"]\)/);
                        if (match) {
                            return match[1];
                        }
                    }
                    
                    if (code.includes('=')) {
                        const [varName, value] = code.split('=').map(s => s.trim());
                        this.nodeInterpreter.variables[varName] = value.replace(/['"]/g, '');
                        return `Variable ${varName} set to ${value}`;
                    }
                    
                    if (code === '.exit') {
                        this.nodeInterpreter.isActive = false;
                        return 'Node.js interpreter exited';
                    }
                    
                    return `Node: ${code}`;
                } catch (error) {
                    return `Error: ${error.message}`;
                }
            }
        };
    }

    executeCommand(command) {
        this.history.push(command);
        this.historyIndex = this.history.length;
        
        const parts = command.trim().split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Check if we're in a sub-interpreter
        if (this.pythonInterpreter.isActive) {
            return this.pythonInterpreter.execute(command);
        }
        
        if (this.nodeInterpreter.isActive) {
            return this.nodeInterpreter.execute(command);
        }
        
        // Built-in commands
        switch (cmd) {
            case 'help':
                return this.getHelpText();
                
            case 'ls':
                return this.listDirectory(args);
                
            case 'pwd':
                return this.currentDirectory;
                
            case 'cd':
                return this.changeDirectory(args[0]);
                
            case 'mkdir':
                return this.createDirectory(args[0]);
                
            case 'rm':
                return this.removeFile(args[0]);
                
            case 'cat':
                return this.displayFile(args[0]);
                
            case 'echo':
                return args.join(' ');
                
            case 'clear':
                return 'CLEAR_SCREEN';
                
            case 'history':
                return this.showHistory();
                
            case 'python':
                this.pythonInterpreter.isActive = true;
                return 'Python 3.9.0 interpreter started. Type "exit()" to quit.';
                
            case 'node':
                this.nodeInterpreter.isActive = true;
                return 'Node.js v16.0.0 interpreter started. Type ".exit" to quit.';
                
            case 'pip':
                return this.handlePipCommand(args);
                
            case 'npm':
                return this.handleNpmCommand(args);
                
            case 'git':
                return this.handleGitCommand(args);
                
            case 'sudo':
                return this.handleSudoCommand(args);
                
            case 'ps':
                return this.showProcesses();
                
            case 'top':
                return this.showSystemInfo();
                
            case 'df':
                return this.showDiskUsage();
                
            case 'free':
                return this.showMemoryUsage();
                
            case 'whoami':
                return this.environment.USER;
                
            case 'date':
                return new Date().toString();
                
            case 'uptime':
                return this.showUptime();
                
            case 'uname':
                return 'Linux WebOS 5.4.0-generic #1 SMP x86_64 GNU/Linux';
                
            case 'which':
                return this.findCommand(args[0]);
                
            case 'whereis':
                return this.findCommand(args[0]);
                
            case 'man':
                return this.showManual(args[0]);
                
            case 'alias':
                return this.handleAlias(args);
                
            case 'export':
                return this.handleExport(args);
                
            case 'env':
                return this.showEnvironment();
                
            case 'exit':
                return 'EXIT_TERMINAL';
                
            default:
                return `Command not found: ${cmd}. Type 'help' for available commands.`;
        }
    }

    getHelpText() {
        return `WebOS Terminal - Available Commands:

File Operations:
  ls [directory]     - List directory contents
  pwd               - Print working directory
  cd [directory]    - Change directory
  mkdir <name>      - Create directory
  rm <file>         - Remove file
  cat <file>        - Display file contents

Text Operations:
  echo <text>       - Display text
  clear             - Clear screen
  history           - Show command history

Programming:
  python            - Start Python interpreter
  node              - Start Node.js interpreter
  pip <command>     - Python package manager
  npm <command>     - Node.js package manager
  git <command>     - Git version control

System:
  ps                - Show running processes
  top               - Show system information
  df                - Show disk usage
  free              - Show memory usage
  whoami            - Show current user
  date              - Show current date/time
  uptime            - Show system uptime
  uname             - Show system information
  which <command>   - Find command location
  whereis <command> - Find command location
  man <command>     - Show manual page

Environment:
  alias <name=value> - Create command alias
  export <var=value> - Set environment variable
  env               - Show environment variables

Other:
  help              - Show this help
  exit              - Exit terminal

Type 'man <command>' for detailed information about a command.`;
    }

    listDirectory(args) {
        const path = args[0] || this.currentDirectory;
        const files = this.getDirectoryContents(path);
        
        if (files.length === 0) {
            return 'Directory is empty';
        }
        
        return files.map(file => {
            const type = file.type === 'directory' ? 'd' : '-';
            const permissions = 'rwxr-xr-x';
            const size = file.size || '0';
            const date = file.date || 'Jan 1 00:00';
            return `${type}${permissions} 1 user user ${size} ${date} ${file.name}`;
        }).join('\n');
    }

    getDirectoryContents(path) {
        const contents = {
            '/home/user': [
                { name: 'Desktop', type: 'directory', size: '4096', date: 'Jan 1 12:00' },
                { name: 'Documents', type: 'directory', size: '4096', date: 'Jan 1 12:00' },
                { name: 'Downloads', type: 'directory', size: '4096', date: 'Jan 1 12:00' },
                { name: 'Music', type: 'directory', size: '4096', date: 'Jan 1 12:00' },
                { name: 'Pictures', type: 'directory', size: '4096', date: 'Jan 1 12:00' },
                { name: 'Videos', type: 'directory', size: '4096', date: 'Jan 1 12:00' },
                { name: 'readme.txt', type: 'file', size: '1024', date: 'Jan 1 12:00' },
                { name: 'notes.md', type: 'file', size: '2048', date: 'Jan 1 12:00' }
            ],
            '/': [
                { name: 'bin', type: 'directory', size: '4096', date: 'Jan 1 00:00' },
                { name: 'etc', type: 'directory', size: '4096', date: 'Jan 1 00:00' },
                { name: 'home', type: 'directory', size: '4096', date: 'Jan 1 00:00' },
                { name: 'usr', type: 'directory', size: '4096', date: 'Jan 1 00:00' },
                { name: 'var', type: 'directory', size: '4096', date: 'Jan 1 00:00' }
            ]
        };
        
        return contents[path] || [];
    }

    changeDirectory(path) {
        if (!path) {
            this.currentDirectory = this.environment.HOME;
            return this.currentDirectory;
        }
        
        if (path === '..') {
            const parts = this.currentDirectory.split('/');
            parts.pop();
            this.currentDirectory = parts.join('/') || '/';
        } else if (path.startsWith('/')) {
            this.currentDirectory = path;
        } else {
            this.currentDirectory = this.currentDirectory + '/' + path;
        }
        
        this.environment.PWD = this.currentDirectory;
        return this.currentDirectory;
    }

    createDirectory(name) {
        if (!name) {
            return 'mkdir: missing operand';
        }
        
        return `Directory '${name}' created successfully`;
    }

    removeFile(name) {
        if (!name) {
            return 'rm: missing operand';
        }
        
        return `File '${name}' removed successfully`;
    }

    displayFile(name) {
        if (!name) {
            return 'cat: missing operand';
        }
        
        const fileContents = {
            'readme.txt': 'Welcome to WebOS Terminal!\nThis is a simulated file system.',
            'notes.md': '# My Notes\n\n- WebOS is awesome\n- Terminal is functional\n- Python support included'
        };
        
        return fileContents[name] || `File '${name}' not found`;
    }

    showHistory() {
        if (this.history.length === 0) {
            return 'No commands in history';
        }
        
        return this.history.map((cmd, index) => `${index + 1}  ${cmd}`).join('\n');
    }

    handlePipCommand(args) {
        const command = args[0];
        
        switch (command) {
            case 'list':
                return `Package    Version
---------- -------
requests   2.28.1
numpy      1.21.0
pandas     1.3.0
matplotlib 3.5.0
flask      2.0.0`;
                
            case 'install':
                const package = args[1];
                return `Installing ${package}...\nSuccessfully installed ${package}`;
                
            case 'uninstall':
                const pkg = args[1];
                return `Uninstalling ${pkg}...\nSuccessfully uninstalled ${pkg}`;
                
            default:
                return `pip: unknown command '${command}'. Use 'pip --help' for help.`;
        }
    }

    handleNpmCommand(args) {
        const command = args[0];
        
        switch (command) {
            case 'list':
                return `webos@1.0.0 /home/user
├── express@4.18.0
├── react@18.0.0
├── typescript@4.7.0
└── webpack@5.70.0`;
                
            case 'install':
                const package = args[1];
                return `Installing ${package}...\nSuccessfully installed ${package}`;
                
            case 'uninstall':
                const pkg = args[1];
                return `Uninstalling ${pkg}...\nSuccessfully uninstalled ${pkg}`;
                
            default:
                return `npm: unknown command '${command}'. Use 'npm --help' for help.`;
        }
    }

    handleGitCommand(args) {
        const command = args[0];
        
        switch (command) {
            case 'status':
                return `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`;
                
            case 'log':
                return `commit abc123def456 (HEAD -> main)
Author: User <user@webos.com>
Date:   Mon Jan 1 12:00:00 2024 +0000

    Initial commit`;
                
            case 'clone':
                const repo = args[1];
                return `Cloning into '${repo}'...\nRepository cloned successfully`;
                
            default:
                return `git: '${command}' is not a git command. Use 'git --help' for help.`;
        }
    }

    handleSudoCommand(args) {
        if (args.length === 0) {
            return 'sudo: missing command';
        }
        
        return `Running '${args.join(' ')}' as root...\nCommand executed successfully`;
    }

    showProcesses() {
        return `PID TTY          TIME CMD
1 ?        00:00:01 init
2 ?        00:00:00 kthreadd
3 ?        00:00:00 rcu_gp
4 ?        00:00:00 rcu_par_gp
100 ?      00:00:00 systemd
200 ?      00:00:00 WebOS
300 ?      00:00:00 terminal`;
    }

    showSystemInfo() {
        return `top - 12:00:00 up 1 day, 2:30, 1 user, load average: 0.15, 0.10, 0.05
Tasks: 100 total, 1 running, 99 sleeping, 0 stopped, 0 zombie
%Cpu(s): 2.5 us, 1.0 sy, 0.0 ni, 96.5 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st
MiB Mem : 8192.0 total, 2048.0 free, 4096.0 used, 2048.0 buff/cache
MiB Swap: 4096.0 total, 4096.0 free, 0.0 used. 6144.0 avail Mem`;
    }

    showDiskUsage() {
        return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       20G  5.2G   14G  28% /
/dev/sda2       10G  2.1G  7.9G  21% /home
tmpfs           4.0G     0  4.0G   0% /tmp`;
    }

    showMemoryUsage() {
        return `              total        used        free      shared  buff/cache   available
Mem:           8.0Gi       4.0Gi       2.0Gi       1.0Gi       2.0Gi       6.0Gi
Swap:          4.0Gi          0B       4.0Gi`;
    }

    showUptime() {
        return ` 12:00:00 up 1 day, 2:30, 1 user, load average: 0.15, 0.10, 0.05`;
    }

    findCommand(command) {
        const commands = {
            'python': '/usr/bin/python3',
            'node': '/usr/bin/node',
            'git': '/usr/bin/git',
            'npm': '/usr/bin/npm',
            'pip': '/usr/bin/pip3',
            'ls': '/bin/ls',
            'cat': '/bin/cat',
            'mkdir': '/bin/mkdir'
        };
        
        return commands[command] || `which: no ${command} in (/usr/bin:/bin:/usr/local/bin)`;
    }

    showManual(command) {
        const manuals = {
            'ls': `LS(1)                    User Commands                   LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List  information  about  the FILEs (the current directory by default).
       Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.`,
            
            'cd': `CD(1)                    User Commands                   CD(1)

NAME
       cd - change directory

SYNOPSIS
       cd [directory]

DESCRIPTION
       Change the current directory to the specified directory.`,
            
            'python': `PYTHON(1)               General Commands Manual          PYTHON(1)

NAME
       python - an interpreted, interactive, object-oriented programming language

SYNOPSIS
       python [option] ... [-c cmd | -m mod | file | -] [arg] ...

DESCRIPTION
       Python is an interpreted, interactive, object-oriented programming language.`
        };
        
        return manuals[command] || `No manual entry for ${command}`;
    }

    handleAlias(args) {
        if (args.length === 0) {
            return 'alias: no arguments provided';
        }
        
        const alias = args.join(' ');
        if (alias.includes('=')) {
            return `Alias created: ${alias}`;
        } else {
            return `Alias: ${alias}`;
        }
    }

    handleExport(args) {
        if (args.length === 0) {
            return this.showEnvironment();
        }
        
        const [varName, value] = args.join(' ').split('=');
        this.environment[varName] = value;
        return `Environment variable ${varName} set to ${value}`;
    }

    showEnvironment() {
        return Object.entries(this.environment)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
    }

    getHistory() {
        return this.history;
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            return this.history[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            return this.history[this.historyIndex];
        }
        return '';
    }
}

// Initialize terminal system
window.terminalSystem = new TerminalSystem();