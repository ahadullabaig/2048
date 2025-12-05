/**
 * Game Over modal
 * Shows when player wins or loses
 */

import { useGameStore } from '../../store/gameStore';

export default function GameOver() {
  const gameStatus = useGameStore((state) => state.gameStatus);
  const score = useGameStore((state) => state.score);
  const bestScore = useGameStore((state) => state.bestScore);
  const newGame = useGameStore((state) => state.newGame);
  const continueAfterWin = useGameStore((state) => state.continueAfterWin);

  if (gameStatus === 'playing') return null;

  const isWin = gameStatus === 'won';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="glass p-8 rounded-2xl max-w-md w-full mx-4 border-2 border-white/30">
        {/* Title */}
        <h2
          className={`text-5xl font-bold mb-4 text-center cyber-glow ${
            isWin ? 'text-cyan-400' : 'text-red-400'
          }`}
        >
          {isWin ? 'You Win!' : 'Game Over'}
        </h2>

        {/* Message */}
        <p className="text-white/80 text-center mb-6">
          {isWin
            ? 'You reached 2048! Congratulations!'
            : 'No more moves available. Better luck next time!'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-white/60 text-xs uppercase mb-1">Final Score</p>
            <p className="text-white text-2xl font-bold">{score}</p>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <p className="text-white/60 text-xs uppercase mb-1">Best Score</p>
            <p className="text-white text-2xl font-bold">{bestScore}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {isWin && (
            <button
              onClick={continueAfterWin}
              className="w-full glass px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
            >
              <span className="text-white font-semibold">
                Keep Playing
              </span>
            </button>
          )}
          <button
            onClick={newGame}
            className="w-full glass px-6 py-3 rounded-xl hover:bg-white/20 transition-all bg-cyan-500/20 border border-cyan-500/50"
          >
            <span className="text-cyan-400 font-semibold">
              New Game
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
