/**
 * Settings modal
 * Board size selector and other preferences
 */

import { useGameStore } from '../../store/gameStore';
import type { BoardSize } from '../../logic/constants';
import { BOARD_SIZES } from '../../logic/constants';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const boardSize = useGameStore((state) => state.boardSize);
  const setBoardSize = useGameStore((state) => state.setBoardSize);

  const handleBoardSizeChange = (size: BoardSize) => {
    setBoardSize(size);
    onClose();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="glass p-8 rounded-2xl max-w-md w-full mx-4 border-2 border-white/30">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-white cyber-glow">
          Settings
        </h2>

        {/* Board Size */}
        <div className="mb-6">
          <p className="text-white/80 mb-3 font-semibold">Board Size</p>
          <div className="grid grid-cols-3 gap-3">
            {BOARD_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handleBoardSizeChange(size)}
                className={`glass px-6 py-4 rounded-xl transition-all hover:bg-white/20 ${
                  boardSize === size
                    ? 'bg-cyan-500/20 border-2 border-cyan-500/80'
                    : 'border-2 border-white/20'
                }`}
              >
                <span
                  className={`font-bold text-lg ${
                    boardSize === size ? 'text-cyan-400' : 'text-white'
                  }`}
                >
                  {size}×{size}
                </span>
              </button>
            ))}
          </div>
          <p className="text-white/50 text-xs mt-2">
            Note: Changing board size will start a new game
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full glass px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
        >
          <span className="text-white font-semibold">Close</span>
        </button>
      </div>
    </div>
  );
}
