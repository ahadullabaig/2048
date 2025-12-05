# 2048 Cyber Glass

A stunning, next-generation implementation of the classic 2048 game featuring **3D graphics, glassmorphism aesthetics, and physics-based animations**. Built with modern web technologies to create a portfolio-worthy gaming experience.

![2048 Cyber Glass](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

## Features

### Visual Excellence
- **3D Graphics**: Hardware-accelerated rendering using Three.js and React Three Fiber
- **Glassmorphism Design**: Frosted glass tiles with transmission materials for depth and realism
- **Bloom Effects**: Dynamic neon glow that intensifies during tile merges
- **Particle System**: Explosive effects when tiles combine, with physics-based motion
- **Camera Shake**: Reactive camera movement for high-value merges (512+)
- **Chromatic Aberration**: Subtle RGB split for a cyberpunk aesthetic
- **Physics-Based Animation**: React Spring for natural, weighted movement

### Gameplay
- **Classic 2048 Rules**: Merge tiles to reach 2048 (and beyond!)
- **Multiple Board Sizes**: Play on 3×3, 4×4, or 5×5 grids
- **Undo Functionality**: Revert your last move (up to 10 moves)
- **Responsive Controls**:
  - **Desktop**: Arrow keys
  - **Mobile**: Swipe gestures with touch feedback
- **Game State Persistence**: Best score saved to localStorage
- **Win/Loss Detection**: Smart game-over detection with continue-after-win option

### Audio
- **Procedural Synthesis**: Web Audio API generates sounds dynamically
- **Dynamic Pitch**: Tile values determine sound frequency (higher tiles = higher pitch)
- **Rich Merge Sounds**: Dual-oscillator tones for depth
- **Win/Loss Jingles**: Celebratory/consolation audio feedback

### Polish
- **TypeScript**: Fully typed codebase for reliability
- **Zustand State Management**: Clean, performant state handling
- **Glassmorphic UI**: Modern overlay with backdrop blur
- **Responsive Design**: Works on desktop, tablet, and mobile
- **60fps Performance**: Optimized for smooth gameplay

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Language** | TypeScript 5.6 |
| **Framework** | React 18 |
| **Build Tool** | Vite 6.0 |
| **3D Engine** | Three.js 0.169 |
| **3D Framework** | React Three Fiber 8.17 |
| **3D Helpers** | @react-three/drei 9.114 |
| **Postprocessing** | @react-three/postprocessing 2.16 |
| **Animation** | @react-spring/three 9.7 |
| **State** | Zustand 5.0 |
| **Styling** | TailwindCSS 3.4 |

---

## Project Structure

```
2048/
├── src/
│   ├── components/
│   │   ├── Game/          # 3D scene components
│   │   │   ├── Scene.tsx
│   │   │   ├── Board.tsx
│   │   │   ├── Tile.tsx
│   │   │   ├── TileGrid.tsx
│   │   │   ├── Camera.tsx
│   │   │   ├── Lighting.tsx
│   │   │   ├── Effects.tsx    # Bloom, ChromaticAberration, Vignette
│   │   │   └── Particles.tsx
│   │   └── UI/            # HTML overlay components
│   │       ├── HUD.tsx
│   │       ├── Controls.tsx
│   │       ├── GameOver.tsx
│   │       ├── Settings.tsx
│   │       └── MobileControls.tsx
│   ├── logic/             # Pure game logic (no React)
│   │   ├── constants.ts
│   │   ├── boardUtils.ts
│   │   └── gameLogic.ts
│   ├── store/             # Zustand stores
│   │   ├── gameStore.ts
│   │   └── settingsStore.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useKeyboard.ts
│   │   ├── useSwipe.ts
│   │   ├── useGameAudio.ts
│   │   └── useCameraShake.ts
│   ├── theme/             # Visual configuration
│   │   ├── colors.ts
│   │   ├── materials.ts
│   │   └── animations.ts
│   └── utils/
│       └── audio.ts       # Web Audio API synthesis
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 2048
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in the `dist/` folder

5. **Preview production build**
   ```bash
   npm run preview
   ```

---

## How to Play

### Desktop
- Use **arrow keys** (↑ ↓ ← →) to move tiles
- Press **Undo** to revert your last move
- Click **New Game** to restart
- Open **Settings** to change board size

### Mobile
- **Swipe** in any direction to move tiles
- Tap **Undo** to revert your last move
- Tap **New Game** to restart
- Open **Settings** to change board size

### Game Rules
1. Tiles with the same number merge when they touch
2. Each move spawns a new tile (2 or 4)
3. Reach **2048** to win (but you can keep playing!)
4. Game ends when no valid moves remain

---

## Why This Implementation is Interesting

### 1. **3D Web Graphics**
Unlike traditional 2048 clones that use DOM manipulation or 2D Canvas, this implementation leverages **WebGL** through Three.js for hardware-accelerated rendering. This allows for:
- Real-time lighting and shadows
- Glass transmission materials (refraction)
- Postprocessing effects (Bloom, DOF, Chromatic Aberration)

### 2. **Physics-Based Animation**
Instead of CSS transitions (`transition: all 0.3s ease`), this uses **React Spring** with spring physics:
```typescript
{ mass: 1, tension: 170, friction: 26 }
```
This creates natural, weighted movement that blends seamlessly when interrupted.

### 3. **Separation of Concerns**
The game logic (`/logic/`) is **pure TypeScript** with no React dependencies:
- Easy to test
- Framework-agnostic
- Portable to other platforms (React Native, game engines)

The 3D rendering is completely decoupled from game state.

### 4. **Procedural Audio**
No audio files—all sounds are generated in real-time using the **Web Audio API**:
```typescript
oscillator.frequency.value = 200 + Math.log2(tileValue) * 100;
```
This creates dynamic, context-aware audio that scales with gameplay.

### 5. **Modern Web Standards**
- **TypeScript strict mode** for type safety
- **Vite** for instant HMR and optimized builds
- **ES2020+ features** (optional chaining, nullish coalescing)
- **Tailwind CSS** for utility-first styling

---

## Performance

- **60fps** on modern hardware (tested on M1 MacBook, iPhone 13)
- **~970KB** initial bundle (mostly Three.js, which is standard)
- **Sub-100ms** time-to-interactive
- **Lazy loading** for postprocessing effects

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Safari | ✅ Full |
| Chrome Android | ✅ Full |

WebGL 2.0 required for postprocessing effects.

---

## Roadmap / Future Enhancements

- [ ] Leaderboard (with backend integration)
- [ ] Multiple themes (synthwave, minimalist, brutalist)
- [ ] Animation customization (toggle bloom, particles, shake)
- [ ] Replay system (record and playback games)
- [ ] AI solver mode
- [ ] Accessibility improvements (screen reader, high contrast)

---

## License

MIT License - feel free to use this for your portfolio, modify it, or learn from it!

---

## Credits

- **Game Design**: Gabriele Cirulli (original 2048)
- **Implementation**: Ahad
- **Inspiration**: Cyberpunk aesthetics, glassmorphism design trends

---

## Development

### Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Type-check with TypeScript
```

### Code Quality
- **Strict TypeScript** enabled
- **No unused variables** (enforced by tsconfig)
- **Immutable state updates** (Zustand + pure functions)
- **Modular architecture** (easy to extend)

---

**Built with care for the web. Star this repo if you found it useful!**
