// Video Editor Application for Windows 11 Web OS

class VideoEditorApp extends BaseApplication {
    constructor(options = {}) {
        super(options);
        
        this.defaultWidth = 1200;
        this.defaultHeight = 800;
        this.minWidth = 800;
        this.minHeight = 600;
        
        this.currentProject = null;
        this.timeline = [];
        this.playhead = 0;
        this.isPlaying = false;
        this.zoom = 1;
        this.selectedClip = null;
        
        this.tracks = [
            { id: 'video1', name: 'Video Track 1', type: 'video', clips: [] },
            { id: 'video2', name: 'Video Track 2', type: 'video', clips: [] },
            { id: 'audio1', name: 'Audio Track 1', type: 'audio', clips: [] },
            { id: 'audio2', name: 'Audio Track 2', type: 'audio', clips: [] }
        ];
        
        this.effects = [
            { id: 'fade-in', name: 'Fade In', type: 'transition' },
            { id: 'fade-out', name: 'Fade Out', type: 'transition' },
            { id: 'blur', name: 'Blur', type: 'effect' },
            { id: 'brightness', name: 'Brightness', type: 'effect' },
            { id: 'contrast', name: 'Contrast', type: 'effect' },
            { id: 'saturation', name: 'Saturation', type: 'effect' }
        ];
    }
    
