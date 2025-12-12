import { useRef } from 'react';
import Scene from './components/Game/Scene';
import MobileControls from './components/UI/MobileControls';
import HUD from './components/UI/HUD';
import Controls from './components/UI/Controls';
import GameOver from './components/UI/GameOver';
import { useKeyboard } from './hooks/useKeyboard';
import { useSwipe } from './hooks/useSwipe';
import { useGameAudio } from './hooks/useGameAudio';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize input handlers
  useKeyboard();
  useSwipe(containerRef);

  // Initialize audio
  useGameAudio();

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* 3D Scene */}
      <Scene />

      {/* Responsive Header - HUD + Controls */}
      <header className="absolute top-0 left-0 right-0 z-10 p-2 sm:p-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {/* Stats (Score, Best, Moves) */}
          <HUD />
          {/* Controls (Undo, Settings, New Game) */}
          <Controls />
        </div>
      </header>

      <MobileControls />
      <GameOver />
    </div>
  );
}

export default App;
