/**
 * Game controls
 * New game, undo, settings buttons
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
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {/* Undo Button */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`glass px-4 py-2 rounded-lg transition-all hover:bg-white/20 ${
            !canUndo ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title="Undo last move"
        >
          <span className="text-white text-sm font-semibold">↶ Undo</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="glass px-4 py-2 rounded-lg transition-all hover:bg-white/20 cursor-pointer"
          title="Settings"
        >
          <span className="text-white text-sm font-semibold">⚙ Settings</span>
        </button>

        {/* New Game Button */}
        <button
          onClick={newGame}
          className="glass px-4 py-2 rounded-lg transition-all hover:bg-white/20 cursor-pointer bg-cyan-500/20 border border-cyan-500/50"
          title="New Game"
        >
          <span className="text-cyan-400 text-sm font-semibold">New Game</span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
