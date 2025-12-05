/**
 * Main 3D Scene component
 * Sets up the Canvas and renders all 3D elements
 */

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ENVIRONMENT_COLORS, hexToRgb } from '../../theme/colors';
import Lighting from './Lighting';
import CameraRig from './Camera';
import Board from './Board';
import TileGrid from './TileGrid';
import Effects from './Effects';
import Particles from './Particles';
import { useCameraShake } from '../../hooks/useCameraShake';

export default function Scene() {
  const shake = useCameraShake();
  const bgRgb = hexToRgb(ENVIRONMENT_COLORS.background);
  const bgColor = new THREE.Color(...bgRgb);
  const fogColor = new THREE.Color(...hexToRgb(ENVIRONMENT_COLORS.fog));

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]} // Device pixel ratio for retina displays
    >
      {/* Background color */}
      <color attach="background" args={[bgColor]} />

      {/* Fog for depth */}
      <fog attach="fog" args={[fogColor, 10, 30]} />

      {/* Camera */}
      <CameraRig shake={shake} />

      {/* Lights */}
      <Lighting />

      {/* Board */}
      <Board />

      {/* Tiles */}
      <TileGrid />

      {/* Particles */}
      <Particles />

      {/* Postprocessing effects */}
      <Effects />
    </Canvas>
  );
}
