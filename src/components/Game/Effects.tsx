/**
 * Postprocessing effects for cyberpunk aesthetic
 * Bloom, Chromatic Aberration, Vignette
 */

import { useRef, useEffect } from 'react';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { BLOOM_INTENSITY } from '../../theme/animations';

export default function Effects() {
  const bloomRef = useRef<any>(null);
  const lastMerges = useGameStore((state) => state.lastMerges);
  const baseIntensity = BLOOM_INTENSITY.base;

  // Animate bloom intensity on merges
  useEffect(() => {
    if (lastMerges.length > 0 && bloomRef.current) {
      const startTime = Date.now();
      const duration = BLOOM_INTENSITY.mergeDuration;
      const peakIntensity = BLOOM_INTENSITY.mergePeak;
      let animationFrameId: number | null = null;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Spike up then ease down
        let intensity: number;
        if (progress < 0.3) {
          // Quick ramp up
          intensity = baseIntensity + ((progress / 0.3) * (peakIntensity - baseIntensity));
        } else {
          // Ease down
          const decay = (progress - 0.3) / 0.7;
          intensity = peakIntensity - (decay * (peakIntensity - baseIntensity));
        }

        if (bloomRef.current && bloomRef.current.intensity !== undefined) {
          bloomRef.current.intensity = intensity;
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else if (bloomRef.current) {
          bloomRef.current.intensity = baseIntensity;
        }
      };

      animate();

      return () => {
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        // Reset bloom intensity on cleanup
        if (bloomRef.current) {
          bloomRef.current.intensity = baseIntensity;
        }
      };
    }
  }, [lastMerges, baseIntensity]);

  return (
    <EffectComposer>
      {/* Bloom - makes neon colors glow */}
      <Bloom
        ref={bloomRef}
        intensity={baseIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        radius={0.8}
        mipmapBlur
      />

      {/* Chromatic Aberration - very subtle RGB split for cyber feel */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.0008, 0.0008)}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Vignette - darken edges for focus */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
