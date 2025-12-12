/**
 * Heads-Up Display
 * Shows score, best score, and moves
 * Responsive: compact on mobile, full size on desktop
 */

import { useGameStore } from '../../store/gameStore';

export default function HUD() {
  const score = useGameStore((state) => state.score);
  const bestScore = useGameStore((state) => state.bestScore);
  const moves = useGameStore((state) => state.moves);

  return (
    <div className="flex gap-2 sm:gap-4">
      {/* Score */}
      <div className="glass px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl min-w-[70px] sm:min-w-[100px]">
        <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
          Score
        </p>
        <p className="text-white text-lg sm:text-2xl font-bold cyber-glow">
          {score}
        </p>
      </div>

      {/* Best Score */}
      <div className="glass px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl min-w-[70px] sm:min-w-[100px]">
        <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
          Best
        </p>
        <p className="text-white text-lg sm:text-2xl font-bold cyber-glow">
          {bestScore}
        </p>
      </div>

      {/* Moves */}
      <div className="glass px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl min-w-[70px] sm:min-w-[100px]">
        <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
          Moves
        </p>
        <p className="text-white text-lg sm:text-2xl font-bold">
          {moves}
        </p>
      </div>
    </div>
  );
}
