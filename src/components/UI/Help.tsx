/**
 * Help modal
 * Shows game instructions
 */

interface HelpProps {
  onClose: () => void;
}

export default function Help({ onClose }: HelpProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="glass p-6 sm:p-8 rounded-2xl max-w-md w-full border-2 border-white/30 text-left relative transform transition-all">
          {/* Title */}
          <h2 className="text-3xl font-bold mb-6 text-white cyber-glow">
            How to Play
          </h2>

          <div className="space-y-4 mb-8 text-white/90">
            <div className="glass p-4 rounded-xl">
              <h3 className="text-cyan-400 font-bold mb-2">Controls</h3>
              <p>Swipe or use <kbd className="bg-white/10 px-1 rounded">Arrow Keys</kbd> / <kbd className="bg-white/10 px-1 rounded">WASD</kbd> to move tiles.</p>
            </div>

            <div className="glass p-4 rounded-xl">
              <h3 className="text-cyan-400 font-bold mb-2">Rules</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Tiles with the same number merge into one when they touch.</li>
                <li>Add them up to reach <strong className="text-yellow-400">2048</strong>!</li>
                <li><span className="text-white/60">2 + 2 = 4</span></li>
                <li><span className="text-white/60">4 + 4 = 8</span></li>
              </ul>
            </div>

            <div className="glass p-4 rounded-xl">
              <h3 className="text-cyan-400 font-bold mb-2">Shortcuts</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><kbd className="bg-white/10 px-1 rounded">Ctrl</kbd> + <kbd className="bg-white/10 px-1 rounded">Z</kbd> to Undo</li>
              </ul>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full glass px-6 py-3 rounded-xl hover:bg-white/20 transition-all bg-cyan-500/20 border border-cyan-500/50"
          >
            <span className="text-cyan-400 font-bold">Got it!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
