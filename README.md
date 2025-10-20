# Windows 11 Web OS 🖥️

A comprehensive web-based operating system that replicates Windows 11, featuring a complete desktop environment with fully functional applications - all running entirely in your browser!

![Windows 11 Web OS](https://img.shields.io/badge/Windows%2011-Web%20OS-0078D4?style=for-the-badge&logo=windows)

## 🌟 Features

### Desktop Environment
- **Modern UI**: Inspired by Windows 11's Fluent Design with glassmorphism effects
- **Taskbar**: Fully functional with start menu, app icons, and system tray
- **Window Management**: Drag, minimize, maximize, and close windows
- **Start Menu**: Quick access to all applications with search functionality
- **Desktop Icons**: Double-click to launch applications

### 📱 Included Applications

#### 1. **File Manager** 📂
- Browse folders and files
- Create new folders and files
- Organized file structure with Documents, Pictures, Videos, Downloads
- Persistent storage using localStorage

#### 2. **Text Editor** 📝
- Rich text editing with formatting options
- Bold, italic, underline support
- Font size customization
- Save and load documents

#### 3. **Code Editor** 💻
- Powered by Monaco Editor (VS Code engine)
- Syntax highlighting for multiple languages:
  - JavaScript
  - Python
  - HTML
  - CSS
  - TypeScript
  - JSON
- Run JavaScript and Python code directly
- Dark theme interface
- Save code files

#### 4. **Terminal** 🖥️
- Python support via Pyodide
- Execute Python code directly in the browser
- Built-in commands:
  - `help` - Show available commands
  - `clear` - Clear terminal
  - `echo` - Echo text
  - `dir` - List directories
  - `date` - Show current date
  - `time` - Show current time
  - `python` - Run Python code
  - `calc` - Basic calculator

#### 5. **Web Browser** 🌐
- Fully functional web browser
- URL navigation
- Back, forward, refresh controls
- Sandboxed iframe for security

#### 6. **Paint Application** 🎨
- Drawing canvas
- Brush and eraser tools
- Color picker
- Adjustable brush size
- Save artwork as PNG

#### 7. **Video Editor** 🎬
- Import video files
- Video preview player
- Timeline with multiple tracks
- Video and audio track visualization
- Play/pause controls
- Effects (demo mode)
- Export functionality (demo mode)

#### 8. **Media Player** 🎵
- Play audio and video files
- Playback controls (play, pause, stop)
- Progress bar with seeking
- Mute/unmute functionality
- Visual feedback for audio files

#### 9. **Game Center** 🎮
Games included:
- **Snake**: Classic snake game with arrow key controls
- **Pong**: Retro pong game with mouse controls
- More games coming soon!

#### 10. **Calculator** 🔢
- Basic arithmetic operations (+, -, ×, ÷)
- Clear and backspace functions
- Decimal support
- Modern calculator UI

#### 11. **Settings** ⚙️
- Dark mode toggle
- Wallpaper color customization
- System information
- Clear all data option

#### 12. **App Store** 🏪
Download links to popular development tools:
- **VS Code (Web)**: Official web version
- **Python**: Official Python downloads
- **PyCharm**: JetBrains Python IDE
- **GitHub Desktop**: Git GUI client
- **Node.js**: JavaScript runtime
- **MongoDB Compass**: Database GUI

## 🎨 Design System

### Colors
- **Primary**: `#0078D4` (Windows blue)
- **Secondary**: `#005A9E` (Dark blue)
- **Accent**: `#00BCF2` (Light blue)
- **Background**: `#F3F3F3` (Light grey)
- **Dark Mode**: `#1F1F1F` (Charcoal)
- **Glass**: `#FFFFFF80` (Translucent white)
- **Success**: `#107C10` (Green)

### Typography
- **Primary Font**: Inter, Segoe UI
- **Monospace Font**: JetBrains Mono

### Design Elements
- **Glassmorphism**: Backdrop blur effects
- **Rounded Corners**: 8px border radius
- **Shadows**: Floating window effects
- **Animations**: Smooth transitions
- **Responsive**: Mobile-friendly layout

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Enjoy your Windows 11 Web OS!

```bash
# If using a local server
python -m http.server 8000
# Then open http://localhost:8000
```

## 💡 Usage Tips

### Window Management
- **Drag**: Click and drag the title bar to move windows
- **Minimize**: Click the minus button
- **Maximize**: Click the square button or double-click title bar
- **Close**: Click the X button

### File System
- Files are stored in browser localStorage
- Files persist between sessions
- Clear data in Settings to reset

### Terminal Python
- Python runs via Pyodide (may take a moment to load)
- Example: `python print("Hello World")`
- Full Python 3 support with standard library

### Code Editor
- Select language from dropdown
- Use Run button to execute JavaScript or Python
- Code is syntax-highlighted automatically

## 🛠️ Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Styling and animations
- **JavaScript ES6+**: Application logic
- **Monaco Editor**: Code editing (VS Code engine)
- **Pyodide**: Python in the browser
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Inter, JetBrains Mono)

## 📦 File Structure

```
windows-11-web-os/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling
├── app.js             # Application logic
└── README.md          # This file
```

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (limited functionality)

## 🔒 Security & Privacy

- All data stored locally in browser
- No data sent to external servers
- Browser iframe for web browsing (sandboxed)
- localStorage for file system

## 🎯 Features Highlights

### What Works Fully
- ✅ Window management system
- ✅ File manager with localStorage
- ✅ Text editor with formatting
- ✅ Code editor with syntax highlighting
- ✅ Terminal with Python support
- ✅ Web browser (iframe-based)
- ✅ Paint application with drawing
- ✅ Media player for audio/video
- ✅ Games (Snake, Pong)
- ✅ Calculator
- ✅ Settings and customization
- ✅ App store with external links

### Demo/Placeholder Features
- ⚠️ Video editor effects and export (UI complete)
- ⚠️ Some advanced file operations

## 🎨 Customization

You can customize the OS by:
- Changing wallpaper color in Settings
- Toggling dark mode
- Modifying CSS variables in `styles.css`
- Adding new applications in `app.js`

## 📝 Notes

- **Python Support**: Pyodide loads on startup (may take 10-20 seconds)
- **File Storage**: Limited by browser localStorage (typically 5-10MB)
- **Browser Security**: Some features may be restricted by browser security policies
- **Performance**: Best experienced on desktop browsers with good performance

## 🤝 Contributing

This is a demonstration project showcasing web technologies. Feel free to:
- Fork and modify
- Add new applications
- Improve existing features
- Report issues

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Windows 11 design inspiration from Microsoft
- Monaco Editor from Microsoft
- Pyodide from Mozilla and contributors
- Font Awesome for icons
- Google Fonts for typography

## 📞 Support

For issues or questions:
- Check browser console for errors
- Ensure you're using a modern browser
- Clear browser cache if experiencing issues
- Use Settings > Clear All Data to reset

---

**Enjoy your Windows 11 Web OS experience! 🎉**

Made with ❤️ using modern web technologies
