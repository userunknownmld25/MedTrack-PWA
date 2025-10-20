// Video Editor Application
class VideoEditorApp {
    constructor() {
        this.name = 'Video Editor';
        this.icon = '🎬';
        this.timeline = [];
        this.currentTime = 0;
        this.duration = 0;
        this.isPlaying = false;
        this.zoom = 1;
        this.selectedTrack = 0;
    }

    getHTML() {
        return `
            <div class="app-content">
                <div class="app-toolbar">
                    <button class="toolbar-button" id="new-project-btn" title="New Project">📄</button>
                    <button class="toolbar-button" id="open-project-btn" title="Open Project">📁</button>
                    <button class="toolbar-button" id="save-project-btn" title="Save Project">💾</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="import-media-btn" title="Import Media">📥</button>
                    <button class="toolbar-button" id="export-video-btn" title="Export Video">📤</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="undo-btn" title="Undo">↶</button>
                    <button class="toolbar-button" id="redo-btn" title="Redo">↷</button>
                    <div class="toolbar-separator"></div>
                    <button class="toolbar-button" id="cut-btn" title="Cut">✂️</button>
                    <button class="toolbar-button" id="copy-btn" title="Copy">📋</button>
                    <button class="toolbar-button" id="paste-btn" title="Paste">📄</button>
                </div>
                <div class="video-editor-main">
                    <div class="video-preview">
                        <div class="preview-container">
                            <video id="preview-video" controls>
                                <source src="" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                            <div class="preview-overlay">
                                <div class="time-display" id="time-display">00:00 / 00:00</div>
                                <div class="playback-controls">
                                    <button id="play-pause-btn">▶️</button>
                                    <button id="stop-btn">⏹️</button>
                                    <button id="rewind-btn">⏪</button>
                                    <button id="fast-forward-btn">⏩</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="timeline-container">
                        <div class="timeline-header">
                            <div class="track-labels">
                                <div class="track-label">Video 1</div>
                                <div class="track-label">Audio 1</div>
                                <div class="track-label">Audio 2</div>
                            </div>
                            <div class="timeline-ruler" id="timeline-ruler">
                                <!-- Time markers will be added here -->
                            </div>
                        </div>
                        <div class="timeline-tracks" id="timeline-tracks">
                            <div class="track" data-track="0">
                                <div class="track-content">
                                    <!-- Video clips will be added here -->
                                </div>
                            </div>
                            <div class="track" data-track="1">
                                <div class="track-content">
                                    <!-- Audio clips will be added here -->
                                </div>
                            </div>
                            <div class="track" data-track="2">
                                <div class="track-content">
                                    <!-- Audio clips will be added here -->
                                </div>
                            </div>
                        </div>
                        <div class="timeline-controls">
                            <div class="zoom-controls">
                                <button id="zoom-out-btn">🔍-</button>
                                <span id="zoom-level">100%</span>
                                <button id="zoom-in-btn">🔍+</button>
                            </div>
                            <div class="playhead-container">
                                <div class="playhead" id="playhead"></div>
                            </div>
                        </div>
                    </div>
                    <div class="media-library">
                        <div class="library-header">
                            <h3>Media Library</h3>
                            <button id="add-media-btn">+ Add Media</button>
                        </div>
                        <div class="media-grid" id="media-grid">
                            <div class="media-item">
                                <div class="media-thumbnail">🎬</div>
                                <div class="media-name">Sample Video 1</div>
                            </div>
                            <div class="media-item">
                                <div class="media-thumbnail">🎵</div>
                                <div class="media-name">Background Music</div>
                            </div>
                            <div class="media-item">
                                <div class="media-thumbnail">🖼️</div>
                                <div class="media-name">Image 1</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init(container, windowId) {
        this.container = container;
        this.windowId = windowId;
        this.setupEventListeners();
        this.initializeTimeline();
    }

    setupEventListeners() {
        // Toolbar buttons
        this.container.querySelector('#new-project-btn').addEventListener('click', () => this.newProject());
        this.container.querySelector('#open-project-btn').addEventListener('click', () => this.openProject());
        this.container.querySelector('#save-project-btn').addEventListener('click', () => this.saveProject());
        this.container.querySelector('#import-media-btn').addEventListener('click', () => this.importMedia());
        this.container.querySelector('#export-video-btn').addEventListener('click', () => this.exportVideo());
        this.container.querySelector('#undo-btn').addEventListener('click', () => this.undo());
        this.container.querySelector('#redo-btn').addEventListener('click', () => this.redo());
        this.container.querySelector('#cut-btn').addEventListener('click', () => this.cut());
        this.container.querySelector('#copy-btn').addEventListener('click', () => this.copy());
        this.container.querySelector('#paste-btn').addEventListener('click', () => this.paste());

        // Playback controls
        this.container.querySelector('#play-pause-btn').addEventListener('click', () => this.togglePlayback());
        this.container.querySelector('#stop-btn').addEventListener('click', () => this.stop());
        this.container.querySelector('#rewind-btn').addEventListener('click', () => this.rewind());
        this.container.querySelector('#fast-forward-btn').addEventListener('click', () => this.fastForward());

        // Timeline controls
        this.container.querySelector('#zoom-in-btn').addEventListener('click', () => this.zoomIn());
        this.container.querySelector('#zoom-out-btn').addEventListener('click', () => this.zoomOut());

        // Media library
        this.container.querySelector('#add-media-btn').addEventListener('click', () => this.addMedia());
        this.setupMediaLibraryListeners();

        // Timeline interactions
        this.setupTimelineListeners();
    }

    setupMediaLibraryListeners() {
        this.container.querySelectorAll('.media-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.mediaId || 'sample');
            });
        });
    }

    setupTimelineListeners() {
        const timelineTracks = this.container.querySelector('#timeline-tracks');
        
        timelineTracks.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        timelineTracks.addEventListener('drop', (e) => {
            e.preventDefault();
            const mediaId = e.dataTransfer.getData('text/plain');
            const track = e.target.closest('.track');
            if (track) {
                this.addClipToTrack(mediaId, track.dataset.track, e.offsetX);
            }
        });

        // Playhead dragging
        const playhead = this.container.querySelector('#playhead');
        playhead.addEventListener('mousedown', (e) => this.startPlayheadDrag(e));
    }

    initializeTimeline() {
        this.updateTimelineRuler();
        this.updateTimeDisplay();
    }

    updateTimelineRuler() {
        const ruler = this.container.querySelector('#timeline-ruler');
        ruler.innerHTML = '';
        
        const duration = Math.max(this.duration, 60); // Minimum 60 seconds
        const interval = duration > 300 ? 30 : 10; // 30s intervals for long videos, 10s for short
        
        for (let i = 0; i <= duration; i += interval) {
            const marker = document.createElement('div');
            marker.className = 'time-marker';
            marker.style.left = (i / duration * 100) + '%';
            marker.textContent = this.formatTime(i);
            ruler.appendChild(marker);
        }
    }

    updateTimeDisplay() {
        const timeDisplay = this.container.querySelector('#time-display');
        timeDisplay.textContent = `${this.formatTime(this.currentTime)} / ${this.formatTime(this.duration)}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    addClipToTrack(mediaId, trackId, position) {
        const track = this.container.querySelector(`[data-track="${trackId}"] .track-content`);
        const clip = document.createElement('div');
        clip.className = 'timeline-clip';
        clip.dataset.mediaId = mediaId;
        clip.style.left = position + 'px';
        clip.style.width = '100px'; // Default width
        clip.textContent = this.getMediaName(mediaId);
        
        track.appendChild(clip);
        
        // Make clip draggable
        this.makeClipDraggable(clip);
    }

    makeClipDraggable(clip) {
        clip.draggable = true;
        clip.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', clip.dataset.mediaId);
        });
    }

    getMediaName(mediaId) {
        const names = {
            'sample': 'Sample Video 1',
            'music': 'Background Music',
            'image': 'Image 1'
        };
        return names[mediaId] || 'Media';
    }

    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        const btn = this.container.querySelector('#play-pause-btn');
        btn.textContent = this.isPlaying ? '⏸️' : '▶️';
        
        if (this.isPlaying) {
            this.startPlayback();
        } else {
            this.pausePlayback();
        }
    }

    startPlayback() {
        // Simulate video playback
        this.playbackInterval = setInterval(() => {
            this.currentTime += 0.1;
            this.updatePlayhead();
            this.updateTimeDisplay();
            
            if (this.currentTime >= this.duration) {
                this.stop();
            }
        }, 100);
    }

    pausePlayback() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.container.querySelector('#play-pause-btn').textContent = '▶️';
        this.pausePlayback();
        this.updatePlayhead();
        this.updateTimeDisplay();
    }

    rewind() {
        this.currentTime = Math.max(0, this.currentTime - 5);
        this.updatePlayhead();
        this.updateTimeDisplay();
    }

    fastForward() {
        this.currentTime = Math.min(this.duration, this.currentTime + 5);
        this.updatePlayhead();
        this.updateTimeDisplay();
    }

    updatePlayhead() {
        const playhead = this.container.querySelector('#playhead');
        const percentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        playhead.style.left = percentage + '%';
    }

    startPlayheadDrag(e) {
        const timeline = this.container.querySelector('.timeline-container');
        const rect = timeline.getBoundingClientRect();
        
        const handleMouseMove = (e) => {
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            this.currentTime = (percentage / 100) * this.duration;
            this.updatePlayhead();
            this.updateTimeDisplay();
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    zoomIn() {
        this.zoom = Math.min(5, this.zoom * 1.2);
        this.updateZoom();
    }

    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom / 1.2);
        this.updateZoom();
    }

    updateZoom() {
        const tracks = this.container.querySelectorAll('.track-content');
        tracks.forEach(track => {
            track.style.transform = `scaleX(${this.zoom})`;
        });
        
        this.container.querySelector('#zoom-level').textContent = Math.round(this.zoom * 100) + '%';
    }

    newProject() {
        if (confirm('Create a new project? This will clear the current timeline.')) {
            this.timeline = [];
            this.currentTime = 0;
            this.duration = 0;
            this.clearTimeline();
        }
    }

    openProject() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const project = JSON.parse(e.target.result);
                        this.loadProject(project);
                    } catch (error) {
                        alert('Error loading project: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    saveProject() {
        const project = {
            timeline: this.timeline,
            duration: this.duration,
            zoom: this.zoom
        };
        
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video-project.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    loadProject(project) {
        this.timeline = project.timeline || [];
        this.duration = project.duration || 0;
        this.zoom = project.zoom || 1;
        this.updateTimelineRuler();
        this.updateZoom();
    }

    importMedia() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,audio/*,image/*';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.addMediaFile(file);
            });
        };
        input.click();
    }

    addMediaFile(file) {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.dataset.mediaId = file.name;
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'media-thumbnail';
        
        if (file.type.startsWith('video/')) {
            thumbnail.textContent = '🎬';
        } else if (file.type.startsWith('audio/')) {
            thumbnail.textContent = '🎵';
        } else if (file.type.startsWith('image/')) {
            thumbnail.textContent = '🖼️';
        } else {
            thumbnail.textContent = '📄';
        }
        
        const name = document.createElement('div');
        name.className = 'media-name';
        name.textContent = file.name;
        
        mediaItem.appendChild(thumbnail);
        mediaItem.appendChild(name);
        
        this.container.querySelector('#media-grid').appendChild(mediaItem);
        
        // Make draggable
        mediaItem.draggable = true;
        mediaItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', file.name);
        });
    }

    addMedia() {
        this.importMedia();
    }

    exportVideo() {
        alert('Video export functionality would be implemented here. This would process the timeline and generate a video file.');
    }

    undo() {
        console.log('Undo action');
    }

    redo() {
        console.log('Redo action');
    }

    cut() {
        console.log('Cut selected clips');
    }

    copy() {
        console.log('Copy selected clips');
    }

    paste() {
        console.log('Paste clips');
    }

    clearTimeline() {
        this.container.querySelectorAll('.timeline-clip').forEach(clip => {
            clip.remove();
        });
    }

    cleanup() {
        this.pausePlayback();
        console.log('Video Editor cleanup');
    }
}