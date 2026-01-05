/**
 * Keyboard input hook
 * Listens for arrow key presses and triggers game moves
 */

import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../logic/constants';

export function useKeyboard() {
  const move = useGameStore((state) => state.move);
  const undo = useGameStore((state) => state.undo);
  const canUndo = useGameStore((state) => state.canUndo);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Undo (Ctrl+Z or Cmd+Z)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (canUndo) {
          e.preventDefault();
          undo();
        }
        return;
      }

      // Map keys to directions
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
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
  }, [move, undo, canUndo]);
}
