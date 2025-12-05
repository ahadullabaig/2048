/**
 * Touch/swipe gesture hook
 * Detects swipe gestures and triggers game moves
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Direction } from '../logic/constants';

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

const SWIPE_THRESHOLD = 50; // Minimum distance for swipe (px)
const SWIPE_TIMEOUT = 500; // Maximum time for swipe (ms)

export function useSwipe(element?: HTMLElement | null) {
  const move = useGameStore((state) => state.move);
  const touchStart = useRef<TouchPoint | null>(null);

  useEffect(() => {
    const target = element || document.body;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      // Check if swipe is valid
      if (deltaTime > SWIPE_TIMEOUT) {
        touchStart.current = null;
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine swipe direction
      let direction: Direction | null = null;

      if (absX > absY && absX > SWIPE_THRESHOLD) {
        // Horizontal swipe
        direction = deltaX > 0 ? 'right' : 'left';
      } else if (absY > absX && absY > SWIPE_THRESHOLD) {
        // Vertical swipe
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (direction) {
        e.preventDefault(); // Prevent scrolling
        move(direction);
      }

      touchStart.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling while touching the game area
      if (touchStart.current) {
        e.preventDefault();
      }
    };

    target.addEventListener('touchstart', handleTouchStart, { passive: false });
    target.addEventListener('touchend', handleTouchEnd, { passive: false });
    target.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchend', handleTouchEnd);
      target.removeEventListener('touchmove', handleTouchMove);
    };
  }, [element, move]);
}
