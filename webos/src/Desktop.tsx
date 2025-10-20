import React from 'react';
import { WindowManager } from './components/WindowManager';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { useWindowStore } from './store/windows';
import './theme.css';

export default function Desktop() {
  const theme = useWindowStore((s) => s.theme);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
    }
  }, [theme]);

  return (
    <div className="desktop">
      <div className="wallpaper" />
      <WindowManager />
      <Taskbar />
      <StartMenu />
    </div>
  );
}
