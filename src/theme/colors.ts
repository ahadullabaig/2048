/**
 * Cyber-glass color palette
 * Each tile value gets a unique neon color with glow effect
 */

import type { TileValue } from '../logic/constants';

export interface TileColor {
  base: string;      // Base color (hex)
  glow: string;      // Glow/emission color (hex)
  intensity: number; // Glow intensity multiplier
}

/**
 * Color scheme: Gradient from cyan → blue → purple → magenta → orange → gold
 * Inspired by cyberpunk/synthwave aesthetics
 */
export const TILE_COLORS: Record<number, TileColor> = {
  0: {
    base: '#1a1a2e',
    glow: '#1a1a2e',
    intensity: 0,
  },
  2: {
    base: '#00D9FF',
    glow: '#00FFFF',
    intensity: 1.0,
  },
  4: {
    base: '#0099FF',
    glow: '#66CCFF',
    intensity: 1.2,
  },
  8: {
    base: '#7B2FFF',
    glow: '#AA66FF',
    intensity: 1.4,
  },
  16: {
    base: '#B026FF',
    glow: '#D966FF',
    intensity: 1.6,
  },
  32: {
    base: '#FF006E',
    glow: '#FF66B2',
    intensity: 1.8,
  },
  64: {
    base: '#FF4D00',
    glow: '#FF8C42',
    intensity: 2.0,
  },
  128: {
    base: '#FF8C00',
    glow: '#FFB347',
    intensity: 2.2,
  },
  256: {
    base: '#FFD700',
    glow: '#FFED4E',
    intensity: 2.4,
  },
  512: {
    base: '#FFED4E',
    glow: '#FFF9A6',
    intensity: 2.6,
  },
  1024: {
    base: '#FFF9A6',
    glow: '#FFFFCC',
    intensity: 2.8,
  },
  2048: {
    base: '#FFFFFF',
    glow: '#FFFFFF',
    intensity: 3.0,
  },
  4096: {
    base: '#FFB3FF',
    glow: '#FFE6FF',
    intensity: 3.2,
  },
  8192: {
    base: '#B3FFFF',
    glow: '#E6FFFF',
    intensity: 3.4,
  },
  16384: {
    base: '#FFB3B3',
    glow: '#FFE6E6',
    intensity: 3.6,
  },
  32768: {
    base: '#B3FFB3',
    glow: '#E6FFE6',
    intensity: 3.8,
  },
  65536: {
    base: '#FFB3E6',
    glow: '#FFE6F9',
    intensity: 4.0,
  },
};

/**
 * Get color for a tile value
 */
export function getTileColor(value: TileValue): TileColor {
  return TILE_COLORS[value] || TILE_COLORS[0];
}

/**
 * Convert hex to RGB array (for Three.js)
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return [0, 0, 0];
  }
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

/**
 * Environment colors
 */
export const ENVIRONMENT_COLORS = {
  background: '#0a0a0f',      // Dark void
  boardBase: '#16161d',       // Board base color
  boardGlow: '#2a2a3e',       // Board edge glow
  gridLines: '#ffffff',       // Grid line color
  gridOpacity: 0.05,          // Grid line opacity
  fog: '#0a0a0f',             // Fog color (matches background)
  ambient: '#4a4a6a',         // Ambient light tint
};

/**
 * UI colors (for HUD overlay)
 */
export const UI_COLORS = {
  primary: '#00D9FF',         // Primary accent (cyan)
  secondary: '#7B2FFF',       // Secondary accent (purple)
  success: '#00FF88',         // Success/win state
  danger: '#FF006E',          // Danger/lose state
  text: '#ffffff',            // Primary text
  textMuted: '#ffffff99',     // Muted text (60% opacity)
  glass: '#ffffff1a',         // Glass background (10% white)
  glassBorder: '#ffffff33',   // Glass border (20% white)
};

/**
 * Get appropriate text color for a tile (dark text on light tiles)
 */
export function getTileTextColor(value: TileValue): string {
  // Use dark text for very bright tiles (Cyan, Gold, Yellow, White, Pastels)
  if (value === 2 || value >= 256) {
    return '#0a0a0f';
  }
  return '#ffffff';
}
