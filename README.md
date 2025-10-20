# Windows 11 Web OS

A comprehensive web-based operating system that replicates the Windows 11 experience, featuring a complete desktop environment with fully functional applications - all running in the browser.

![Windows 11 Web OS](https://img.shields.io/badge/Windows%2011-Web%20OS-0078D4?style=for-the-badge&logo=windows&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🚀 Features

### Core Desktop Environment
- **Complete Windows 11 UI** - Authentic taskbar, start menu, and desktop environment
- **Window Management** - Drag, resize, minimize, maximize, and snap windows
- **Start Menu** - Pinned apps, recent items, search functionality, and power options
- **System Tray** - Network, volume, battery, and notification indicators
- **Desktop Icons** - Interactive icons with context menus and selection
- **Notification Center** - System notifications and quick settings

### Essential Applications

#### 📁 File Manager
- Full folder navigation and breadcrumb system
- Grid and list view modes with sorting options
- File operations: create, copy, cut, paste, delete, rename
- Search functionality across the file system
- Context menus and keyboard shortcuts
- Sidebar with quick access to common folders

#### 📝 Text Editor
- Complete text editing with find/replace functionality
- Line numbers and cursor position tracking
- File operations: new, open, save, save as
- Customizable font size and family
- Word wrap toggle and character counting
- Undo/redo support with keyboard shortcuts

#### 💻 Code Editor
- Multi-tab interface for editing multiple files
- Syntax highlighting for HTML, CSS, JavaScript, Python, and more
- File explorer sidebar with project navigation
- Auto-indentation and bracket matching
- Find and replace with regex support
- Multiple themes (dark, light, monokai, github)
- Code execution for JavaScript and Python

#### 🖥️ Terminal
- Full command-line interface with Windows CMD commands
- **Python interpreter** with built-in functions and modules
- Command history and tab completion
- File system navigation and manipulation
- Environment variables and system information
- Multiple themes and customizable appearance
- Network utilities (ping, ipconfig) and system tools

#### 🌐 Web Browser
- Tabbed browsing with navigation controls
- Address bar with search functionality
- Bookmark management system
- Download manager and browsing history
- Local file viewing capability
- Security indicators and settings

#### 🎨 Paint Application
- Complete drawing toolkit (brush, pencil, eraser, shapes)
- Color palette and custom color picker
- Canvas resizing and background color options
- Undo/redo functionality with history
- Image import/export capabilities
- Various drawing tools and effects

#### 🎬 Video Editor
- Multi-track timeline for video and audio
- Media browser for importing files
- Basic effects and transitions
- Audio mixer with volume controls
- Export functionality with quality settings
- Timeline zoom and playhead control

#### 🎮 Games
- **Snake** - Classic arcade game with score tracking
- **Memory Game** - Card matching with timer and move counter
- **Tetris** - Block puzzle game (framework ready)
- **2048** - Number combining puzzle
- **Pong** - Classic paddle game
- **Minesweeper** - Logic-based mine detection
- High score tracking and game statistics

#### 🏪 App Store
- Browse and install applications
- Featured apps including VSCode, PyCharm, Python, Git
- Category-based browsing and search
- Installation progress and management
- App details with screenshots and ratings
- Update management system

### 🎨 Design Features

#### Windows 11 Fluent Design
- **Glassmorphism Effects** - Translucent materials with backdrop blur
- **Rounded Corners** - Modern 8px radius throughout the interface
- **Authentic Color Palette** - Windows 11 blue (#0078D4) and semantic colors
- **Typography** - Inter and JetBrains Mono fonts for optimal readability
- **Smooth Animations** - Cubic-bezier transitions and micro-interactions
- **Drop Shadows** - Layered shadows for depth and hierarchy

#### Responsive Design
- Mobile-friendly interface with touch support
- Adaptive layouts for different screen sizes
- Scalable UI components and typography
- Optimized performance for various devices

#### Accessibility
- High contrast mode support
- Reduced motion preferences
- Keyboard navigation throughout
- Screen reader compatible structure
- Focus indicators and ARIA labels

## 🛠️ Technical Implementation

### Architecture
- **Modular Design** - Separate files for each component and application
- **Event-Driven** - Comprehensive event handling and state management
- **Virtual File System** - Complete file system simulation with persistence
- **Window Management** - Advanced window handling with snapping and animations
- **Application Framework** - Base classes for easy application development

### File Structure
```
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Core styles and variables
│   ├── desktop.css        # Desktop environment styling
│   ├── taskbar.css        # Taskbar and system tray
│   ├── startmenu.css      # Start menu and navigation
│   ├── windows.css        # Window management styles
│   ├── applications.css   # Application-specific styles
│   ├── notifications.css  # Notification system
│   └── enhancements.css   # Advanced effects and animations
├── js/
│   ├── core/
│   │   ├── filesystem.js  # Virtual file system
│   │   ├── window-manager.js # Window management
│   │   ├── desktop.js     # Desktop environment
│   │   ├── taskbar.js     # Taskbar functionality
│   │   └── startmenu.js   # Start menu system
│   ├── applications/
│   │   ├── file-manager.js # File manager application
│   │   ├── text-editor.js  # Text editor application
│   │   ├── code-editor.js  # Code editor application
│   │   ├── terminal.js     # Terminal application
│   │   ├── browser.js      # Web browser application
│   │   ├── paint.js        # Paint application
│   │   ├── video-editor.js # Video editor application
│   │   ├── games.js        # Games collection
│   │   └── app-store.js    # App store application
│   └── main.js            # Main application system
└── assets/                # Icons and media files
```

### Key Technologies
- **HTML5** - Semantic markup and modern web standards
- **CSS3** - Advanced styling with custom properties and animations
- **Vanilla JavaScript** - No external dependencies for core functionality
- **Canvas API** - For paint application and game graphics
- **Local Storage** - Data persistence and user preferences
- **Web APIs** - File handling, clipboard, and system integration

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Wait for loading** - The system will initialize automatically
4. **Explore the desktop** - Click on icons or use the start menu to launch applications

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Minimum 1024x768 screen resolution
- 2GB+ RAM recommended for optimal performance

## 🎯 Usage Guide

### Desktop Navigation
- **Single-click** to select desktop icons
- **Double-click** to open applications
- **Right-click** for context menus
- **Drag selection** to select multiple icons
- **Keyboard shortcuts** for common actions

### Window Management
- **Drag title bar** to move windows
- **Drag edges/corners** to resize windows
- **Double-click title bar** to maximize/restore
- **Snap to edges** for automatic window arrangement
- **Alt+Tab** to switch between windows

### Application Features
- **File Manager** - Navigate folders, manage files, search content
- **Text Editor** - Edit documents with full formatting options
- **Code Editor** - Multi-language syntax highlighting and project management
- **Terminal** - Execute commands and run Python scripts
- **Browser** - Browse web content and manage bookmarks
- **Paint** - Create digital artwork with professional tools
- **Video Editor** - Edit videos with timeline and effects
- **Games** - Play classic games with score tracking

### Keyboard Shortcuts
- `Windows Key` - Open/close start menu
- `Windows + S` - Focus search box
- `Windows + L` - Lock screen (simulated)
- `Alt + Tab` - Switch between applications
- `Alt + F4` - Close active window
- `F11` - Toggle fullscreen mode
- `Ctrl + Alt + T` - Open terminal
- `Ctrl + Alt + F` - Open file manager

## 🎨 Customization

### Themes and Appearance
- Multiple color themes (light/dark mode)
- Customizable desktop backgrounds
- Adjustable window transparency
- Font size and family options
- Icon size and arrangement

### Application Settings
- Terminal themes and font sizes
- Code editor syntax highlighting
- Browser homepage and bookmarks
- Paint tool preferences
- Game difficulty settings

## 🔧 Development

### Adding New Applications
1. Create a new application class extending `BaseApplication`
2. Implement required methods: `render()`, `setupEventListeners()`, `loadData()`
3. Register the application in `main.js`
4. Add application icon and styling
5. Update start menu and desktop icons

### Extending Functionality
- Add new file types to the virtual file system
- Implement additional terminal commands
- Create new games or tools
- Enhance existing applications
- Add system utilities and settings

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended browser |
| Firefox 88+ | ✅ Full | All features supported |
| Safari 14+ | ✅ Full | WebKit optimizations |
| Edge 90+ | ✅ Full | Chromium-based |
| Mobile Safari | ⚠️ Limited | Touch interface needs optimization |
| Mobile Chrome | ⚠️ Limited | Some features may not work on mobile |

## 🤝 Contributing

This is a demonstration project showcasing web-based operating system capabilities. Feel free to:
- Report issues or bugs
- Suggest new features or improvements
- Submit pull requests for enhancements
- Create additional applications or games
- Improve mobile responsiveness

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed.

## 🙏 Acknowledgments

- **Microsoft** - For Windows 11 design inspiration and Fluent Design system
- **Font Awesome** - For the comprehensive icon library
- **Google Fonts** - For Inter and JetBrains Mono typography
- **Web Standards** - For the APIs and technologies that make this possible

## 🔮 Future Enhancements

- Real Python interpreter integration (Pyodide)
- WebRTC video calling application
- Advanced photo editing capabilities
- Music production software
- 3D graphics and modeling tools
- Virtual machine support
- Cloud storage integration
- Multi-user support and authentication

---

**Windows 11 Web OS** - Bringing the desktop experience to the web! 🌐✨