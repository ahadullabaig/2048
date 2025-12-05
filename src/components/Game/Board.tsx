/**
 * 3D Board component - the frosted glass surface
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { ENVIRONMENT_COLORS, hexToRgb } from '../../theme/colors';
import { BOARD_MATERIAL_PROPS, GRID_MATERIAL_PROPS } from '../../theme/materials';

export default function Board() {
  const boardSize = useGameStore((state) => state.boardSize);

  // Calculate board dimensions
  const tileSize = 1;
  const gap = 0.1;
  const totalSize = boardSize * tileSize + (boardSize - 1) * gap;

  // Create grid lines geometry
  const gridGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    const offset = totalSize / 2;

    // Horizontal lines
    for (let i = 0; i <= boardSize; i++) {
      const y = i * (tileSize + gap) - offset;
      positions.push(-offset, y, 0.01);
      positions.push(offset, y, 0.01);
    }

    // Vertical lines
    for (let i = 0; i <= boardSize; i++) {
      const x = i * (tileSize + gap) - offset;
      positions.push(x, -offset, 0.01);
      positions.push(x, offset, 0.01);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [boardSize, totalSize, tileSize, gap]);

  const boardBaseRgb = hexToRgb(ENVIRONMENT_COLORS.boardBase);

  return (
    <group>
      {/* Main board surface - frosted glass */}
      <mesh position={[0, 0, -0.05]} receiveShadow>
        <boxGeometry args={[totalSize + 0.3, totalSize + 0.3, 0.1]} />
        <meshPhysicalMaterial
          {...BOARD_MATERIAL_PROPS}
          color={new THREE.Color(...boardBaseRgb)}
        />
      </mesh>

      {/* Grid lines */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial {...GRID_MATERIAL_PROPS} />
      </lineSegments>

      {/* Board glow edge */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[totalSize + 0.4, totalSize + 0.4, 0.05]} />
        <meshBasicMaterial
          color={hexToRgb(ENVIRONMENT_COLORS.boardGlow)}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
