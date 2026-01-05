/**
 * Game controls
 * New game, undo, settings buttons
 * Responsive: compact on mobile, full size on desktop
 */

import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Settings from './Settings';
import Help from './Help';

export default function Controls() {
  const newGame = useGameStore((state) => state.newGame);
  const undo = useGameStore((state) => state.undo);
  const canUndo = useGameStore((state) => state.canUndo);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div className="flex gap-1.5 sm:gap-2">
        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          className="glass px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all hover:bg-white/20 cursor-pointer"
          title="How to Play"
        >
          <span className="text-white text-xs sm:text-sm font-semibold">
            <span className="sm:hidden">?</span>
            <span className="hidden sm:inline">? Help</span>
          </span>
        </button>

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
          onClick={() => setShowNewGameConfirm(true)}
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

      {/* Help Modal */}
      {showHelp && (
        <Help onClose={() => setShowHelp(false)} />
      )}

      {/* New Game Confirmation Modal */}
      {showNewGameConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass p-6 rounded-2xl max-w-sm w-full border-2 border-white/30 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Start New Game?</h3>
            <p className="text-white/70 mb-6">Current progress will be lost.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewGameConfirm(false)}
                className="flex-1 glass py-2 rounded-xl text-white hover:bg-white/10 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  newGame();
                  setShowNewGameConfirm(false);
                }}
                className="flex-1 glass py-2 rounded-xl text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 font-semibold transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
