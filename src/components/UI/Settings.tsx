/**
 * Settings modal
 * Board size selector and other preferences
 */

import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { BoardSize } from '../../logic/constants';
import { BOARD_SIZES } from '../../logic/constants';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const boardSize = useGameStore((state) => state.boardSize);
  const setBoardSize = useGameStore((state) => state.setBoardSize);

  const {
    audioEnabled, setAudioEnabled,
    showParticles, setShowParticles,
    showGrid, setShowGrid
  } = useSettingsStore();

  const handleBoardSizeChange = (size: BoardSize) => {
    setBoardSize(size);
    // We don't close immediately so user can change other settings
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="glass p-6 sm:p-8 rounded-2xl max-w-md w-full border-2 border-white/30 text-left relative transform transition-all">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-6 text-white cyber-glow">
            Settings
          </h2>

          {/* Board Size */}
          <div className="mb-6">
            <p className="text-white/80 mb-3 font-semibold">Board Size</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {BOARD_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => handleBoardSizeChange(size)}
                  className={`glass px-3 py-2 sm:px-6 sm:py-4 rounded-xl transition-all hover:bg-white/20 ${boardSize === size
                    ? 'bg-cyan-500/20 border-2 border-cyan-500/80'
                    : 'border-2 border-white/20'
                    }`}
                >
                  <span
                    className={`font-bold text-lg ${boardSize === size ? 'text-cyan-400' : 'text-white'
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

          {/* Visual Settings */}
          <div className="mb-6 space-y-3">
            <p className="text-white/80 font-semibold">Visuals</p>
            
            <label className="flex items-center justify-between glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-white">Particles</span>
              <div 
                className={`w-12 h-6 rounded-full p-1 transition-colors ${showParticles ? 'bg-cyan-500/50' : 'bg-white/10'}`}
                onClick={(e) => { e.preventDefault(); setShowParticles(!showParticles); }}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${showParticles ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </label>

            <label className="flex items-center justify-between glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-white">Grid Lines</span>
              <div 
                className={`w-12 h-6 rounded-full p-1 transition-colors ${showGrid ? 'bg-cyan-500/50' : 'bg-white/10'}`}
                onClick={(e) => { e.preventDefault(); setShowGrid(!showGrid); }}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${showGrid ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </label>
          </div>

          {/* Audio Settings */}
          <div className="mb-8">
            <p className="text-white/80 font-semibold mb-3">Audio</p>
            <label className="flex items-center justify-between glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-white">Sound Effects</span>
              <div 
                className={`w-12 h-6 rounded-full p-1 transition-colors ${audioEnabled ? 'bg-cyan-500/50' : 'bg-white/10'}`}
                onClick={(e) => { e.preventDefault(); setAudioEnabled(!audioEnabled); }}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${audioEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </label>
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
    </div>
  );
}
