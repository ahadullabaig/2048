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
  useSwipe(containerRef.current);

  // Initialize audio
  useGameAudio();

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* 3D Scene */}
      <Scene />

      {/* UI Overlay */}
      <HUD />
      <Controls />
      <MobileControls />
      <GameOver />
    </div>
  );
}

export default App;
