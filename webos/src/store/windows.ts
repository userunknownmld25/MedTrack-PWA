import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { AppId, Bounds, ThemeMode, WindowDescriptor } from '../types';
import { getAppDefinition, getAppTitle, getDefaultSize } from '../apps/registry';

interface WindowStoreState {
  windows: WindowDescriptor[];
  startMenuOpen: boolean;
  theme: ThemeMode;
  nextZIndex: number;

  openApp: (appId: AppId) => void;
  closeWindow: (instanceId: string) => void;
  minimizeWindow: (instanceId: string) => void;
  toggleMaximizeWindow: (instanceId: string) => void;
  focusWindow: (instanceId: string) => void;
  setBounds: (instanceId: string, bounds: Partial<Bounds>) => void;
  toggleStartMenu: () => void;
  setTheme: (mode: ThemeMode) => void;
}

function getCenteredBounds(width: number, height: number): Bounds {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const x = Math.max(8, Math.round((viewportWidth - width) / 2));
  const y = Math.max(8, Math.round((viewportHeight - height - 60) / 2));
  return { x, y, width, height };
}

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: [],
  startMenuOpen: false,
  theme: 'light',
  nextZIndex: 10,

  openApp: (appId: AppId) => {
    const definition = getAppDefinition(appId);
    const defaultSize = getDefaultSize(appId);
    const title = getAppTitle(appId);

    if (!definition) return;

    if (definition.singleton) {
      const existing = get().windows.find((w) => w.appId === appId);
      if (existing) {
        get().focusWindow(existing.instanceId);
        if (existing.minimized) {
          set({
            windows: get().windows.map((w) =>
              w.instanceId === existing.instanceId ? { ...w, minimized: false } : w,
            ),
          });
        }
        return;
      }
    }

    const instanceId = nanoid();
    const bounds = getCenteredBounds(defaultSize.width, defaultSize.height);
    const newWindow: WindowDescriptor = {
      instanceId,
      appId,
      title,
      bounds,
      zIndex: get().nextZIndex + 1,
      minimized: false,
      maximized: false,
      focused: true,
    };

    set({
      windows: [
        ...get().windows.map((w) => ({ ...w, focused: false })),
        newWindow,
      ],
      nextZIndex: get().nextZIndex + 1,
      startMenuOpen: false,
    });
  },

  closeWindow: (instanceId: string) =>
    set({ windows: get().windows.filter((w) => w.instanceId !== instanceId) }),

  minimizeWindow: (instanceId: string) =>
    set({
      windows: get().windows.map((w) =>
        w.instanceId === instanceId ? { ...w, minimized: true, focused: false } : w,
      ),
    }),

  toggleMaximizeWindow: (instanceId: string) =>
    set({
      windows: get().windows.map((w) =>
        w.instanceId === instanceId ? { ...w, maximized: !w.maximized } : w,
      ),
    }),

  focusWindow: (instanceId: string) =>
    set({
      windows: get().windows.map((w) =>
        w.instanceId === instanceId
          ? { ...w, zIndex: get().nextZIndex + 1, focused: true, minimized: false }
          : { ...w, focused: false },
      ),
      nextZIndex: get().nextZIndex + 1,
    }),

  setBounds: (instanceId: string, bounds: Partial<Bounds>) =>
    set({
      windows: get().windows.map((w) =>
        w.instanceId === instanceId ? { ...w, bounds: { ...w.bounds, ...bounds } } : w,
      ),
    }),

  toggleStartMenu: () => set({ startMenuOpen: !get().startMenuOpen }),

  setTheme: (mode: ThemeMode) => set({ theme: mode }),
}));
