/**
 * Mobile touch controls overlay
 * Provides visual feedback for swipe gestures
 */

export default function MobileControls() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Swipe hint - only shown on mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-lg md:hidden">
        <p className="text-white/60 text-sm">Swipe to move</p>
      </div>
    </div>
  );
}
