/**
 * Hook to integrate audio with game state
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { playMergeSound, playWinSound, playLoseSound, resumeAudioContext } from '../utils/audio';

export function useGameAudio() {
  const lastMerges = useGameStore((state) => state.lastMerges);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const prevGameStatusRef = useRef<string>('playing');
  const mergeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Resume audio context on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      resumeAudioContext();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Play merge sounds
  useEffect(() => {
    // Clear any pending timeouts from previous merges
    mergeTimeoutsRef.current.forEach(clearTimeout);
    mergeTimeoutsRef.current = [];

    if (lastMerges.length > 0) {
      // Play sounds for all merges (with slight delay between them)
      lastMerges.forEach((merge, index) => {
        const timeoutId = setTimeout(() => {
          playMergeSound(merge.value);
        }, index * 50);
        mergeTimeoutsRef.current.push(timeoutId);
      });
    }

    return () => {
      // Cleanup on unmount or before next effect run
      mergeTimeoutsRef.current.forEach(clearTimeout);
      mergeTimeoutsRef.current = [];
    };
  }, [lastMerges]);

  // Play win/lose sounds
  useEffect(() => {
    const prevStatus = prevGameStatusRef.current;

    if (prevStatus === 'playing' && gameStatus === 'won') {
      playWinSound();
    } else if (prevStatus === 'playing' && gameStatus === 'lost') {
      playLoseSound();
    }

    prevGameStatusRef.current = gameStatus;
  }, [gameStatus]);
}
