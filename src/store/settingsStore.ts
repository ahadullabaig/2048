/**
 * Zustand settings store
 * Manages user preferences (board size, audio, etc.)
 */

import { create } from 'zustand';
import type { BoardSize } from '../logic/constants';
import { DEFAULT_BOARD_SIZE } from '../logic/constants';

interface SettingsState {
  // Audio settings
  audioEnabled: boolean;
  volume: number; // 0.0 to 1.0

  // Visual settings
  boardSize: BoardSize;
  showParticles: boolean;
  showGrid: boolean;

  // Actions
  setAudioEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setBoardSize: (size: BoardSize) => void;
  setShowParticles: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;

  // Persistence
  _loadSettings: () => void;
  _saveSettings: () => void;
}

/**
 * Load settings from localStorage
 */
function loadSettings(): Partial<SettingsState> {
  try {
    const saved = localStorage.getItem('2048-settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore errors
  }
  return {};
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: Partial<SettingsState>): void {
  try {
    localStorage.setItem('2048-settings', JSON.stringify(settings));
  } catch {
    // Ignore errors
  }
}

/**
 * Create the settings store
 */
export const useSettingsStore = create<SettingsState>((set, get) => {
  const savedSettings = loadSettings();

  return {
    // Default settings with saved overrides
    audioEnabled: savedSettings.audioEnabled ?? true,
    volume: savedSettings.volume ?? 0.5,
    boardSize: savedSettings.boardSize ?? DEFAULT_BOARD_SIZE,
    showParticles: savedSettings.showParticles ?? true,
    showGrid: savedSettings.showGrid ?? true,

    setAudioEnabled: (enabled: boolean) => {
      set({ audioEnabled: enabled });
      get()._saveSettings();
    },

    setVolume: (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      set({ volume: clampedVolume });
      get()._saveSettings();
    },

    setBoardSize: (size: BoardSize) => {
      set({ boardSize: size });
      get()._saveSettings();
    },

    setShowParticles: (show: boolean) => {
      set({ showParticles: show });
      get()._saveSettings();
    },

    setShowGrid: (show: boolean) => {
      set({ showGrid: show });
      get()._saveSettings();
    },

    _loadSettings: () => {
      const settings = loadSettings();
      set(settings);
    },

    _saveSettings: () => {
      const state = get();
      saveSettings({
        audioEnabled: state.audioEnabled,
        volume: state.volume,
        boardSize: state.boardSize,
        showParticles: state.showParticles,
        showGrid: state.showGrid,
      });
    },
  };
});

export default useSettingsStore;
