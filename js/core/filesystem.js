// Virtual File System for Windows 11 Web OS

class FileSystem {
    constructor() {
        this.root = {
            type: 'folder',
            name: 'C:',
            children: {
                'Users': {
                    type: 'folder',
                    name: 'Users',
                    children: {
                        'User': {
                            type: 'folder',
                            name: 'User',
                            children: {
                                'Desktop': {
                                    type: 'folder',
                                    name: 'Desktop',
                                    children: {
                                        'Welcome.txt': {
                                            type: 'file',
                                            name: 'Welcome.txt',
                                            content: 'Welcome to Windows 11 Web OS!\n\nThis is a fully functional web-based operating system that replicates the Windows 11 experience.\n\nFeatures:\n- Complete desktop environment\n- File manager with folder navigation\n- Text editor and code editor\n- Terminal with Python support\n- Web browser\n- Paint application\n- Video editor\n- Built-in games\n- App store for downloading applications\n\nEnjoy exploring your new web OS!',
                                            size: 512,
                                            modified: new Date(),
                                            created: new Date()
                                        }
                                    }
                                },
                                'Documents': {
                                    type: 'folder',
                                    name: 'Documents',
                                    children: {
                                        'Sample.txt': {
                                            type: 'file',
                                            name: 'Sample.txt',
                                            content: 'This is a sample text file.\n\nYou can edit this file using the text editor or code editor applications.',
                                            size: 128,
                                            modified: new Date(),
                                            created: new Date()
                                        },
                                        'Code': {
                                            type: 'folder',
                                            name: 'Code',
                                            children: {
                                                'hello.py': {
                                                    type: 'file',
                                                    name: 'hello.py',
                                                    content: '#!/usr/bin/env python3\n\ndef main():\n    print("Hello, Windows 11 Web OS!")\n    print("This is a Python script running in the browser.")\n    \n    # Simple calculation\n    result = 2 + 2\n    print(f"2 + 2 = {result}")\n    \n    # List comprehension example\n    squares = [x**2 for x in range(1, 6)]\n    print(f"Squares: {squares}")\n\nif __name__ == "__main__":\n    main()',
                                                    size: 384,
                                                    modified: new Date(),
                                                    created: new Date()
                                                },
                                                'index.html': {
                                                    type: 'file',
                                                    name: 'index.html',
                                                    content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Sample HTML Page</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 40px;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            color: white;\n        }\n        .container {\n            max-width: 800px;\n            margin: 0 auto;\n            text-align: center;\n        }\n        h1 {\n            font-size: 2.5em;\n            margin-bottom: 20px;\n        }\n        p {\n            font-size: 1.2em;\n            line-height: 1.6;\n        }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <h1>Welcome to Windows 11 Web OS</h1>\n        <p>This is a sample HTML file that you can edit and preview in the code editor.</p>\n        <p>The web OS includes a full-featured browser that can display HTML content.</p>\n    </div>\n</body>\n</html>',
                                                    size: 1024,
                                                    modified: new Date(),
                                                    created: new Date()
                                                },
                                                'styles.css': {
                                                    type: 'file',
                                                    name: 'styles.css',
                                                    content: '/* Sample CSS File */\n\n:root {\n    --primary-color: #0078D4;\n    --secondary-color: #005A9E;\n    --accent-color: #00BCF2;\n    --background-color: #F3F3F3;\n    --text-color: #323130;\n}\n\nbody {\n    font-family: "Segoe UI", system-ui, sans-serif;\n    background: var(--background-color);\n    color: var(--text-color);\n    margin: 0;\n    padding: 20px;\n}\n\n.card {\n    background: white;\n    border-radius: 8px;\n    padding: 20px;\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n    margin-bottom: 20px;\n}\n\n.button {\n    background: var(--primary-color);\n    color: white;\n    border: none;\n    padding: 10px 20px;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 14px;\n    transition: background 0.2s;\n}\n\n.button:hover {\n    background: var(--secondary-color);\n}',
                                                    size: 768,
                                                    modified: new Date(),
                                                    created: new Date()
                                                },
                                                'script.js': {
                                                    type: 'file',
                                                    name: 'script.js',
                                                    content: '// Sample JavaScript File\n\n// DOM Content Loaded Event\ndocument.addEventListener("DOMContentLoaded", function() {\n    console.log("Windows 11 Web OS - JavaScript loaded!");\n    \n    // Sample function\n    function greetUser() {\n        const userName = prompt("What\'s your name?");\n        if (userName) {\n            alert(`Hello, ${userName}! Welcome to Windows 11 Web OS!`);\n        }\n    }\n    \n    // Sample class\n    class Calculator {\n        constructor() {\n            this.result = 0;\n        }\n        \n        add(num) {\n            this.result += num;\n            return this;\n        }\n        \n        subtract(num) {\n            this.result -= num;\n            return this;\n        }\n        \n        multiply(num) {\n            this.result *= num;\n            return this;\n        }\n        \n        divide(num) {\n            if (num !== 0) {\n                this.result /= num;\n            }\n            return this;\n        }\n        \n        getResult() {\n            return this.result;\n        }\n        \n        reset() {\n            this.result = 0;\n            return this;\n        }\n    }\n    \n    // Example usage\n    const calc = new Calculator();\n    const result = calc.add(10).multiply(2).subtract(5).getResult();\n    console.log("Calculator result:", result); // 15\n    \n    // Export for global use\n    window.greetUser = greetUser;\n    window.Calculator = Calculator;\n});',
                                                    size: 1280,
                                                    modified: new Date(),
                                                    created: new Date()
                                                }
                                            }
                                        }
                                    }
                                },
                                'Downloads': {
                                    type: 'folder',
                                    name: 'Downloads',
                                    children: {}
                                },
                                'Pictures': {
                                    type: 'folder',
                                    name: 'Pictures',
                                    children: {}
                                },
                                'Videos': {
                                    type: 'folder',
                                    name: 'Videos',
                                    children: {}
                                },
                                'Music': {
                                    type: 'folder',
                                    name: 'Music',
                                    children: {}
                                }
                            }
                        }
                    }
                },
                'Program Files': {
                    type: 'folder',
                    name: 'Program Files',
                    children: {
                        'Windows 11 Web OS': {
                            type: 'folder',
                            name: 'Windows 11 Web OS',
                            children: {
                                'system.txt': {
                                    type: 'file',
                                    name: 'system.txt',
                                    content: 'Windows 11 Web OS System Files\n\nThis folder contains system files for the web operating system.',
                                    size: 128,
                                    modified: new Date(),
                                    created: new Date()
                                }
                            }
                        }
                    }
                },
                'Windows': {
                    type: 'folder',
                    name: 'Windows',
                    children: {
                        'System32': {
                            type: 'folder',
                            name: 'System32',
                            children: {}
                        }
                    }
                }
            }
        };
        
