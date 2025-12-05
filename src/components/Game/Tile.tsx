/**
 * Individual 3D Tile component with animations
 * Features: glass material, glowing text, physics-based movement
 */

import { useRef, useEffect, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import type { TileValue } from '../../logic/constants';
import { getTileColor, getTileTextColor } from '../../theme/colors';
import { createTileMaterial } from '../../theme/materials';
import { SPRING_CONFIGS } from '../../theme/animations';

interface TileProps {
  value: TileValue;
  gridX: number; // Grid position (0-indexed)
  gridY: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export default function Tile({ value, gridX, gridY, isNew = false, isMerged = false }: TileProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Convert grid position to 3D world position
  const tileSize = 1;
  const gap = 0.1;
  const boardSize = useGameStore((state) => state.boardSize);

  const worldX = (gridX - (boardSize - 1) / 2) * (tileSize + gap);
  const worldY = (gridY - (boardSize - 1) / 2) * (tileSize + gap);

  // Material for this tile
  const material = useMemo(() => createTileMaterial(value), [value]);

  // Colors for text
  const tileColor = getTileColor(value);
  const textColor = getTileTextColor(value);

  // Animation: Position (for movement)
  const { position } = useSpring({
    position: [worldX, worldY, 0] as [number, number, number],
    config: SPRING_CONFIGS.move,
  });

  // Animation: Scale (for spawn and merge)
  const [{ scale }, scaleApi] = useSpring(() => ({
    scale: [0, 0, 0] as [number, number, number],
    config: SPRING_CONFIGS.spawn,
  }));

  // Trigger spawn animation when tile is new
  useEffect(() => {
    if (isNew) {
      scaleApi.start({
        from: { scale: [0, 0, 0] },
        to: { scale: [1, 1, 1] },
        config: SPRING_CONFIGS.spawn,
      });
    } else {
      scaleApi.set({ scale: [1, 1, 1] });
    }
  }, [isNew, scaleApi]);

  // Trigger merge animation (pop effect)
  useEffect(() => {
    if (isMerged) {
      scaleApi.start({
        from: { scale: [1, 1, 1] },
        to: async (next) => {
          await next({ scale: [1.2, 1.2, 1.2], config: SPRING_CONFIGS.pop });
          await next({ scale: [1, 1, 1], config: SPRING_CONFIGS.pop });
        },
      });
    }
  }, [isMerged, scaleApi]);

  // Don't render if value is 0
  if (value === 0) return null;

  return (
    <animated.group position={position} scale={scale}>
      {/* Tile cube with glass material */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[tileSize * 0.9, tileSize * 0.9, 0.3]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Tile number text */}
      <Text
        position={[0, 0, 0.16]}
        fontSize={0.4}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        outlineWidth={0.02}
        outlineColor={tileColor.glow}
      >
        {value}
      </Text>

      {/* Glow plane behind text */}
      <mesh position={[0, 0, 0.15]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial
          color={tileColor.glow}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </animated.group>
  );
}
