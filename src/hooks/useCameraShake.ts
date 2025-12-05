/**
 * Hook to trigger camera shake on large merges
 */

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getShakeIntensity } from '../theme/animations';

export interface ShakeConfig {
  intensity: number;
  duration: number;
}

export function useCameraShake() {
  const [shake, setShake] = useState<ShakeConfig | undefined>(undefined);
  const lastMerges = useGameStore((state) => state.lastMerges);
  const prevMergesRef = useRef(lastMerges);

  useEffect(() => {
    // Only trigger on new merges
    if (lastMerges.length > 0 && lastMerges !== prevMergesRef.current) {
      // Find the largest merged tile
      const maxMergeValue = Math.max(...lastMerges.map((m) => m.value));
      const intensity = getShakeIntensity(maxMergeValue);

      if (intensity > 0) {
        setShake({
          intensity,
          duration: 300, // ms
        });

        // Clear shake after animation
        setTimeout(() => {
          setShake(undefined);
        }, 300);
      }
    }

    prevMergesRef.current = lastMerges;
  }, [lastMerges]);

  return shake;
}
