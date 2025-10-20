import React from 'react';
import { useWindowStore } from '../store/windows';
import { Window } from './Window';

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {windows.map((w) => (
        <Window key={w.instanceId} window={w} />
      ))}
    </div>
  );
}
