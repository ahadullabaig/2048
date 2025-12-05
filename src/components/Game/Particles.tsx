/**
 * Particle system for merge effects
 * Spawns particles when tiles merge
 */

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { getTileColor } from '../../theme/colors';
import { PARTICLE_CONFIG } from '../../theme/animations';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
  color: THREE.Color;
}

export default function Particles() {
  const particles = useRef<Particle[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lastMerges = useGameStore((state) => state.lastMerges);

  // Dummy geometry and material for instanced mesh
  const geometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  // Maximum number of particles
  const maxParticles = 500;

  // Get board size from store
  const boardSize = useGameStore((state) => state.boardSize);

  // Spawn particles when tiles merge
  useEffect(() => {
    if (lastMerges.length === 0) return;

    const tileSize = 1;
    const gap = 0.1;

    for (const merge of lastMerges) {
      const worldX = (merge.col - (boardSize - 1) / 2) * (tileSize + gap);
      const worldY = (merge.row - (boardSize - 1) / 2) * (tileSize + gap);

      const tileColor = getTileColor(merge.value);
      const color = new THREE.Color(tileColor.glow);

      // Spawn particles
      for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        // Random direction
        const angle = (Math.PI * 2 * i) / PARTICLE_CONFIG.count + Math.random() * 0.3;
        const speed = PARTICLE_CONFIG.speed * (0.8 + Math.random() * 0.4);

        const particle: Particle = {
          position: new THREE.Vector3(worldX, worldY, 0.2),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            (Math.random() - 0.5) * speed * 0.5
          ),
          life: 0,
          maxLife: PARTICLE_CONFIG.lifetime,
          scale: PARTICLE_CONFIG.scaleStart,
          color: color.clone(),
        };

        particles.current.push(particle);

        // Remove oldest particles if exceeding max
        if (particles.current.length > maxParticles) {
          particles.current.shift();
        }
      }
    }
  }, [lastMerges]);

  // Update particles each frame
  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    let activeCount = 0;

    particles.current = particles.current.filter((particle) => {
      // Update life
      particle.life += delta;
      if (particle.life >= particle.maxLife) {
        return false; // Remove dead particles
      }

      // Update physics
      particle.position.add(
        particle.velocity.clone().multiplyScalar(delta)
      );
      particle.velocity.y += PARTICLE_CONFIG.gravity * delta; // Gravity

      // Fade out
      const lifeProgress = particle.life / particle.maxLife;
      const opacity = lifeProgress < PARTICLE_CONFIG.fadeStart
        ? 1.0
        : 1.0 - ((lifeProgress - PARTICLE_CONFIG.fadeStart) / (1 - PARTICLE_CONFIG.fadeStart));

      // Scale down over time
      const scale = THREE.MathUtils.lerp(
        PARTICLE_CONFIG.scaleStart,
        PARTICLE_CONFIG.scaleEnd,
        lifeProgress
      );

      // Update instanced mesh
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(activeCount, dummy.matrix);
      mesh.setColorAt(activeCount, particle.color);

      // Set opacity via material (approximation)
      if (mesh.instanceColor) {
        const color = particle.color.clone().multiplyScalar(opacity);
        mesh.setColorAt(activeCount, color);
      }

      activeCount++;
      return true;
    });

    mesh.count = activeCount;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, maxParticles]}
      frustumCulled={false}
    />
  );
}
