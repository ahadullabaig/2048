/**
 * Keyboard input hook
 * Listens for arrow key presses and triggers game moves
 */

import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../logic/constants';

export function useKeyboard() {
  const move = useGameStore((state) => state.move);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map arrow keys to directions
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = keyMap[e.key];

      if (direction) {
        e.preventDefault(); // Prevent page scrolling
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [move]);
}