    render() {
        return `
            <div class="video-editor">
                <div class="app-toolbar">
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ve-new" title="New Project">
                            <i class="fas fa-file"></i>
                            <span>New</span>
                        </button>
                        <button class="app-button" id="ve-open" title="Open Project">
                            <i class="fas fa-folder-open"></i>
                            <span>Open</span>
                        </button>
                        <button class="app-button" id="ve-save" title="Save Project">
                            <i class="fas fa-save"></i>
                            <span>Save</span>
                        </button>
                        <button class="app-button" id="ve-export" title="Export Video">
                            <i class="fas fa-download"></i>
                            <span>Export</span>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ve-undo" title="Undo" disabled>
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="app-button" id="ve-redo" title="Redo" disabled>
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ve-cut" title="Cut Clip">
                            <i class="fas fa-cut"></i>
                        </button>
                        <button class="app-button" id="ve-copy" title="Copy Clip">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="app-button" id="ve-paste" title="Paste Clip">
                            <i class="fas fa-paste"></i>
                        </button>
                        <button class="app-button" id="ve-delete" title="Delete Clip">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-separator"></div>
                    
                    <div class="app-toolbar-group">
                        <button class="app-button" id="ve-zoom-in" title="Zoom In">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button class="app-button" id="ve-zoom-out" title="Zoom Out">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <button class="app-button" id="ve-fit" title="Fit to Window">
                            <i class="fas fa-expand-arrows-alt"></i>
                        </button>
                    </div>
                    
                    <div class="app-toolbar-group" style="margin-left: auto;">
                        <span id="ve-timecode">00:00:00</span>
                        <span class="status-separator">|</span>
                        <span id="ve-fps">30 FPS</span>
                        <span class="status-separator">|</span>
                        <span id="ve-resolution">1920x1080</span>
                    </div>
                </div>
                
                <div class="video-editor-main">
                    <div class="video-editor-left">
                        <div class="media-browser">
                            <div class="panel-header">
                                <h4>Media Browser</h4>
                                <div class="panel-actions">
                                    <button class="btn btn-ghost" id="import-media" title="Import Media">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="media-list" id="media-list">
                                <div class="empty-state">
                                    <i class="fas fa-film"></i>
                                    <p>No media files</p>
                                    <button class="btn btn-primary" id="import-media-btn">Import Media</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="effects-panel">
                            <div class="panel-header">
                                <h4>Effects</h4>
                            </div>
                            <div class="effects-list">
                                ${this.effects.map(effect => `
                                    <div class="effect-item" data-effect-id="${effect.id}">
                                        <div class="effect-icon">
                                            <i class="fas fa-magic"></i>
                                        </div>
                                        <div class="effect-name">${effect.name}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="video-editor-center">
                        <div class="video-preview">
                            <div class="preview-container">
                                <div class="video-preview-element" id="video-preview">
                                    <div class="preview-placeholder">
                                        <i class="fas fa-play-circle"></i>
                                        <p>Preview</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="video-controls">
                                <button class="control-btn" id="play-pause">
                                    <i class="fas fa-play"></i>
                                </button>
                                <button class="control-btn" id="stop">
                                    <i class="fas fa-stop"></i>
                                </button>
                                <button class="control-btn" id="prev-frame">
                                    <i class="fas fa-step-backward"></i>
                                </button>
                                <button class="control-btn" id="next-frame">
                                    <i class="fas fa-step-forward"></i>
                                </button>
                                <div class="volume-control">
                                    <i class="fas fa-volume-up"></i>
                                    <input type="range" id="volume-slider" min="0" max="100" value="100">
                                </div>
                            </div>
                        </div>
                        
                        <div class="video-timeline">
                            <div class="timeline-header">
                                <div class="timeline-controls">
                                    <button class="btn btn-ghost" id="add-track">
                                        <i class="fas fa-plus"></i> Add Track
                                    </button>
                                    <div class="timeline-zoom">
                                        <label>Zoom:</label>
                                        <input type="range" id="timeline-zoom" min="0.1" max="5" step="0.1" value="1">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="timeline-content">
                                <div class="timeline-tracks" id="timeline-tracks">
                                    ${this.tracks.map(track => `
                                        <div class="timeline-track" data-track-id="${track.id}">
                                            <div class="track-header">
                                                <div class="track-name">${track.name}</div>
                                                <div class="track-controls">
                                                    <button class="track-mute" title="Mute">
                                                        <i class="fas fa-volume-up"></i>
                                                    </button>
                                                    <button class="track-solo" title="Solo">
                                                        <i class="fas fa-headphones"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="track-content" data-track-id="${track.id}">
                                                <!-- Clips will be added here -->
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="timeline-ruler" id="timeline-ruler">
                                    <!-- Time markers will be generated here -->
                                </div>
                                
                                <div class="playhead" id="playhead"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="video-editor-right">
                        <div class="properties-panel">
                            <div class="panel-header">
                                <h4>Properties</h4>
                            </div>
                            <div class="properties-content" id="properties-content">
                                <div class="empty-state">
                                    <i class="fas fa-cog"></i>
                                    <p>Select a clip to edit properties</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="audio-mixer">
                            <div class="panel-header">
                                <h4>Audio Mixer</h4>
                            </div>
                            <div class="mixer-content">
                                <div class="audio-channel">
                                    <div class="channel-label">Master</div>
                                    <div class="channel-fader">
                                        <input type="range" orient="vertical" min="0" max="100" value="75">
                                    </div>
                                    <div class="channel-meter">
                                        <div class="meter-bar"></div>
                                    </div>
                                </div>
                                <div class="audio-channel">
                                    <div class="channel-label">Track 1</div>
                                    <div class="channel-fader">
                                        <input type="range" orient="vertical" min="0" max="100" value="75">
                                    </div>
                                    <div class="channel-meter">
                                        <div class="meter-bar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="video-editor-status">
                    <div class="status-left">
                        <span id="ve-status-text">Ready</span>
                    </div>
                    <div class="status-right">
                        <span id="ve-project-name">Untitled Project</span>
                        <span class="status-separator">|</span>
                        <span id="ve-duration">00:00:00</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        const content = this.getContentElement();
        if (!content) return;
        
        // Toolbar buttons
        content.querySelector('#ve-new').addEventListener('click', () => this.newProject());
        content.querySelector('#ve-open').addEventListener('click', () => this.openProject());
        content.querySelector('#ve-save').addEventListener('click', () => this.saveProject());
        content.querySelector('#ve-export').addEventListener('click', () => this.exportVideo());
        
        content.querySelector('#ve-undo').addEventListener('click', () => this.undo());
        content.querySelector('#ve-redo').addEventListener('click', () => this.redo());
        
        content.querySelector('#ve-cut').addEventListener('click', () => this.cutClip());
        content.querySelector('#ve-copy').addEventListener('click', () => this.copyClip());
        content.querySelector('#ve-paste').addEventListener('click', () => this.pasteClip());
        content.querySelector('#ve-delete').addEventListener('click', () => this.deleteClip());
        
        content.querySelector('#ve-zoom-in').addEventListener('click', () => this.zoomIn());
        content.querySelector('#ve-zoom-out').addEventListener('click', () => this.zoomOut());
        content.querySelector('#ve-fit').addEventListener('click', () => this.fitToWindow());
        
        // Media import
        content.querySelector('#import-media').addEventListener('click', () => this.importMedia());
        content.querySelector('#import-media-btn').addEventListener('click', () => this.importMedia());
        
        // Video controls
        content.querySelector('#play-pause').addEventListener('click', () => this.togglePlayback());
        content.querySelector('#stop').addEventListener('click', () => this.stopPlayback());
        content.querySelector('#prev-frame').addEventListener('click', () => this.previousFrame());
        content.querySelector('#next-frame').addEventListener('click', () => this.nextFrame());
        
        // Volume control
        content.querySelector('#volume-slider').addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });
        
        // Timeline zoom
        content.querySelector('#timeline-zoom').addEventListener('input', (e) => {
            this.setTimelineZoom(e.target.value);
        });
        
        // Track controls
        content.querySelectorAll('.track-mute').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleTrackMute(e.target.closest('.timeline-track')));
        });
        
        content.querySelectorAll('.track-solo').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleTrackSolo(e.target.closest('.timeline-track')));
        });
        
        // Effects
        content.querySelectorAll('.effect-item').forEach(item => {
            item.addEventListener('dragstart', (e) => this.startEffectDrag(e));
        });
        
        // Timeline interactions
        const timeline = content.querySelector('#timeline-tracks');
        timeline.addEventListener('click', (e) => this.handleTimelineClick(e));
        timeline.addEventListener('dragover', (e) => this.handleTimelineDragOver(e));
        timeline.addEventListener('drop', (e) => this.handleTimelineDrop(e));
        
        // Keyboard shortcuts
        content.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    loadData() {
        this.newProject();
        this.updateTimeline();
        this.updateStatus('Video editor ready');
    }
    
    newProject() {
        this.currentProject = {
            name: 'Untitled Project',
            width: 1920,
            height: 1080,
            fps: 30,
            duration: 0
        };
        
        // Clear all tracks
        this.tracks.forEach(track => {
            track.clips = [];
        });
        
        this.playhead = 0;
        this.selectedClip = null;
        
        this.updateProjectInfo();
        this.updateTimeline();
        this.updateProperties();
        this.updateStatus('New project created');
    }
    
    openProject() {
        // In a real implementation, this would open a file dialog
        const projectData = prompt('Enter project data (JSON):');
        if (projectData) {
            try {
                const project = JSON.parse(projectData);
                this.currentProject = project;
                this.updateProjectInfo();
                this.updateTimeline();
                this.updateStatus('Project opened');
            } catch (error) {
                this.updateStatus('Failed to open project');
            }
        }
    }
    
    saveProject() {
        if (!this.currentProject) return;
        
        const projectData = {
            ...this.currentProject,
            tracks: this.tracks,
            playhead: this.playhead
        };
        
        // In a real implementation, this would save to a file
        console.log('Project data:', JSON.stringify(projectData, null, 2));
        this.updateStatus('Project saved');
    }
    
    exportVideo() {
        const dialog = document.createElement('div');
        dialog.className = 'export-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            padding: var(--spacing-lg);
        `;
        
        dialog.innerHTML = `
            <div class="export-dialog-content">
                <h3>Export Video</h3>
                
                <div class="export-settings">
                    <div class="setting-group">
                        <label>Format:</label>
                        <select class="app-select">
                            <option value="mp4">MP4 (H.264)</option>
                            <option value="webm">WebM</option>
                            <option value="avi">AVI</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label>Quality:</label>
                        <select class="app-select">
                            <option value="high">High (1080p)</option>
                            <option value="medium">Medium (720p)</option>
                            <option value="low">Low (480p)</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label>Frame Rate:</label>
                        <select class="app-select">
                            <option value="30">30 FPS</option>
                            <option value="60">60 FPS</option>
                            <option value="24">24 FPS</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label>Output File:</label>
                        <input type="text" class="app-input" value="my-video.mp4">
                    </div>
                </div>
                
                <div class="export-actions">
                    <button class="btn btn-secondary" id="cancel-export">Cancel</button>
                    <button class="btn btn-primary" id="start-export">Export</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        dialog.querySelector('#cancel-export').addEventListener('click', () => {
            dialog.remove();
        });
        
        dialog.querySelector('#start-export').addEventListener('click', () => {
            dialog.remove();
            this.startExport();
        });
    }
    
    startExport() {
        // Show export progress
        const progressDialog = document.createElement('div');
        progressDialog.className = 'export-progress-dialog';
        progressDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-heavy);
            z-index: 10000;
            padding: var(--spacing-lg);
        `;
        
        progressDialog.innerHTML = `
            <div class="export-progress-content">
                <h3>Exporting Video</h3>
                <div class="progress-bar" style="
                    width: 100%;
                    height: 8px;
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                    overflow: hidden;
                    margin: var(--spacing-md) 0;
                ">
                    <div class="progress-fill" style="
                        height: 100%;
                        background: var(--primary-blue);
                        width: 0%;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div class="progress-text">Initializing...</div>
                <div class="export-stats">
                    <div>Time remaining: Calculating...</div>
                    <div>Frame: 0 / 900</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(progressDialog);
        
        // Simulate export progress
        let progress = 0;
        const progressFill = progressDialog.querySelector('.progress-fill');
        const progressText = progressDialog.querySelector('.progress-text');
        
        const exportInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            progressText.textContent = `Rendering frame ${Math.floor(progress * 9)}...`;
            
            if (progress >= 100) {
                clearInterval(exportInterval);
                progressText.textContent = 'Export complete!';
                
                setTimeout(() => {
                    progressDialog.remove();
                    this.updateStatus('Video exported successfully');
                }, 1000);
            }
        }, 200);
    }
    
    importMedia() {
        // Simulate media import
        const mediaTypes = [
            { name: 'sample-video.mp4', type: 'video', duration: 30, thumbnail: 'fas fa-film' },
            { name: 'background-music.mp3', type: 'audio', duration: 120, thumbnail: 'fas fa-music' },
            { name: 'intro-clip.mp4', type: 'video', duration: 5, thumbnail: 'fas fa-film' }
        ];
        
        const mediaList = this.getContentElement().querySelector('#media-list');
        
        // Clear empty state
        mediaList.innerHTML = '';
        
        mediaTypes.forEach(media => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.draggable = true;
            mediaItem.setAttribute('data-media-type', media.type);
            mediaItem.setAttribute('data-duration', media.duration);
            
            mediaItem.innerHTML = `
                <div class="media-thumbnail">
                    <i class="${media.thumbnail}"></i>
                </div>
                <div class="media-info">
                    <div class="media-name">${media.name}</div>
                    <div class="media-duration">${this.formatTime(media.duration)}</div>
                </div>
            `;
            
            mediaItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(media));
            });
            
            mediaList.appendChild(mediaItem);
        });
        
        this.updateStatus('Media imported');
    }
    
    togglePlayback() {
        const playPauseBtn = this.getContentElement().querySelector('#play-pause i');
        
        if (this.isPlaying) {
            this.isPlaying = false;
            playPauseBtn.className = 'fas fa-play';
            this.updateStatus('Playback paused');
        } else {
            this.isPlaying = true;
            playPauseBtn.className = 'fas fa-pause';
            this.updateStatus('Playing');
            this.startPlayback();
        }
    }
    
    startPlayback() {
        if (!this.isPlaying) return;
        
        // Simulate playback
        const playbackInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(playbackInterval);
                return;
            }
            
            this.playhead += 1/30; // 30 FPS
            this.updatePlayhead();
            this.updateTimecode();
            
            // Stop at end of timeline
            if (this.playhead >= this.getTimelineDuration()) {
                this.stopPlayback();
                clearInterval(playbackInterval);
            }
        }, 1000/30);
    }
    
    stopPlayback() {
        this.isPlaying = false;
        this.playhead = 0;
        
        const playPauseBtn = this.getContentElement().querySelector('#play-pause i');
        playPauseBtn.className = 'fas fa-play';
        
        this.updatePlayhead();
        this.updateTimecode();
        this.updateStatus('Playback stopped');
    }
    
    previousFrame() {
        this.playhead = Math.max(0, this.playhead - 1/30);
        this.updatePlayhead();
        this.updateTimecode();
    }
    
    nextFrame() {
        this.playhead = Math.min(this.getTimelineDuration(), this.playhead + 1/30);
        this.updatePlayhead();
        this.updateTimecode();
    }
    
    setVolume(volume) {
        // Update master volume
        this.updateStatus(`Volume: ${volume}%`);
    }
    
    setTimelineZoom(zoom) {
        this.zoom = parseFloat(zoom);
        this.updateTimeline();
        this.updateStatus(`Timeline zoom: ${Math.round(zoom * 100)}%`);
    }
    
    handleTimelineClick(e) {
        const timelineContent = e.currentTarget;
        const rect = timelineContent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Calculate time position
        const timelineWidth = rect.width;
        const duration = this.getTimelineDuration();
        const clickTime = (x / timelineWidth) * duration;
        
        this.playhead = Math.max(0, Math.min(duration, clickTime));
        this.updatePlayhead();
        this.updateTimecode();
    }
    
    handleTimelineDragOver(e) {
        e.preventDefault();
    }
    
    handleTimelineDrop(e) {
        e.preventDefault();
        
        const mediaData = e.dataTransfer.getData('text/plain');
        if (!mediaData) return;
        
        try {
            const media = JSON.parse(mediaData);
            const track = e.target.closest('.track-content');
            
            if (track) {
                const trackId = track.getAttribute('data-track-id');
                this.addClipToTrack(trackId, media, e.offsetX);
            }
        } catch (error) {
            console.error('Failed to drop media:', error);
        }
    }
    
    addClipToTrack(trackId, media, position) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        const clip = {
            id: `clip-${Date.now()}`,
            name: media.name,
            type: media.type,
            duration: media.duration,
            startTime: position / 100, // Convert pixel position to time
            effects: []
        };
        
        track.clips.push(clip);
        this.updateTimeline();
        this.updateStatus(`Added ${media.name} to ${track.name}`);
    }
    
    updateTimeline() {
        const timelineTracks = this.getContentElement().querySelector('#timeline-tracks');
        
        this.tracks.forEach(track => {
            const trackContent = timelineTracks.querySelector(`[data-track-id="${track.id}"]`);
            if (!trackContent) return;
            
            const trackContentElement = trackContent.querySelector('.track-content');
            trackContentElement.innerHTML = '';
            
            track.clips.forEach(clip => {
                const clipElement = document.createElement('div');
                clipElement.className = 'timeline-clip';
                clipElement.setAttribute('data-clip-id', clip.id);
                clipElement.style.left = (clip.startTime * 100) + 'px';
                clipElement.style.width = (clip.duration * 10) + 'px';
                
                clipElement.innerHTML = `
                    <div class="clip-content">
                        <div class="clip-name">${clip.name}</div>
                        <div class="clip-duration">${this.formatTime(clip.duration)}</div>
                    </div>
                `;
                
                clipElement.addEventListener('click', () => this.selectClip(clip));
                
                trackContentElement.appendChild(clipElement);
            });
        });
        
        this.updatePlayhead();
    }
    
    selectClip(clip) {
        // Remove previous selection
        this.getContentElement().querySelectorAll('.timeline-clip').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new clip
        const clipElement = this.getContentElement().querySelector(`[data-clip-id="${clip.id}"]`);
        if (clipElement) {
            clipElement.classList.add('selected');
        }
        
        this.selectedClip = clip;
        this.updateProperties();
        this.updateStatus(`Selected: ${clip.name}`);
    }
    
    updateProperties() {
        const propertiesContent = this.getContentElement().querySelector('#properties-content');
        
        if (!this.selectedClip) {
            propertiesContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-cog"></i>
                    <p>Select a clip to edit properties</p>
                </div>
            `;
            return;
        }
        
        const clip = this.selectedClip;
        
        propertiesContent.innerHTML = `
            <div class="properties-form">
                <div class="property-group">
                    <label>Name:</label>
                    <input type="text" class="app-input" value="${clip.name}" id="clip-name">
                </div>
                
                <div class="property-group">
                    <label>Duration:</label>
                    <input type="number" class="app-input" value="${clip.duration}" step="0.1" id="clip-duration">
                </div>
                
                <div class="property-group">
                    <label>Start Time:</label>
                    <input type="number" class="app-input" value="${clip.startTime}" step="0.1" id="clip-start">
                </div>
                
                <div class="property-group">
                    <label>Opacity:</label>
                    <input type="range" min="0" max="100" value="100" id="clip-opacity">
                    <span>100%</span>
                </div>
                
                <div class="property-group">
                    <label>Volume:</label>
                    <input type="range" min="0" max="100" value="100" id="clip-volume">
                    <span>100%</span>
                </div>
                
                <div class="property-actions">
                    <button class="btn btn-primary" id="apply-properties">Apply</button>
                    <button class="btn btn-secondary" id="reset-properties">Reset</button>
                </div>
            </div>
        `;
        
        // Add event listeners for property changes
        propertiesContent.querySelector('#apply-properties').addEventListener('click', () => {
            this.applyClipProperties();
        });
        
        propertiesContent.querySelector('#reset-properties').addEventListener('click', () => {
            this.updateProperties();
        });
    }
    
    applyClipProperties() {
        if (!this.selectedClip) return;
        
        const propertiesContent = this.getContentElement().querySelector('#properties-content');
        
        this.selectedClip.name = propertiesContent.querySelector('#clip-name').value;
        this.selectedClip.duration = parseFloat(propertiesContent.querySelector('#clip-duration').value);
        this.selectedClip.startTime = parseFloat(propertiesContent.querySelector('#clip-start').value);
        
        this.updateTimeline();
        this.updateStatus('Properties applied');
    }
    
    updatePlayhead() {
        const playhead = this.getContentElement().querySelector('#playhead');
        const timelineWidth = this.getContentElement().querySelector('#timeline-tracks').offsetWidth;
        const duration = this.getTimelineDuration();
        
        if (duration > 0) {
            const position = (this.playhead / duration) * timelineWidth;
            playhead.style.left = position + 'px';
        }
    }
    
    updateTimecode() {
        const timecode = this.getContentElement().querySelector('#ve-timecode');
        timecode.textContent = this.formatTime(this.playhead);
    }
    
    updateProjectInfo() {
        if (!this.currentProject) return;
        
        const content = this.getContentElement();
        content.querySelector('#ve-project-name').textContent = this.currentProject.name;
        content.querySelector('#ve-resolution').textContent = `${this.currentProject.width}x${this.currentProject.height}`;
        content.querySelector('#ve-fps').textContent = `${this.currentProject.fps} FPS`;
    }
    
    getTimelineDuration() {
        let maxDuration = 0;
        
        this.tracks.forEach(track => {
            track.clips.forEach(clip => {
                const endTime = clip.startTime + clip.duration;
                if (endTime > maxDuration) {
                    maxDuration = endTime;
                }
            });
        });
        
        return Math.max(maxDuration, 60); // Minimum 60 seconds
    }
    
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    cutClip() {
        if (this.selectedClip) {
            // Cut clip at playhead position
            this.updateStatus('Clip cut');
        }
    }
    
    copyClip() {
        if (this.selectedClip) {
            this.updateStatus('Clip copied');
        }
    }
    
    pasteClip() {
        this.updateStatus('Clip pasted');
    }
    
    deleteClip() {
        if (this.selectedClip) {
            // Remove clip from track
            this.tracks.forEach(track => {
                track.clips = track.clips.filter(clip => clip.id !== this.selectedClip.id);
            });
            
            this.selectedClip = null;
            this.updateTimeline();
            this.updateProperties();
            this.updateStatus('Clip deleted');
        }
    }
    
    zoomIn() {
        this.zoom = Math.min(5, this.zoom * 1.2);
        this.getContentElement().querySelector('#timeline-zoom').value = this.zoom;
        this.updateTimeline();
    }
    
    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom / 1.2);
        this.getContentElement().querySelector('#timeline-zoom').value = this.zoom;
        this.updateTimeline();
    }
    
    fitToWindow() {
        this.zoom = 1;
        this.getContentElement().querySelector('#timeline-zoom').value = this.zoom;
        this.updateTimeline();
    }
    
    toggleTrackMute(trackElement) {
        const muteBtn = trackElement.querySelector('.track-mute i');
        
        if (muteBtn.classList.contains('fa-volume-up')) {
            muteBtn.className = 'fas fa-volume-mute';
            trackElement.classList.add('muted');
        } else {
            muteBtn.className = 'fas fa-volume-up';
            trackElement.classList.remove('muted');
        }
    }
    
    toggleTrackSolo(trackElement) {
        const soloBtn = trackElement.querySelector('.track-solo');
        soloBtn.classList.toggle('active');
    }
    
    undo() {
        this.updateStatus('Undo');
    }
    
    redo() {
        this.updateStatus('Redo');
    }
    
    handleKeyDown(event) {
        // Space - Play/Pause
        if (event.code === 'Space') {
            event.preventDefault();
            this.togglePlayback();
        }
        
        // Delete - Delete selected clip
        if (event.key === 'Delete') {
            this.deleteClip();
        }
        
        // Ctrl+Z - Undo
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            event.preventDefault();
            this.undo();
        }
        
        // Ctrl+Y - Redo
        if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
            event.preventDefault();
            this.redo();
        }
    }
    
    updateStatus(message) {
        const statusText = this.getContentElement().querySelector('#ve-status-text');
        statusText.textContent = message;
        
        if (message !== 'Ready') {
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 3000);
        }
    }
    
    cleanup() {
        super.cleanup();
        
        // Stop any running playback
        this.isPlaying = false;
    }
}

// Register the application
window.VideoEditorApp = VideoEditorApp;