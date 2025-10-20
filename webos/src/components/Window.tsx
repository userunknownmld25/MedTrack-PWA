import { Rnd } from 'react-rnd';
import { IconMinus, IconSquare, IconX } from '@tabler/icons-react';
import { useWindowStore } from '../store/windows';
import { getAppIcon, getAppTitle } from '../apps/registry';
import { WindowDescriptor } from '../types';
import React from 'react';

interface WindowProps {
  window: WindowDescriptor;
}

export function Window({ window }: WindowProps) {
  const { minimizeWindow, toggleMaximizeWindow, closeWindow, focusWindow, setBounds } = useWindowStore();

  const icon = getAppIcon(window.appId);
  const title = getAppTitle(window.appId);

  const onDragStop = (_: any, data: { x: number; y: number }) => {
    setBounds(window.instanceId, { x: data.x, y: data.y });
  };
  const onResizeStop = (
    _: any,
    __: any,
    ref: HTMLElement,
    ___: any,
    position: { x: number; y: number },
  ) => {
    setBounds(window.instanceId, {
      x: position.x,
      y: position.y,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  const isMaximized = window.maximized;

  const rndProps = isMaximized
    ? {
        size: { width: window.innerWidth, height: window.innerHeight - 48 },
        position: { x: 0, y: 0 },
        enableResizing: false,
        disableDragging: true,
      }
    : {
        size: { width: window.bounds.width, height: window.bounds.height },
        position: { x: window.bounds.x, y: window.bounds.y },
      };

  return (
    <Rnd
      bounds="parent"
      className="window-frame glass"
      style={{ zIndex: window.zIndex, display: window.minimized ? 'none' : undefined }}
      onMouseDown={() => focusWindow(window.instanceId)}
      onDragStop={onDragStop as any}
      onResizeStop={onResizeStop as any}
      {...(rndProps as any)}
      minWidth={480}
      minHeight={280}
    >
      <div className="window-header">
        <div className="window-title">
          <span className="app-icon">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="window-controls">
          <button className="title-button" aria-label="Minimize" onClick={() => minimizeWindow(window.instanceId)}>
            <IconMinus size={16} />
          </button>
          <button className="title-button" aria-label="Maximize" onClick={() => toggleMaximizeWindow(window.instanceId)}>
            <IconSquare size={14} />
          </button>
          <button className="title-button close" aria-label="Close" onClick={() => closeWindow(window.instanceId)}>
            <IconX size={16} />
          </button>
        </div>
      </div>
      <div className="window-content">
        {/* Placeholder content will be replaced by real app mounts later */}
      </div>
    </Rnd>
  );
}
