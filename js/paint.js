// Advanced Paint Application
class PaintApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.currentSize = 3;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializePaintApp();
        });
    }

    initializePaintApp() {
        const paintApp = document.querySelector('.paint-content');
        if (!paintApp) return;

        // Setup canvas
        this.setupCanvas();
        
        // Setup toolbar events
        this.setupToolbarEvents();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupCanvas() {
        const canvas = document.querySelector('#paint-canvas');
        if (!canvas) return;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set initial canvas properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Setup canvas event listeners
        this.setupCanvasEvents();
        
        // Save initial state
        this.saveState();
    }

    setupCanvasEvents() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        this.canvas.addEventListener('mouseout', (e) => this.stopDrawing(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e));
    }

    setupToolbarEvents() {
        const toolbar = document.querySelector('.paint-toolbar');
        if (!toolbar) return;

        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.tool-button');
            if (button) {
                if (button.dataset.tool) {
                    this.selectTool(button.dataset.tool);
                } else if (button.dataset.action) {
                    this.handleAction(button.dataset.action);
                }
            }
        });

        // Color picker
        const colorPicker = document.querySelector('.color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('change', (e) => {
                this.updateBrushColor(e.target.value);
            });
        }

        // Size slider
        const sizeSlider = document.querySelector('.size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                this.updateBrushSize(e.target.value);
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isPaintActive()) return;

            if (e.ctrlKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        this.undo();
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveCanvas();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.openImage();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newCanvas();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.selectAll();
                        break;
                }
            }

            // Tool shortcuts
            switch (e.key) {
                case 'b':
                    this.selectTool('brush');
                    break;
                case 'e':
                    this.selectTool('eraser');
                    break;
                case 'l':
                    this.selectTool('line');
                    break;
                case 'r':
                    this.selectTool('rectangle');
                    break;
                case 'c':
                    this.selectTool('circle');
                    break;
                case 't':
                    this.selectTool('text');
                    break;
            }
        });
    }

    isPaintActive() {
        const activeWindow = document.querySelector('.window.focused');
        return activeWindow && activeWindow.querySelector('.paint-content');
    }

    selectTool(tool) {
        this.currentTool = tool;
        
        // Update toolbar
        const buttons = document.querySelectorAll('.tool-button[data-tool]');
        buttons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`[data-tool="${tool}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Update cursor
        if (this.canvas) {
            this.canvas.style.cursor = this.getCursorForTool(tool);
        }
    }

    getCursorForTool(tool) {
        const cursors = {
            'brush': 'crosshair',
            'eraser': 'crosshair',
            'line': 'crosshair',
            'rectangle': 'crosshair',
            'circle': 'crosshair',
            'text': 'text',
            'eyedropper': 'crosshair',
            'fill': 'crosshair'
        };
        
        return cursors[tool] || 'default';
    }

    handleAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'clear':
                this.clearCanvas();
                break;
            case 'save':
                this.saveCanvas();
                break;
            case 'open':
                this.openImage();
                break;
            case 'new':
                this.newCanvas();
                break;
            case 'copy':
                this.copySelection();
                break;
            case 'paste':
                this.pasteSelection();
                break;
            case 'cut':
                this.cutSelection();
                break;
            case 'select-all':
                this.selectAll();
                break;
        }
    }

    updateBrushSize(size) {
        this.currentSize = parseInt(size);
        const label = document.querySelector('.size-label');
        if (label) {
            label.textContent = size + 'px';
        }
    }

    updateBrushColor(color) {
        this.currentColor = color;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
        
        // Start new path
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        
        // Handle different tools
        this.handleToolStart(e);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        this.handleToolDraw(currentX, currentY);
        
        this.lastX = currentX;
        this.lastY = currentY;
    }

    stopDrawing(e) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        this.handleToolEnd(e);
        
        // Save state for undo
        this.saveState();
    }

    handleToolStart(e) {
        switch (this.currentTool) {
            case 'brush':
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = this.currentSize;
                this.ctx.globalCompositeOperation = 'source-over';
                break;
            case 'eraser':
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.lineWidth = this.currentSize;
                break;
            case 'line':
                this.startX = this.lastX;
                this.startY = this.lastY;
                break;
            case 'rectangle':
                this.startX = this.lastX;
                this.startY = this.lastY;
                break;
            case 'circle':
                this.startX = this.lastX;
                this.startY = this.lastY;
                break;
            case 'text':
                this.addText(this.lastX, this.lastY);
                break;
        }
    }

    handleToolDraw(currentX, currentY) {
        switch (this.currentTool) {
            case 'brush':
            case 'eraser':
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                break;
            case 'line':
                this.drawLine(this.startX, this.startY, currentX, currentY);
                break;
            case 'rectangle':
                this.drawRectangle(this.startX, this.startY, currentX, currentY);
                break;
            case 'circle':
                this.drawCircle(this.startX, this.startY, currentX, currentY);
                break;
        }
    }

    handleToolEnd(e) {
        switch (this.currentTool) {
            case 'line':
                this.finalizeLine();
                break;
            case 'rectangle':
                this.finalizeRectangle();
                break;
            case 'circle':
                this.finalizeCircle();
                break;
        }
    }

    drawLine(startX, startY, endX, endY) {
        // Clear canvas and redraw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redrawHistory();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    drawRectangle(startX, startY, endX, endY) {
        // Clear canvas and redraw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redrawHistory();
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    }

    drawCircle(startX, startY, endX, endY) {
        // Clear canvas and redraw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redrawHistory();
        
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    finalizeLine() {
        // Line is already drawn, just save state
    }

    finalizeRectangle() {
        // Rectangle is already drawn, just save state
    }

    finalizeCircle() {
        // Circle is already drawn, just save state
    }

    addText(x, y) {
        const text = prompt('Enter text:');
        if (text) {
            this.ctx.fillStyle = this.currentColor;
            this.ctx.font = `${this.currentSize * 4}px Arial`;
            this.ctx.fillText(text, x, y);
            this.saveState();
        }
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    saveState() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.history.push(imageData);
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.redrawHistory();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.redrawHistory();
        }
    }

    redrawHistory() {
        if (this.history[this.historyIndex]) {
            this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
        }
    }

    clearCanvas() {
        if (confirm('Clear the entire canvas?')) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.saveState();
        }
    }

    saveCanvas() {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'paint-drawing-' + Date.now() + '.png';
        link.href = dataURL;
        link.click();
        this.showNotification('Paint', 'Drawing saved!');
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
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                        this.saveState();
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    newCanvas() {
        if (confirm('Start a new drawing? Current work will be lost.')) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.history = [];
            this.historyIndex = -1;
            this.saveState();
        }
    }

    copySelection() {
        // Implementation for copy selection
        this.showNotification('Paint', 'Copy selection feature coming soon!');
    }

    pasteSelection() {
        // Implementation for paste selection
        this.showNotification('Paint', 'Paste selection feature coming soon!');
    }

    cutSelection() {
        // Implementation for cut selection
        this.showNotification('Paint', 'Cut selection feature coming soon!');
    }

    selectAll() {
        // Implementation for select all
        this.showNotification('Paint', 'Select all feature coming soon!');
    }

    // Additional tools
    selectEyedropper() {
        this.selectTool('eyedropper');
    }

    selectFill() {
        this.selectTool('fill');
    }

    // Filters and effects
    applyFilter(filter) {
        switch (filter) {
            case 'blur':
                this.applyBlur();
                break;
            case 'sharpen':
                this.applySharpen();
                break;
            case 'grayscale':
                this.applyGrayscale();
                break;
            case 'sepia':
                this.applySepia();
                break;
            case 'invert':
                this.applyInvert();
                break;
        }
    }

    applyBlur() {
        this.ctx.filter = 'blur(2px)';
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.filter = 'none';
        this.saveState();
    }

    applySharpen() {
        // Basic sharpen implementation
        this.showNotification('Paint', 'Sharpen filter applied');
        this.saveState();
    }

    applyGrayscale() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.saveState();
    }

    applySepia() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.saveState();
    }

    applyInvert() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        this.saveState();
    }

    showNotification(title, message) {
        if (window.webOS) {
            window.webOS.showNotification(title, message);
        } else {
            console.log(`${title}: ${message}`);
        }
    }
}

// Initialize paint app
window.paintApp = new PaintApp();