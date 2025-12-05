/**
 * Heads-Up Display
 * Shows score, best score, and moves
 */

import { useGameStore } from '../../store/gameStore';

export default function HUD() {
  const score = useGameStore((state) => state.score);
  const bestScore = useGameStore((state) => state.bestScore);
  const moves = useGameStore((state) => state.moves);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
      {/* Score */}
      <div className="glass px-6 py-3 rounded-xl min-w-[120px]">
        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
          Score
        </p>
        <p className="text-white text-2xl font-bold cyber-glow">
          {score}
        </p>
      </div>

      {/* Best Score */}
      <div className="glass px-6 py-3 rounded-xl min-w-[120px]">
        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
          Best
        </p>
        <p className="text-white text-2xl font-bold cyber-glow">
          {bestScore}
        </p>
      </div>

      {/* Moves */}
      <div className="glass px-6 py-3 rounded-xl min-w-[120px]">
        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
          Moves
        </p>
        <p className="text-white text-2xl font-bold">
          {moves}
        </p>
      </div>
    </div>
  );
}
