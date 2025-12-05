/**
 * Camera controller with shake effects
 */

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CameraRigProps {
  shake?: { intensity: number; duration: number };
}

export default function CameraRig({ shake }: CameraRigProps) {
  const { camera } = useThree();
  const shakeRef = useRef({ intensity: 0, duration: 0, elapsed: 0 });
  const originalPosition = useRef(new THREE.Vector3(0, 0, 12));

  // Update shake parameters when prop changes
  useEffect(() => {
    if (shake) {
      shakeRef.current = { ...shake, elapsed: 0 };
    }
  }, [shake]);

  // Apply camera shake on each frame
  useFrame((_state, delta) => {
    const shakeState = shakeRef.current;

    if (shakeState.intensity > 0 && shakeState.elapsed < shakeState.duration) {
      shakeState.elapsed += delta * 1000; // Convert to ms

      // Calculate shake decay
      const progress = shakeState.elapsed / shakeState.duration;
      const decay = 1 - progress;
      const currentIntensity = shakeState.intensity * decay;

      // Apply random offset
      const offsetX = (Math.random() - 0.5) * currentIntensity;
      const offsetY = (Math.random() - 0.5) * currentIntensity;

      camera.position.x = originalPosition.current.x + offsetX;
      camera.position.y = originalPosition.current.y + offsetY;
    } else if (shakeState.intensity > 0) {
      // Shake complete, reset intensity
      shakeState.intensity = 0;
      camera.position.copy(originalPosition.current);
    }
  });

  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 0, 12]}
      fov={50}
      near={0.1}
      far={100}
    />
  );
}
