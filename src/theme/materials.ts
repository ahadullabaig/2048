/**
 * Three.js material configurations for cyber-glass aesthetic
 */

import * as THREE from 'three';
import { getTileColor, hexToRgb } from './colors';
import type { TileValue } from '../logic/constants';

/**
 * Material properties for tiles
 */
export interface TileMaterialProps {
  color: THREE.Color;
  emissive: THREE.Color;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  transmission: number;
  thickness: number;
  ior: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

/**
 * Get material properties for a tile based on its value
 */
export function getTileMaterialProps(value: TileValue): Partial<TileMaterialProps> {
  const tileColor = getTileColor(value);
  const baseRgb = hexToRgb(tileColor.base);
  const glowRgb = hexToRgb(tileColor.glow);

  return {
    color: new THREE.Color(...baseRgb),
    emissive: new THREE.Color(...glowRgb),
    emissiveIntensity: tileColor.intensity * 0.5,
    metalness: 0.1,
    roughness: 0.2,
    // Transmission creates the glass effect
    transmission: 0.3,
    thickness: 0.5,
    ior: 1.5, // Index of refraction (glass-like)
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  };
}

/**
 * Board material configuration (frosted glass)
 */
export const BOARD_MATERIAL_PROPS = {
  color: new THREE.Color(0.09, 0.09, 0.12), // #16161d
  metalness: 0.9,
  roughness: 0.1,
  transmission: 0.1,
  thickness: 2.0,
  ior: 1.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.2,
  opacity: 0.8,
  transparent: true,
};

/**
 * Grid line material
 */
export const GRID_MATERIAL_PROPS = {
  color: new THREE.Color(1, 1, 1),
  opacity: 0.05,
  transparent: true,
  depthWrite: false,
};

/**
 * Particle material (for merge effects)
 */
export const PARTICLE_MATERIAL_PROPS = {
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide,
};

/**
 * Create a standard tile material
 */
export function createTileMaterial(value: TileValue): THREE.MeshPhysicalMaterial {
  const props = getTileMaterialProps(value);

  return new THREE.MeshPhysicalMaterial({
    color: props.color,
    emissive: props.emissive,
    emissiveIntensity: props.emissiveIntensity,
    metalness: props.metalness,
    roughness: props.roughness,
    transmission: props.transmission,
    thickness: props.thickness,
    ior: props.ior,
    clearcoat: props.clearcoat,
    clearcoatRoughness: props.clearcoatRoughness,
    side: THREE.FrontSide,
  });
}

/**
 * Create board material
 */
export function createBoardMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial(BOARD_MATERIAL_PROPS);
}

/**
 * Animation intensity curves
 * Maps animation progress (0-1) to intensity multiplier
 */
export const ANIMATION_CURVES = {
  // Spawn animation: quick pop-in with slight overshoot
  spawn: (t: number): number => {
    // Elastic ease-out
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },

  // Merge animation: dramatic flash then settle
  merge: (t: number): number => {
    // Spike at 0.3, then ease down
    if (t < 0.3) {
      return 1 + (t / 0.3) * 2; // Ramp up to 3x
    }
    return 3 - ((t - 0.3) / 0.7) * 2; // Ease down to 1x
  },

  // Move animation: smooth ease
  move: (t: number): number => {
    // Cubic ease-in-out
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
};
