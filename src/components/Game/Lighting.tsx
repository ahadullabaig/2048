/**
 * Lighting setup for the 3D scene
 * Creates the cyberpunk atmosphere with ambient + directional lights
 */

import { ENVIRONMENT_COLORS, hexToRgb } from '../../theme/colors';

export default function Lighting() {
  const ambientRgb = hexToRgb(ENVIRONMENT_COLORS.ambient);

  return (
    <>
      {/* Ambient light - soft base illumination */}
      <ambientLight intensity={0.4} color={ambientRgb} />

      {/* Main directional light (key light) - from top-front */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light - softer, from the side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#6666ff"
      />

      {/* Rim light - creates edge glow on tiles */}
      <directionalLight
        position={[0, 2, -10]}
        intensity={0.5}
        color="#00d9ff"
      />

      {/* Point light at center for extra glow */}
      <pointLight
        position={[0, 0, 3]}
        intensity={0.5}
        distance={15}
        decay={2}
        color="#aa66ff"
      />
    </>
  );
}
