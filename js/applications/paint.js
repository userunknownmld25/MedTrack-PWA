// Paint Application for Windows 11 Web OS

class PaintApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 900;
        this.defaultHeight = 600;
        this.minWidth = 600;
        this.minHeight = 400;
        
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.currentSize = 5;
        this.backgroundColor = '#ffffff';
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;
        
        this.tools = {
            brush: { name: 'Brush', icon: 'fas fa-paint-brush', cursor: 'crosshair' },
            pencil: { name: 'Pencil', icon: 'fas fa-pencil-alt', cursor: 'crosshair' },
            eraser: { name: 'Eraser', icon: 'fas fa-eraser', cursor: 'crosshair' },
            line: { name: 'Line', icon: 'fas fa-minus', cursor: 'crosshair' },
            rectangle: { name: 'Rectangle', icon: 'fas fa-square', cursor: 'crosshair' },
            circle: { name: 'Circle', icon: 'fas fa-circle', cursor: 'crosshair' },
            text: { name: 'Text', icon: 'fas fa-font', cursor: 'text' },
            fill: { name: 'Fill', icon: 'fas fa-fill-drip', cursor: 'crosshair' },
            eyedropper: { name: 'Eyedropper', icon: 'fas fa-eye-dropper', cursor: 'crosshair' }
        };
        
        this.startX = 0;
        this.startY = 0;
        this.tempCanvas = null;
        this.tempCtx = null;
    }
    
    render() {
        return `
            <div class="paint-app">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="paint-new" title="New">
                            <i class="fas fa-file"></i>
                            <span>New</span>
                        </button>
                        <button class="app-button" id="paint-open" title="Open">
                            <i class="fas fa-folder-open"></i>
                            <span>Open</span>
                        </button>
                        <button class="app-button" id="paint-save" title="Save">
                            <i class="fas fa-save"></i>
                            <span>Save</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="paint-undo" title="Undo" disabled>
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="app-button" id="paint-redo" title="Redo" disabled>
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="paint-cut" title="Cut">
                            <i class="fas fa-cut"></i>
                        </button>
                        <button class="app-button" id="paint-copy" title="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="app-button" id="paint-paste" title="Paste">
                            <i class="fas fa-paste"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <label>Size:</label>
                        <input type="range" id="brush-size" min="1" max="50" value="5" style="width: 80px;">
                        <span id="size-display">5px</span>
                    </div>
                    
                    <div class="app-toolbar-group">
                        <input type="color" id="color-picker" value="#000000" title="Color">
                        <button class="app-button" id="bg-color" title="Background Color">
                            <i class="fas fa-fill"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <span id="canvas-size">800 x 600</span>
                        <button class="app-button" id="resize-canvas" title="Resize Canvas">
                            <i class="fas fa-expand-arrows-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="paint-content">
                    <div class="paint-toolbox">
                        <div class="tool-section">
                            <div class="section-title">Tools</div>
                            <div class="tools-grid">
                                ${Object.entries(this.tools).map(([id, tool]) => `
                                    <button class="paint-tool ${id === this.currentTool ? 'active' : ''}" 
                                            data-tool="${id}" 
                                            title="${tool.name}">
                                        <i class="${tool.icon}"></i>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="tool-section">
                            <div class="section-title">Colors</div>
                            <div class="color-palette">
                                <div class="color-swatch" style="background: #000000" data-color="#000000"></div>
                                <div class="color-swatch" style="background: #ffffff" data-color="#ffffff"></div>
                                <div class="color-swatch" style="background: #ff0000" data-color="#ff0000"></div>
                                <div class="color-swatch" style="background: #00ff00" data-color="#00ff00"></div>
                                <div class="color-swatch" style="background: #0000ff" data-color="#0000ff"></div>
                                <div class="color-swatch" style="background: #ffff00" data-color="#ffff00"></div>
                                <div class="color-swatch" style="background: #ff00ff" data-color="#ff00ff"></div>
                                <div class="color-swatch" style="background: #00ffff" data-color="#00ffff"></div>
                                <div class="color-swatch" style="background: #800000" data-color="#800000"></div>
                                <div class="color-swatch" style="background: #008000" data-color="#008000"></div>
                                <div class="color-swatch" style="background: #000080" data-color="#000080"></div>
                                <div class="color-swatch" style="background: #808000" data-color="#808000"></div>
                                <div class="color-swatch" style="background: #800080" data-color="#800080"></div>
                                <div class="color-swatch" style="background: #008080" data-color="#008080"></div>
                                <div class="color-swatch" style="background: #808080" data-color="#808080"></div>
                                <div class="color-swatch" style="background: #c0c0c0" data-color="#c0c0c0"></div>
                            </div>
                        </div>
                        
                        <div class="tool-section">
                            <div class="section-title">Options</div>
                            <div class="tool-options" id="tool-options">
                                <!-- Tool-specific options will be populated here -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="paint-canvas-container">
                        <canvas id="paint-canvas" width="800" height="600"></canvas>
                        <canvas id="temp-canvas" width="800" height="600" style="position: absolute; top: 0; left: 0; pointer-events: none;"></canvas>
                    </div>
                </div>
                
                <div class="paint-status">
                    <div class="status-left">
                        <span id="paint-status-text">Ready</span>
                    </div>
                    <div class="status-right">
                        <span id="cursor-position">0, 0</span>
                        <span class="status-separator">|</span>
                        <span id="zoom-level">100%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Get canvas elements
        this.canvas = content.querySelector('#paint-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tempCanvas = content.querySelector('#temp-canvas');
        this.tempCtx = this.tempCanvas.getContext('2d');
        
        // Toolbar buttons
        content.querySelector('#paint-new').addEventListener('click', () => this.newCanvas());
        content.querySelector('#paint-open').addEventListener('click', () => this.openImage());
        content.querySelector('#paint-save').addEventListener('click', () => this.saveImage());
        
        content.querySelector('#paint-undo').addEventListener('click', () => this.undo());
        content.querySelector('#paint-redo').addEventListener('click', () => this.redo());
        
        content.querySelector('#paint-cut').addEventListener('click', () => this.cut());
        content.querySelector('#paint-copy').addEventListener('click', () => this.copy());
        content.querySelector('#paint-paste').addEventListener('click', () => this.paste());
        
        // Tool selection
        content.querySelectorAll('.paint-tool').forEach(tool => {
            tool.addEventListener('click', () => {
                const toolId = tool.getAttribute('data-tool');
                this.selectTool(toolId);
            });
        });
        
        // Color selection
        content.querySelector('#color-picker').addEventListener('change', (e) => {
            this.currentColor = e.target.value;
        });
        
        content.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.getAttribute('data-color');
                this.currentColor = color;
                content.querySelector('#color-picker').value = color;
            });
        });
        
        // Brush size
        const brushSize = content.querySelector('#brush-size');
        brushSize.addEventListener('input', (e) => {
            this.currentSize = parseInt(e.target.value);
            content.querySelector('#size-display').textContent = this.currentSize + 'px';
        });
        
        // Background color
        content.querySelector('#bg-color').addEventListener('click', () => this.changeBackgroundColor());
        
        // Resize canvas
        content.querySelector('#resize-canvas').addEventListener('click', () => this.resizeCanvas());
        
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e) => this.updateCursorPosition(e));
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Keyboard shortcuts
        content.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    loadData() {
        this.initializeCanvas();
        this.saveState();
        this.updateToolOptions();
    }
    
    initializeCanvas() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set default drawing properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
    }
    
    selectTool(toolId) {
        if (!this.tools[toolId]) return;
        
        this.currentTool = toolId;
        
        // Update tool buttons
        const content = this.getContentElement();
        content.querySelectorAll('.paint-tool').forEach(tool => {
            if (tool.getAttribute('data-tool') === toolId) {
                tool.classList.add('active');
            } else {
                tool.classList.remove('active');
            }
        });
        
        // Update cursor
        const container = content.querySelector('.paint-canvas-container');
        container.style.cursor = this.tools[toolId].cursor;
        
        // Update tool options
        this.updateToolOptions();
        
        this.updateStatus(`Selected: ${this.tools[toolId].name}`);
    }
    
    updateToolOptions() {
        const optionsContainer = this.getContentElement().querySelector('#tool-options');
        
        let html = '';
        
        switch (this.currentTool) {
            case 'brush':
            case 'pencil':
                html = `
                    <label>
                        <input type="checkbox" id="pressure-sensitive"> Pressure Sensitive
                    </label>
                    <label>
                        Opacity: <input type="range" id="opacity" min="0" max="100" value="100">
                    </label>
                `;
                break;
                
            case 'text':
                html = `
                    <label>
                        Font: <select id="font-family">
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Courier New">Courier New</option>
                        </select>
                    </label>
                    <label>
                        Size: <input type="number" id="font-size" value="16" min="8" max="72">
                    </label>
                    <label>
                        <input type="checkbox" id="font-bold"> Bold
                    </label>
                    <label>
                        <input type="checkbox" id="font-italic"> Italic
                    </label>
                `;
                break;
                
            case 'line':
            case 'rectangle':
            case 'circle':
                html = `
                    <label>
                        <input type="checkbox" id="fill-shape"> Fill Shape
                    </label>
                    <label>
                        Line Width: <input type="range" id="line-width" min="1" max="20" value="2">
                    </label>
                `;
                break;
                
            default:
                html = '<p>No options for this tool</p>';
        }
        
        optionsContainer.innerHTML = html;
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        switch (this.currentTool) {
            case 'brush':
            case 'pencil':
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                break;
                
            case 'eraser':
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                break;
                
            case 'eyedropper':
                this.pickColor(this.startX, this.startY);
                break;
                
            case 'fill':
                this.floodFill(this.startX, this.startY);
                break;
                
            case 'text':
                this.addText(this.startX, this.startY);
                break;
        }
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        switch (this.currentTool) {
            case 'brush':
            case 'pencil':
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                break;
                
            case 'eraser':
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                break;
                
            case 'line':
                this.drawPreview(() => {
                    this.tempCtx.beginPath();
                    this.tempCtx.moveTo(this.startX, this.startY);
                    this.tempCtx.lineTo(currentX, currentY);
                    this.tempCtx.stroke();
                });
                break;
                
            case 'rectangle':
                this.drawPreview(() => {
                    const width = currentX - this.startX;
                    const height = currentY - this.startY;
                    
                    if (this.getContentElement().querySelector('#fill-shape')?.checked) {
                        this.tempCtx.fillRect(this.startX, this.startY, width, height);
                    } else {
                        this.tempCtx.strokeRect(this.startX, this.startY, width, height);
                    }
                });
                break;
                
            case 'circle':
                this.drawPreview(() => {
                    const radius = Math.sqrt(
                        Math.pow(currentX - this.startX, 2) + 
                        Math.pow(currentY - this.startY, 2)
                    );
                    
                    this.tempCtx.beginPath();
                    this.tempCtx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                    
                    if (this.getContentElement().querySelector('#fill-shape')?.checked) {
                        this.tempCtx.fill();
                    } else {
                        this.tempCtx.stroke();
                    }
                });
                break;
        }
    }
    
    stopDrawing() {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        // Reset composite operation
        this.ctx.globalCompositeOperation = 'source-over';
        
        // For shape tools, draw the final shape on the main canvas
        if (['line', 'rectangle', 'circle'].includes(this.currentTool)) {
            this.ctx.drawImage(this.tempCanvas, 0, 0);
            this.clearTempCanvas();
        }
        
        // Save state for undo/redo
        this.saveState();
    }
    
    drawPreview(drawFunction) {
        // Clear temp canvas
        this.clearTempCanvas();
        
        // Set temp canvas properties
        this.tempCtx.strokeStyle = this.currentColor;
        this.tempCtx.fillStyle = this.currentColor;
        this.tempCtx.lineWidth = this.currentSize;
        this.tempCtx.lineCap = 'round';
        this.tempCtx.lineJoin = 'round';
        
        // Draw preview
        drawFunction();
    }
    
    clearTempCanvas() {
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }
    
    pickColor(x, y) {
        const imageData = this.ctx.getImageData(x, y, 1, 1);
        const data = imageData.data;
        
        const r = data[0];
        const g = data[1];
        const b = data[2];
        
        const hex = '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
        
        this.currentColor = hex;
        this.getContentElement().querySelector('#color-picker').value = hex;
        
        this.updateStatus(`Color picked: ${hex}`);
    }
    
    floodFill(x, y) {
        // Simple flood fill implementation
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const targetColor = this.getPixelColor(data, x, y, this.canvas.width);
        const fillColor = this.hexToRgb(this.currentColor);
        
        if (this.colorsMatch(targetColor, fillColor)) return;
        
        const stack = [[x, y]];
        
        while (stack.length > 0) {
            const [currentX, currentY] = stack.pop();
            
            if (currentX < 0 || currentX >= this.canvas.width || 
                currentY < 0 || currentY >= this.canvas.height) continue;
            
            const currentColor = this.getPixelColor(data, currentX, currentY, this.canvas.width);
            
            if (!this.colorsMatch(currentColor, targetColor)) continue;
            
            this.setPixelColor(data, currentX, currentY, this.canvas.width, fillColor);
            
            stack.push([currentX + 1, currentY]);
            stack.push([currentX - 1, currentY]);
            stack.push([currentX, currentY + 1]);
            stack.push([currentX, currentY - 1]);
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    getPixelColor(data, x, y, width) {
        const index = (y * width + x) * 4;
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
    }
    
    setPixelColor(data, x, y, width, color) {
        const index = (y * width + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
    }
    
    colorsMatch(color1, color2) {
        return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    addText(x, y) {
        const text = prompt('Enter text:');
        if (!text) return;
        
        const fontSize = this.getContentElement().querySelector('#font-size')?.value || 16;
        const fontFamily = this.getContentElement().querySelector('#font-family')?.value || 'Arial';
        const bold = this.getContentElement().querySelector('#font-bold')?.checked;
        const italic = this.getContentElement().querySelector('#font-italic')?.checked;
        
        let font = '';
        if (italic) font += 'italic ';
        if (bold) font += 'bold ';
        font += fontSize + 'px ' + fontFamily;
        
        this.ctx.font = font;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fillText(text, x, y);
    }
    
    saveState() {
        // Remove any states after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.history.push(this.canvas.toDataURL());
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(this.history[this.historyIndex]);
            this.updateUndoRedoButtons();
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(this.history[this.historyIndex]);
            this.updateUndoRedoButtons();
        }
    }
    
    loadState(dataURL) {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = dataURL;
    }
    
    updateUndoRedoButtons() {
        const content = this.getContentElement();
        content.querySelector('#paint-undo').disabled = this.historyIndex <= 0;
        content.querySelector('#paint-redo').disabled = this.historyIndex >= this.history.length - 1;
    }
    
    newCanvas() {
        if (confirm('Create a new canvas? This will clear the current drawing.')) {
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.history = [];
            this.historyIndex = -1;
            this.saveState();
            this.updateStatus('New canvas created');
        }
    }
    
    openImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0);
                    this.saveState();
                    this.updateStatus(`Opened: ${file.name}`);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        
        input.click();
    }
    
    saveImage() {
        const link = document.createElement('a');
        link.download = 'painting.png';
        link.href = this.canvas.toDataURL();
        link.click();
        
        this.updateStatus('Image saved');
    }
    
    changeBackgroundColor() {
        const color = prompt('Enter background color (hex):', this.backgroundColor);
        if (color && /^#[0-9A-F]{6}$/i.test(color)) {
            this.backgroundColor = color;
            
            // Fill canvas with new background color
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                if (data[i + 3] === 0) { // Transparent pixels
                    const rgb = this.hexToRgb(color);
                    data[i] = rgb.r;
                    data[i + 1] = rgb.g;
                    data[i + 2] = rgb.b;
                    data[i + 3] = 255;
                }
            }
            
            this.ctx.putImageData(imageData, 0, 0);
            this.saveState();
        }
    }
    
    resizeCanvas() {
        const width = prompt('Enter canvas width:', this.canvas.width);
        const height = prompt('Enter canvas height:', this.canvas.height);
        
        if (width && height) {
            const newWidth = parseInt(width);
            const newHeight = parseInt(height);
            
            if (newWidth > 0 && newHeight > 0) {
                // Save current canvas
                const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                
                // Resize canvas
                this.canvas.width = newWidth;
                this.canvas.height = newHeight;
                this.tempCanvas.width = newWidth;
                this.tempCanvas.height = newHeight;
                
                // Clear and restore
                this.initializeCanvas();
                this.ctx.putImageData(imageData, 0, 0);
                
                // Update display
                this.getContentElement().querySelector('#canvas-size').textContent = `${newWidth} x ${newHeight}`;
                
                this.saveState();
                this.updateStatus(`Canvas resized to ${newWidth} x ${newHeight}`);
            }
        }
    }
    
    cut() {
        this.copy();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.saveState();
    }
    
    copy() {
        this.canvas.toBlob(blob => {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            this.updateStatus('Image copied to clipboard');
        });
    }
    
    paste() {
        navigator.clipboard.read().then(items => {
            for (const item of items) {
                if (item.types.includes('image/png')) {
                    item.getType('image/png').then(blob => {
                        const img = new Image();
                        img.onload = () => {
                            this.ctx.drawImage(img, 0, 0);
                            this.saveState();
                            this.updateStatus('Image pasted');
                        };
                        img.src = URL.createObjectURL(blob);
                    });
                }
            }
        }).catch(() => {
            this.updateStatus('No image in clipboard');
        });
    }
    
    updateCursorPosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        
        this.getContentElement().querySelector('#cursor-position').textContent = `${x}, ${y}`;
    }
    
    updateStatus(message) {
        const statusText = this.getContentElement().querySelector('#paint-status-text');
        statusText.textContent = message;
        
        if (message !== 'Ready') {
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 3000);
        }
    }
    
    handleKeyDown(event) {
        // Ctrl+Z - Undo
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            this.undo();
        }
        
        // Ctrl+Y or Ctrl+Shift+Z - Redo
        if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
            event.preventDefault();
            this.redo();
        }
        
        // Ctrl+S - Save
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.saveImage();
        }
        
        // Ctrl+N - New
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.newCanvas();
        }
        
        // Tool shortcuts
        const toolShortcuts = {
            'b': 'brush',
            'p': 'pencil',
            'e': 'eraser',
            'l': 'line',
            'r': 'rectangle',
            'c': 'circle',
            't': 'text',
            'f': 'fill',
            'i': 'eyedropper'
        };
        
        if (toolShortcuts[event.key.toLowerCase()]) {
            this.selectTool(toolShortcuts[event.key.toLowerCase()]);
        }
    }
    
    cleanup() {
        super.cleanup();
        // Clean up any resources if needed
    }
}

// Register the application
window.PaintApp = PaintApp;