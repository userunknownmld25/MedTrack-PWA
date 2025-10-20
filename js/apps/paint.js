// Paint Application
class PaintApp {
    constructor() {
        this.name = 'Paint';
        this.icon = '🎨';
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.currentSize = 5;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 20;
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="app-toolbar">
                    <button class="toolbar-button" id="new-btn" title="New">📄</button>
                    <button class="toolbar-button" id="open-btn" title="Open">📁</button>
                    <button class="toolbar-button" id="save-btn" title="Save">💾</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="undo-btn" title="Undo">↶</button>
                    <button class="toolbar-button" id="redo-btn" title="Redo">↷</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="zoom-in-btn" title="Zoom In">🔍+</button>
                    <button class="toolbar-button" id="zoom-out-btn" title="Zoom Out">🔍-</button>
                    <button class="toolbar-button" id="zoom-fit-btn" title="Fit to Screen">📐</button>
                </div>
                <div class="paint-canvas-container">
                    <div class="paint-tools">
                        <div class="paint-tool-group">
                            <h4>Tools</h4>
                            <button class="paint-tool active" data-tool="brush">🖌️</button>
                            <button class="paint-tool" data-tool="pencil">✏️</button>
                            <button class="paint-tool" data-tool="eraser">🧽</button>
                            <button class="paint-tool" data-tool="fill">🪣</button>
                            <button class="paint-tool" data-tool="text">📝</button>
                            <button class="paint-tool" data-tool="line">📏</button>
                            <button class="paint-tool" data-tool="rectangle">⬜</button>
                            <button class="paint-tool" data-tool="circle">⭕</button>
                            <button class="paint-tool" data-tool="ellipse">🔵</button>
                            <button class="paint-tool" data-tool="polygon">🔷</button>
                        </div>
                        <div class="paint-tool-group">
                            <h4>Colors</h4>
                            <div class="color-palette">
                                <div class="color-swatch" data-color="#000000" style="background: #000000"></div>
                                <div class="color-swatch" data-color="#FFFFFF" style="background: #FFFFFF"></div>
                                <div class="color-swatch" data-color="#FF0000" style="background: #FF0000"></div>
                                <div class="color-swatch" data-color="#00FF00" style="background: #00FF00"></div>
                                <div class="color-swatch" data-color="#0000FF" style="background: #0000FF"></div>
                                <div class="color-swatch" data-color="#FFFF00" style="background: #FFFF00"></div>
                                <div class="color-swatch" data-color="#FF00FF" style="background: #FF00FF"></div>
                                <div class="color-swatch" data-color="#00FFFF" style="background: #00FFFF"></div>
                                <div class="color-swatch" data-color="#808080" style="background: #808080"></div>
                                <div class="color-swatch" data-color="#800000" style="background: #800000"></div>
                                <div class="color-swatch" data-color="#008000" style="background: #008000"></div>
                                <div class="color-swatch" data-color="#000080" style="background: #000080"></div>
                            </div>
                            <div class="color-picker-container">
                                <input type="color" id="color-picker" value="#000000">
                            </div>
                        </div>
                        <div class="paint-tool-group">
                            <h4>Size</h4>
                            <input type="range" id="brush-size" min="1" max="50" value="5">
                            <div class="size-display" id="size-display">5px</div>
                        </div>
                        <div class="paint-tool-group">
                            <h4>Shapes</h4>
                            <div class="shape-options">
                                <label>
                                    <input type="radio" name="shape-fill" value="outline" checked>
                                    Outline
                                </label>
                                <label>
                                    <input type="radio" name="shape-fill" value="filled">
                                    Filled
                                </label>
                            </div>
                        </div>
                        <div class="paint-tool-group">
                            <h4>Layers</h4>
                            <div class="layer-controls">
                                <button class="layer-btn" id="add-layer-btn">+</button>
                                <button class="layer-btn" id="delete-layer-btn">-</button>
                                <button class="layer-btn" id="duplicate-layer-btn">⧉</button>
                            </div>
                            <div class="layer-list" id="layer-list">
                                <div class="layer-item active">
                                    <span class="layer-name">Layer 1</span>
                                    <div class="layer-visibility">👁️</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="paint-canvas">
                        <canvas id="paint-canvas" width="800" height="600"></canvas>
                        <div class="canvas-overlay" id="canvas-overlay"></div>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.setupCanvas();
        this.setupEventListeners();
        this.saveState();
    }

