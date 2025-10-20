import React from 'react';
import { IconWindows, IconNetwork, IconClock, IconBrightnessUp, IconSun } from '@tabler/icons-react';
import { appRegistry } from '../apps/registry';
import { useWindowStore } from '../store/windows';

function Clock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { month: 'short', day: '2-digit' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
      <div style={{ fontSize: 12 }}>{time}</div>
      <div style={{ fontSize: 10, opacity: 0.8 }}>{date}</div>
    </div>
  );
}

export function Taskbar() {
  const { openApp, toggleStartMenu, startMenuOpen, theme, setTheme } = useWindowStore();
  return (
    <div className="taskbar glass">
      <button className="start-button" onClick={toggleStartMenu} aria-pressed={startMenuOpen}>
        <IconWindows size={22} />
      </button>
      <div className="taskbar-apps">
        {appRegistry.slice(0, 8).map((app) => (
          <button key={app.id} className="taskbar-item" onClick={() => openApp(app.id)}>
            {app.icon}
            <span style={{ fontSize: 12 }}>{app.title}</span>
          </button>
        ))}
      </div>
      <div className="system-tray">
        <button className="taskbar-item" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle theme">
          <IconSun size={18} />
        </button>
        <button className="taskbar-item" title="Network">
          <IconNetwork size={18} />
        </button>
        <button className="taskbar-item" title="Brightness">
          <IconBrightnessUp size={18} />
        </button>
        <Clock />
      </div>
    </div>
  );
}
