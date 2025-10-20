import { AppDefinition } from '../types';
import {
  IconBrandChrome,
  IconFileText,
  IconFolders,
  IconTerminal2,
  IconCode,
  IconBrush,
  IconPlayerPlay,
  IconVideo,
  IconBrandPython,
  IconSettings,
  IconDownload,
  IconBrandJavascript,
  IconDeviceGamepad2,
} from '@tabler/icons-react';
import React from 'react';

function Placeholder({ name }: { name: string }) {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '12px 0' }}>{name}</h3>
      <p>App is initializing...</p>
    </div>
  );
}

export const appRegistry: AppDefinition[] = [
  { id: 'browser', title: 'Browser', icon: <IconBrandChrome size={20} />, defaultSize: { width: 960, height: 600 } },
  { id: 'text-editor', title: 'Text Editor', icon: <IconFileText size={20} />, defaultSize: { width: 800, height: 520 } },
  { id: 'file-manager', title: 'File Manager', icon: <IconFolders size={20} />, defaultSize: { width: 980, height: 600 } },
  { id: 'terminal', title: 'Terminal', icon: <IconTerminal2 size={20} />, defaultSize: { width: 860, height: 520 } },
  { id: 'code-editor', title: 'Code Editor', icon: <IconCode size={20} />, defaultSize: { width: 1000, height: 700 } },
  { id: 'paint', title: 'Paint', icon: <IconBrush size={20} />, defaultSize: { width: 900, height: 620 } },
  { id: 'media-player', title: 'Media Player', icon: <IconPlayerPlay size={20} />, defaultSize: { width: 860, height: 520 } },
  { id: 'video-editor', title: 'Video Editor', icon: <IconVideo size={20} />, defaultSize: { width: 1100, height: 680 } },
  { id: 'snake', title: 'Snake', icon: <IconDeviceGamepad2 size={20} />, defaultSize: { width: 520, height: 520 } },
  { id: 'minesweeper', title: 'Minesweeper', icon: <IconDeviceGamepad2 size={20} />, defaultSize: { width: 520, height: 520 } },
  { id: 'settings', title: 'Settings', icon: <IconSettings size={20} />, defaultSize: { width: 720, height: 560 } },
  { id: 'download-center', title: 'Download Center', icon: <IconDownload size={20} />, defaultSize: { width: 880, height: 560 } },
];

export function getAppDefinition(appId: string): AppDefinition | undefined {
  return appRegistry.find((a) => a.id === appId);
}

export function getAppIcon(appId: string) {
  return getAppDefinition(appId)?.icon;
}

export function getAppTitle(appId: string) {
  return getAppDefinition(appId)?.title ?? appId;
}

export function getDefaultSize(appId: string) {
  return getAppDefinition(appId)?.defaultSize ?? { width: 800, height: 500 };
}

export function PlaceholderApp({ appId }: { appId: string }) {
  const title = getAppTitle(appId);
  return <Placeholder name={title} />;
}