    setupCanvas() {
        this.canvas = this.container.querySelector('#paint-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas background to white
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set default drawing properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
    }

    setupEventListeners() {
        // Toolbar buttons
        this.container.querySelector('#new-btn').addEventListener('click', () => this.newCanvas());
        this.container.querySelector('#open-btn').addEventListener('click', () => this.openImage());
        this.container.querySelector('#save-btn').addEventListener('click', () => this.saveImage());
        this.container.querySelector('#undo-btn').addEventListener('click', () => this.undo());
        this.container.querySelector('#redo-btn').addEventListener('click', () => this.redo());
        this.container.querySelector('#zoom-in-btn').addEventListener('click', () => this.zoomIn());
        this.container.querySelector('#zoom-out-btn').addEventListener('click', () => this.zoomOut());
        this.container.querySelector('#zoom-fit-btn').addEventListener('click', () => this.zoomFit());

        // Tool selection
        this.container.querySelectorAll('.paint-tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                this.selectTool(e.target.dataset.tool);
            });
        });

        // Color selection
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                this.selectColor(e.target.dataset.color);
            });
        });

        this.container.querySelector('#color-picker').addEventListener('change', (e) => {
            this.selectColor(e.target.value);
        });

        // Brush size
        this.container.querySelector('#brush-size').addEventListener('input', (e) => {
            this.setBrushSize(parseInt(e.target.value));
        });

        // Canvas events
        this.setupCanvasEvents();
    }

    setupCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        this.canvas.addEventListener('mouseout', (e) => this.stopDrawing(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    selectTool(tool) {
        this.currentTool = tool;
        
        // Update tool buttons
        this.container.querySelectorAll('.paint-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        this.container.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        
        // Update cursor
        this.updateCursor();
    }

    selectColor(color) {
        this.currentColor = color;
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        
        // Update color picker
        this.container.querySelector('#color-picker').value = color;
        
        // Update selected color display
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
        });
        this.container.querySelector(`[data-color="${color}"]`).classList.add('selected');
    }

    setBrushSize(size) {
        this.currentSize = size;
        this.ctx.lineWidth = size;
        this.container.querySelector('#size-display').textContent = size + 'px';
    }

    updateCursor() {
        const cursors = {
            'brush': 'crosshair',
            'pencil': 'crosshair',
            'eraser': 'crosshair',
            'fill': 'crosshair',
            'text': 'text',
            'line': 'crosshair',
            'rectangle': 'crosshair',
            'circle': 'crosshair',
            'ellipse': 'crosshair',
            'polygon': 'crosshair'
        };
        
        this.canvas.style.cursor = cursors[this.currentTool] || 'default';
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.lastX = x;
        this.lastY = y;
        
        if (this.currentTool === 'fill') {
            this.floodFill(x, y);
        } else if (this.currentTool === 'text') {
            this.startTextInput(x, y);
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
        }
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch (this.currentTool) {
            case 'brush':
            case 'pencil':
                this.drawBrush(x, y);
                break;
            case 'eraser':
                this.drawEraser(x, y);
                break;
            case 'line':
                this.drawLine(x, y);
                break;
            case 'rectangle':
                this.drawRectangle(x, y);
                break;
            case 'circle':
                this.drawCircle(x, y);
                break;
            case 'ellipse':
                this.drawEllipse(x, y);
                break;
        }
        
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing(e) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        if (this.currentTool === 'line' || 
            this.currentTool === 'rectangle' || 
            this.currentTool === 'circle' || 
            this.currentTool === 'ellipse') {
            this.finishShape();
        }
        
        this.saveState();
    }

    drawBrush(x, y) {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawEraser(x, y) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = this.currentSize;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawLine(x, y) {
        // Clear previous line preview
        this.restoreState();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    drawRectangle(x, y) {
        // Clear previous rectangle preview
        this.restoreState();
        
        const width = x - this.lastX;
        const height = y - this.lastY;
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.rect(this.lastX, this.lastY, width, height);
        this.ctx.stroke();
    }

    drawCircle(x, y) {
        // Clear previous circle preview
        this.restoreState();
        
        const radius = Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2));
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.arc(this.lastX, this.lastY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    drawEllipse(x, y) {
        // Clear previous ellipse preview
        this.restoreState();
        
        const width = x - this.lastX;
        const height = y - this.lastY;
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.ellipse(this.lastX + width/2, this.lastY + height/2, Math.abs(width)/2, Math.abs(height)/2, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    finishShape() {
        // Finalize the shape
        this.ctx.globalCompositeOperation = 'source-over';
    }

    floodFill(x, y) {
        // Simple flood fill implementation
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const targetColor = this.getPixelColor(data, x, y, this.canvas.width);
        const fillColor = this.hexToRgba(this.currentColor);
        
        if (this.colorsEqual(targetColor, fillColor)) return;
        
        const stack = [{x: Math.floor(x), y: Math.floor(y)}];
        const visited = new Set();
        
        while (stack.length > 0) {
            const {x: px, y: py} = stack.pop();
            const key = `${px},${py}`;
            
            if (visited.has(key) || px < 0 || px >= this.canvas.width || py < 0 || py >= this.canvas.height) {
                continue;
            }
            
            visited.add(key);
            const currentColor = this.getPixelColor(data, px, py, this.canvas.width);
            
            if (!this.colorsEqual(currentColor, targetColor)) {
                continue;
            }
            
            this.setPixelColor(data, px, py, fillColor, this.canvas.width);
            
            stack.push({x: px + 1, y: py});
            stack.push({x: px - 1, y: py});
            stack.push({x: px, y: py + 1});
            stack.push({x: px, y: py - 1});
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

    setPixelColor(data, x, y, color, width) {
        const index = (y * width + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a;
    }

    colorsEqual(color1, color2) {
        return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b && color1.a === color2.a;
    }

    hexToRgba(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return {r, g, b, a: 255};
    }

    startTextInput(x, y) {
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        input.style.left = (x + this.canvas.offsetLeft) + 'px';
        input.style.top = (y + this.canvas.offsetTop) + 'px';
        input.style.border = 'none';
        input.style.background = 'transparent';
        input.style.fontSize = this.currentSize + 'px';
        input.style.color = this.currentColor;
        input.style.outline = 'none';
        
        input.addEventListener('blur', () => {
            this.drawText(input.value, x, y);
            input.remove();
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.drawText(input.value, x, y);
                input.remove();
            }
        });
        
        document.body.appendChild(input);
        input.focus();
    }

    drawText(text, x, y) {
        this.ctx.font = `${this.currentSize}px Arial`;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fillText(text, x, y);
    }

    newCanvas() {
        if (confirm('Create a new canvas? This will clear the current drawing.')) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.history = [];
            this.historyIndex = -1;
            this.saveState();
        }
    }

    openImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        this.ctx.drawImage(img, 0, 0);
                        this.saveState();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    saveImage() {
        const link = document.createElement('a');
        link.download = 'paint-drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState();
        }
    }

    saveState() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(imageData);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    restoreState() {
        if (this.historyIndex >= 0 && this.history[this.historyIndex]) {
            this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
        }
    }

    zoomIn() {
        // Zoom in functionality
        console.log('Zoom in');
    }

    zoomOut() {
        // Zoom out functionality
        console.log('Zoom out');
    }

    zoomFit() {
        // Fit to screen functionality
        console.log('Zoom fit');
    }

    cleanup() {
        console.log('Paint cleanup');
    }
}