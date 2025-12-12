/**
 * Game controls
 * New game, undo, settings buttons
 * Responsive: compact on mobile, full size on desktop
 */

import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Settings from './Settings';

export default function Controls() {
  const newGame = useGameStore((state) => state.newGame);
  const undo = useGameStore((state) => state.undo);
  const canUndo = useGameStore((state) => state.canUndo);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="flex gap-1.5 sm:gap-2">
        {/* Undo Button */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`glass px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all hover:bg-white/20 ${!canUndo ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          title="Undo last move"
        >
          <span className="text-white text-xs sm:text-sm font-semibold">
            <span className="sm:hidden">↶</span>
            <span className="hidden sm:inline">↶ Undo</span>
          </span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="glass px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all hover:bg-white/20 cursor-pointer"
          title="Settings"
        >
          <span className="text-white text-xs sm:text-sm font-semibold">
            <span className="sm:hidden">⚙</span>
            <span className="hidden sm:inline">⚙ Settings</span>
          </span>
        </button>

        {/* New Game Button */}
        <button
          onClick={newGame}
          className="glass px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all hover:bg-white/20 cursor-pointer bg-cyan-500/20 border border-cyan-500/50"
          title="New Game"
        >
          <span className="text-cyan-400 text-xs sm:text-sm font-semibold">
            <span className="sm:hidden">New</span>
            <span className="hidden sm:inline">New Game</span>
          </span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
