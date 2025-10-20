// Advanced Video Editor System
class VideoEditor {
    constructor() {
        this.timeline = [];
        this.currentTime = 0;
        this.isPlaying = false;
        this.playbackRate = 1;
        this.zoomLevel = 1;
        this.selectedClip = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeVideoEditor();
        });
    }

    initializeVideoEditor() {
        const videoEditor = document.querySelector('.video-editor-content');
        if (!videoEditor) return;

        // Setup toolbar events
        this.setupToolbarEvents();
        
        // Setup timeline events
        this.setupTimelineEvents();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Initialize timeline
        this.initializeTimeline();
    }

    setupToolbarEvents() {
        const toolbar = document.querySelector('.video-toolbar');
        if (!toolbar) return;

        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-button');
            if (button) {
                const action = button.dataset.action;
                this.handleAction(action);
            }
        });
    }

    setupTimelineEvents() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.addEventListener('click', (e) => {
            const clip = e.target.closest('.timeline-clip');
            if (clip) {
                this.selectClip(clip);
            }
        });

        timeline.addEventListener('dblclick', (e) => {
            const clip = e.target.closest('.timeline-clip');
            if (clip) {
                this.editClip(clip);
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.isVideoEditorActive()) return;

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.seekBackward();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.seekForward();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.seekToStart();
                    break;
                case 'End':
                    e.preventDefault();
                    this.seekToEnd();
                    break;
            }

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
                        this.saveProject();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.openProject();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newProject();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportVideo();
                        break;
                }
            }

            if (e.key === 'Delete' && this.selectedClip) {
                this.deleteClip(this.selectedClip);
            }
        });
    }

    isVideoEditorActive() {
        const activeWindow = document.querySelector('.window.focused');
        return activeWindow && activeWindow.querySelector('.video-editor-content');
    }

    handleAction(action) {
        switch (action) {
            case 'import':
                this.importMedia();
                break;
            case 'play':
                this.play();
                break;
            case 'pause':
                this.pause();
                break;
            case 'stop':
                this.stop();
                break;
            case 'cut':
                this.cutClip();
                break;
            case 'copy':
                this.copyClip();
                break;
            case 'paste':
                this.pasteClip();
                break;
            case 'add-text':
                this.addTextClip();
                break;
            case 'add-effect':
                this.addEffect();
                break;
            case 'export':
                this.exportVideo();
                break;
            case 'zoom-in':
                this.zoomIn();
                break;
            case 'zoom-out':
                this.zoomOut();
                break;
        }
    }

    initializeTimeline() {
        // Add some sample clips
        this.addClip({
            type: 'video',
            name: 'Sample Video 1',
            startTime: 0,
            duration: 10,
            track: 0
        });

        this.addClip({
            type: 'audio',
            name: 'Background Music',
            startTime: 2,
            duration: 15,
            track: 1
        });

        this.addClip({
            type: 'text',
            name: 'Title Text',
            startTime: 5,
            duration: 3,
            track: 2
        });

        this.updateTimelineDisplay();
    }

    addClip(clipData) {
        const clip = {
            id: 'clip-' + Date.now(),
            ...clipData,
            selected: false
        };
        
        this.timeline.push(clip);
        this.updateTimelineDisplay();
    }

    updateTimelineDisplay() {
        const timelineTracks = document.querySelector('.timeline-tracks');
        if (!timelineTracks) return;

        // Group clips by track
        const tracks = {};
        this.timeline.forEach(clip => {
            if (!tracks[clip.track]) {
                tracks[clip.track] = [];
            }
            tracks[clip.track].push(clip);
        });

        // Generate HTML
        const html = Object.keys(tracks).map(trackIndex => {
            const trackClips = tracks[trackIndex];
            const trackName = this.getTrackName(parseInt(trackIndex));
            
            return `
                <div class="timeline-track">
                    <div class="track-label">${trackName}</div>
                    <div class="track-content">
                        ${trackClips.map(clip => this.createClipHTML(clip)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        timelineTracks.innerHTML = html;
    }

    getTrackName(trackIndex) {
        const trackNames = {
            0: 'Video 1',
            1: 'Audio 1',
            2: 'Text',
            3: 'Effects'
        };
        return trackNames[trackIndex] || `Track ${trackIndex + 1}`;
    }

    createClipHTML(clip) {
        const left = (clip.startTime / this.zoomLevel) * 100;
        const width = (clip.duration / this.zoomLevel) * 100;
        const color = this.getClipColor(clip.type);
        
        return `
            <div class="timeline-clip ${clip.selected ? 'selected' : ''}" 
                 data-clip-id="${clip.id}"
                 style="left: ${left}%; width: ${width}%; background: ${color};">
                <div class="clip-label">${clip.name}</div>
                <div class="clip-duration">${clip.duration}s</div>
            </div>
        `;
    }

    getClipColor(type) {
        const colors = {
            'video': '#0078D4',
            'audio': '#107C10',
            'text': '#FF8C00',
            'effect': '#D13438',
            'image': '#00BCF2'
        };
        return colors[type] || '#666666';
    }

    selectClip(clipElement) {
        // Deselect all clips
        document.querySelectorAll('.timeline-clip').forEach(clip => {
            clip.classList.remove('selected');
        });
        
        // Select current clip
        clipElement.classList.add('selected');
        
        const clipId = clipElement.dataset.clipId;
        this.selectedClip = this.timeline.find(clip => clip.id === clipId);
    }

    editClip(clipElement) {
        const clipId = clipElement.dataset.clipId;
        const clip = this.timeline.find(c => c.id === clipId);
        
        if (clip) {
            this.showClipProperties(clip);
        }
    }

    showClipProperties(clip) {
        const properties = `
            Name: ${clip.name}
            Type: ${clip.type}
            Start Time: ${clip.startTime}s
            Duration: ${clip.duration}s
            Track: ${clip.track}
        `;
        
        this.showNotification('Video Editor', properties);
    }

    importMedia() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,audio/*,image/*';
        input.multiple = true;
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                this.addClip({
                    type: this.getMediaType(file.type),
                    name: file.name,
                    startTime: this.getCurrentTime(),
                    duration: 10, // Default duration
                    track: 0
                });
            });
        };
        input.click();
    }

    getMediaType(mimeType) {
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.startsWith('image/')) return 'image';
        return 'unknown';
    }

    getCurrentTime() {
        return this.currentTime;
    }

    play() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.showNotification('Video Editor', 'Playing...');
    }

    pause() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.showNotification('Video Editor', 'Paused');
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.updatePlayButton();
        this.showNotification('Video Editor', 'Stopped');
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updatePlayButton() {
        const playButton = document.querySelector('[data-action="play"]');
        const pauseButton = document.querySelector('[data-action="pause"]');
        
        if (playButton && pauseButton) {
            playButton.style.display = this.isPlaying ? 'none' : 'inline-block';
            pauseButton.style.display = this.isPlaying ? 'inline-block' : 'none';
        }
    }

    seekBackward() {
        this.currentTime = Math.max(0, this.currentTime - 1);
        this.updateTimeDisplay();
    }

    seekForward() {
        this.currentTime += 1;
        this.updateTimeDisplay();
    }

    seekToStart() {
        this.currentTime = 0;
        this.updateTimeDisplay();
    }

    seekToEnd() {
        const maxTime = Math.max(...this.timeline.map(clip => clip.startTime + clip.duration));
        this.currentTime = maxTime;
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        const timeDisplay = document.querySelector('.time-display');
        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(this.currentTime);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    cutClip() {
        if (this.selectedClip) {
            this.showNotification('Video Editor', `Cut clip: ${this.selectedClip.name}`);
        }
    }

    copyClip() {
        if (this.selectedClip) {
            this.showNotification('Video Editor', `Copied clip: ${this.selectedClip.name}`);
        }
    }

    pasteClip() {
        this.showNotification('Video Editor', 'Pasted clip');
    }

    deleteClip(clipElement) {
        const clipId = clipElement.dataset.clipId;
        this.timeline = this.timeline.filter(clip => clip.id !== clipId);
        this.updateTimelineDisplay();
        this.showNotification('Video Editor', 'Clip deleted');
    }

    addTextClip() {
        const text = prompt('Enter text:');
        if (text) {
            this.addClip({
                type: 'text',
                name: text,
                startTime: this.getCurrentTime(),
                duration: 5,
                track: 2
            });
        }
    }

    addEffect() {
        const effects = ['Fade In', 'Fade Out', 'Zoom', 'Rotate', 'Blur'];
        const effect = prompt('Select effect:\n' + effects.map((e, i) => `${i + 1}. ${e}`).join('\n'));
        
        if (effect) {
            this.showNotification('Video Editor', `Added effect: ${effect}`);
        }
    }

    exportVideo() {
        const format = prompt('Select export format:\n1. MP4\n2. AVI\n3. MOV\n4. WebM');
        if (format) {
            this.showNotification('Video Editor', `Exporting video in ${format} format...`);
        }
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 5);
        this.updateTimelineDisplay();
        this.showNotification('Video Editor', `Zoom: ${this.zoomLevel.toFixed(1)}x`);
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.1);
        this.updateTimelineDisplay();
        this.showNotification('Video Editor', `Zoom: ${this.zoomLevel.toFixed(1)}x`);
    }

    undo() {
        this.showNotification('Video Editor', 'Undo feature coming soon!');
    }

    redo() {
        this.showNotification('Video Editor', 'Redo feature coming soon!');
    }

    saveProject() {
        const projectName = prompt('Enter project name:');
        if (projectName) {
            const projectData = {
                name: projectName,
                timeline: this.timeline,
                currentTime: this.currentTime,
                zoomLevel: this.zoomLevel
            };
            
            localStorage.setItem('video-editor-project', JSON.stringify(projectData));
            this.showNotification('Video Editor', `Project saved: ${projectName}`);
        }
    }

    openProject() {
        const projectData = localStorage.getItem('video-editor-project');
        if (projectData) {
            const project = JSON.parse(projectData);
            this.timeline = project.timeline || [];
            this.currentTime = project.currentTime || 0;
            this.zoomLevel = project.zoomLevel || 1;
            this.updateTimelineDisplay();
            this.showNotification('Video Editor', `Project loaded: ${project.name}`);
        } else {
            this.showNotification('Video Editor', 'No saved project found');
        }
    }

    newProject() {
        if (confirm('Start a new project? Current work will be lost.')) {
            this.timeline = [];
            this.currentTime = 0;
            this.zoomLevel = 1;
            this.updateTimelineDisplay();
            this.showNotification('Video Editor', 'New project created');
        }
    }

    // Advanced features
    addTransition(clip1, clip2, transitionType) {
        this.showNotification('Video Editor', `Added ${transitionType} transition`);
    }

    addAudioEffect(clip, effectType) {
        this.showNotification('Video Editor', `Added ${effectType} audio effect`);
    }

    addVideoEffect(clip, effectType) {
        this.showNotification('Video Editor', `Added ${effectType} video effect`);
    }

    adjustClipSpeed(clip, speed) {
        clip.duration = clip.duration / speed;
        this.updateTimelineDisplay();
        this.showNotification('Video Editor', `Adjusted speed to ${speed}x`);
    }

    splitClip(clip, splitTime) {
        const newClip = {
            ...clip,
            id: 'clip-' + Date.now(),
            startTime: clip.startTime + splitTime,
            duration: clip.duration - splitTime
        };
        
        clip.duration = splitTime;
        this.timeline.push(newClip);
        this.updateTimelineDisplay();
        this.showNotification('Video Editor', 'Clip split');
    }

    mergeClips(clip1, clip2) {
        clip1.duration += clip2.duration;
        this.timeline = this.timeline.filter(clip => clip.id !== clip2.id);
        this.updateTimelineDisplay();
        this.showNotification('Video Editor', 'Clips merged');
    }

    showNotification(title, message) {
        if (window.webOS) {
            window.webOS.showNotification(title, message);
        } else {
            console.log(`${title}: ${message}`);
        }
    }
}

// Initialize video editor
window.videoEditor = new VideoEditor();