import { ReactNode } from 'react';

export type AppId =
  | 'browser'
  | 'text-editor'
  | 'file-manager'
  | 'terminal'
  | 'code-editor'
  | 'paint'
  | 'media-player'
  | 'video-editor'
  | 'snake'
  | 'minesweeper'
  | 'settings'
  | 'download-center';

export type ThemeMode = 'light' | 'dark';

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowDescriptor {
  instanceId: string; // unique per window instance
  appId: AppId;
  title: string;
  bounds: Bounds;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: ReactNode;
  defaultSize: { width: number; height: number };
  singleton?: boolean;
}
