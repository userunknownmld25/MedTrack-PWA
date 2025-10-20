import React from 'react';
import { appRegistry } from '../apps/registry';
import { useWindowStore } from '../store/windows';

export function StartMenu() {
  const { startMenuOpen, openApp } = useWindowStore();

  return (
    <div className={`start-menu glass ${startMenuOpen ? '' : 'hidden'}`}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Pinned</div>
      <div className="app-grid">
        {appRegistry.map((app) => (
          <div
            key={app.id}
            className="app-tile"
            onClick={() => openApp(app.id)}
            role="button"
            tabIndex={0}
          >
            <div className="app-icon">{app.icon}</div>
            <div className="app-name">{app.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
