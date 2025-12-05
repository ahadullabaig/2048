/**
 * React Spring animation configurations
 * Physics-based presets for smooth, natural movement
 */

import type { SpringConfig } from '@react-spring/three';

/**
 * Spring physics presets for different animation types
 */
export const SPRING_CONFIGS: Record<string, SpringConfig> = {
  // Tile movement (arrow key press)
  move: {
    mass: 1,
    tension: 280,
    friction: 26,
    clamp: false,
  },

  // Tile spawn (new tile appearing)
  spawn: {
    mass: 0.8,
    tension: 280,
    friction: 18,
    clamp: false,
  },

  // Tile merge (two tiles combining)
  merge: {
    mass: 1.2,
    tension: 300,
    friction: 20,
    clamp: false,
  },

  // Pop effect (scale bounce on merge)
  pop: {
    mass: 0.5,
    tension: 400,
    friction: 15,
    clamp: false,
  },

  // Camera shake
  shake: {
    mass: 1,
    tension: 180,
    friction: 12,
    clamp: false,
  },

  // UI elements (modals, buttons)
  ui: {
    mass: 1,
    tension: 170,
    friction: 26,
    clamp: false,
  },

  // Slow, gentle movement (particles)
  gentle: {
    mass: 2,
    tension: 120,
    friction: 30,
    clamp: false,
  },

  // Instant (no animation)
  instant: {
    mass: 1,
    tension: 500,
    friction: 40,
    clamp: true,
  },
};

/**
 * Animation durations (in milliseconds)
 * Used as fallbacks for CSS transitions or timeouts
 */
export const ANIMATION_DURATIONS = {
  move: 150,
  spawn: 200,
  merge: 200,
  pop: 150,
  shake: 300,
  ui: 200,
  particles: 500,
} as const;

/**
 * Easing functions for non-spring animations
 */
export const EASING = {
  // Standard eases
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  cubicIn: (t: number) => t * t * t,
  cubicOut: (t: number) => --t * t * t + 1,
  cubicInOut: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Elastic (for special effects)
  elasticOut: (t: number) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1;
  },

  // Bounce (for spawn effect)
  bounceOut: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
} as const;

/**
 * Camera shake presets based on tile value
 */
export const SHAKE_INTENSITY = {
  128: 0.02,
  256: 0.03,
  512: 0.05,
  1024: 0.08,
  2048: 0.12,
  4096: 0.15,
} as const;

/**
 * Get camera shake intensity for a tile value
 */
export function getShakeIntensity(value: number): number {
  if (value >= 4096) return SHAKE_INTENSITY[4096];
  if (value >= 2048) return SHAKE_INTENSITY[2048];
  if (value >= 1024) return SHAKE_INTENSITY[1024];
  if (value >= 512) return SHAKE_INTENSITY[512];
  if (value >= 256) return SHAKE_INTENSITY[256];
  if (value >= 128) return SHAKE_INTENSITY[128];
  return 0;
}

/**
 * Particle animation parameters
 */
export const PARTICLE_CONFIG = {
  count: 20,              // Number of particles per merge
  lifetime: 0.5,          // Seconds
  speed: 2.0,             // Initial velocity
  spread: 1.0,            // Radial spread
  gravity: -3.0,          // Downward acceleration
  fadeStart: 0.3,         // When to start fading (0-1)
  scaleStart: 0.15,       // Initial scale
  scaleEnd: 0.05,         // Final scale
} as const;

/**
 * Bloom intensity modulation during merges
 */
export const BLOOM_INTENSITY = {
  base: 1.5,              // Default bloom intensity
  mergePeak: 3.0,         // Peak intensity during merge
  mergeDuration: 200,     // Duration of bloom spike (ms)
} as const;