        this.currentPath = ['C:', 'Users', 'User'];
        this.listeners = [];
    }
    
    // Get current directory
    getCurrentDirectory() {
        let current = this.root;
        for (let i = 1; i < this.currentPath.length; i++) {
            current = current.children[this.currentPath[i]];
        }
        return current;
    }
    
    // Get item at path
    getItem(path) {
        if (typeof path === 'string') {
            path = this.parsePath(path);
        }
        
        let current = this.root;
        for (let i = 1; i < path.length; i++) {
            if (!current.children || !current.children[path[i]]) {
                return null;
            }
            current = current.children[path[i]];
        }
        return current;
    }
    
    // Parse path string into array
    parsePath(pathString) {
        if (pathString.startsWith('C:')) {
            return pathString.split(/[\\\/]/).filter(p => p);
        } else if (pathString.startsWith('/')) {
            return ['C:', ...pathString.substring(1).split('/').filter(p => p)];
        } else {
            // Relative path
            return [...this.currentPath, ...pathString.split(/[\\\/]/).filter(p => p)];
        }
    }
    
    // Get path string
    getPathString(path = this.currentPath) {
        return path.join('\\');
    }
    
    // Change directory
    changeDirectory(path) {
        if (typeof path === 'string') {
            if (path === '..') {
                if (this.currentPath.length > 1) {
                    this.currentPath.pop();
                }
                return true;
            }
            path = this.parsePath(path);
        }
        
        const item = this.getItem(path);
        if (item && item.type === 'folder') {
            this.currentPath = path;
            this.notifyListeners('directoryChanged', { path: this.currentPath });
            return true;
        }
        return false;
    }
    
    // List directory contents
    listDirectory(path = this.currentPath) {
        const dir = this.getItem(path);
        if (!dir || dir.type !== 'folder' || !dir.children) {
            return [];
        }
        
        return Object.values(dir.children).map(item => ({
            ...item,
            path: [...path, item.name]
        }));
    }
    
    // Create folder
    createFolder(name, path = this.currentPath) {
        const dir = this.getItem(path);
        if (!dir || dir.type !== 'folder') {
            return false;
        }
        
        if (dir.children[name]) {
            return false; // Already exists
        }
        
        dir.children[name] = {
            type: 'folder',
            name: name,
            children: {},
            created: new Date(),
            modified: new Date()
        };
        
        this.notifyListeners('itemCreated', { name, path, type: 'folder' });
        return true;
    }
    
    // Create file
    createFile(name, content = '', path = this.currentPath) {
        const dir = this.getItem(path);
        if (!dir || dir.type !== 'folder') {
            return false;
        }
        
        if (dir.children[name]) {
            return false; // Already exists
        }
        
        dir.children[name] = {
            type: 'file',
            name: name,
            content: content,
            size: content.length,
            created: new Date(),
            modified: new Date()
        };
        
        this.notifyListeners('itemCreated', { name, path, type: 'file' });
        return true;
    }
    
    // Read file
    readFile(path) {
        const file = this.getItem(path);
        if (!file || file.type !== 'file') {
            return null;
        }
        return file.content;
    }
    
    // Write file
    writeFile(path, content) {
        const file = this.getItem(path);
        if (!file || file.type !== 'file') {
            return false;
        }
        
        file.content = content;
        file.size = content.length;
        file.modified = new Date();
        
        this.notifyListeners('fileModified', { path, content });
        return true;
    }
    
    // Delete item
    deleteItem(path) {
        if (typeof path === 'string') {
            path = this.parsePath(path);
        }
        
        if (path.length <= 1) {
            return false; // Can't delete root
        }
        
        const parentPath = path.slice(0, -1);
        const itemName = path[path.length - 1];
        const parent = this.getItem(parentPath);
        
        if (!parent || !parent.children || !parent.children[itemName]) {
            return false;
        }
        
        delete parent.children[itemName];
        this.notifyListeners('itemDeleted', { path, name: itemName });
        return true;
    }
    
    // Rename item
    renameItem(path, newName) {
        if (typeof path === 'string') {
            path = this.parsePath(path);
        }
        
        const item = this.getItem(path);
        if (!item) {
            return false;
        }
        
        const parentPath = path.slice(0, -1);
        const oldName = path[path.length - 1];
        const parent = this.getItem(parentPath);
        
        if (parent.children[newName]) {
            return false; // Name already exists
        }
        
        item.name = newName;
        item.modified = new Date();
        parent.children[newName] = item;
        delete parent.children[oldName];
        
        this.notifyListeners('itemRenamed', { path, oldName, newName });
        return true;
    }
    
    // Copy item
    copyItem(sourcePath, destPath) {
        const sourceItem = this.getItem(sourcePath);
        if (!sourceItem) {
            return false;
        }
        
        const destDir = this.getItem(destPath);
        if (!destDir || destDir.type !== 'folder') {
            return false;
        }
        
        const copy = this.deepCopy(sourceItem);
        copy.created = new Date();
        copy.modified = new Date();
        
        destDir.children[copy.name] = copy;
        this.notifyListeners('itemCopied', { sourcePath, destPath });
        return true;
    }
    
    // Move item
    moveItem(sourcePath, destPath) {
        if (this.copyItem(sourcePath, destPath)) {
            return this.deleteItem(sourcePath);
        }
        return false;
    }
    
    // Deep copy helper
    deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj);
        }
        
        const copy = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = this.deepCopy(obj[key]);
            }
        }
        return copy;
    }
    
    // Search files
    searchFiles(query, path = this.currentPath, recursive = true) {
        const results = [];
        const dir = this.getItem(path);
        
        if (!dir || dir.type !== 'folder') {
            return results;
        }
        
        const searchInDirectory = (directory, currentPath) => {
            for (const item of Object.values(directory.children || {})) {
                const itemPath = [...currentPath, item.name];
                
                if (item.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        ...item,
                        path: itemPath
                    });
                }
                
                if (recursive && item.type === 'folder' && item.children) {
                    searchInDirectory(item, itemPath);
                }
            }
        };
        
        searchInDirectory(dir, path);
        return results;
    }
    
    // Get file extension
    getFileExtension(filename) {
        const lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
    }
    
    // Get file type icon
    getFileIcon(item) {
        if (item.type === 'folder') {
            return 'fas fa-folder';
        }
        
        const ext = this.getFileExtension(item.name);
        const iconMap = {
            'txt': 'fas fa-file-alt',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'pdf': 'fas fa-file-pdf',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'png': 'fas fa-file-image',
            'gif': 'fas fa-file-image',
            'mp4': 'fas fa-file-video',
            'avi': 'fas fa-file-video',
            'mp3': 'fas fa-file-audio',
            'wav': 'fas fa-file-audio',
            'zip': 'fas fa-file-archive',
            'rar': 'fas fa-file-archive',
            'html': 'fas fa-file-code',
            'css': 'fas fa-file-code',
            'js': 'fas fa-file-code',
            'py': 'fas fa-file-code',
            'java': 'fas fa-file-code',
            'cpp': 'fas fa-file-code',
            'c': 'fas fa-file-code',
            'exe': 'fas fa-cog',
            'msi': 'fas fa-cog'
        };
        
        return iconMap[ext] || 'fas fa-file';
    }
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Format date
    formatDate(date) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    // Add event listener
    addEventListener(callback) {
        this.listeners.push(callback);
    }
    
    // Remove event listener
    removeEventListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }
    
    // Notify listeners
    notifyListeners(event, data) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('FileSystem listener error:', error);
            }
        });
    }
    
    // Export file system data
    export() {
        return JSON.stringify(this.root, null, 2);
    }
    
    // Import file system data
    import(data) {
        try {
            this.root = JSON.parse(data);
            this.currentPath = ['C:', 'Users', 'User'];
            this.notifyListeners('fileSystemImported', {});
            return true;
        } catch (error) {
            console.error('Failed to import file system:', error);
            return false;
        }
    }
}

// Global file system instance
window.fileSystem = new FileSystem();